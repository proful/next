import * as React from 'react'
import { computed, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import {
  TLShape,
  BoundsUtils,
  TLBounds,
  TLIndicatorProps,
  TLResizeInfo,
  PointUtils,
  TLCustomProps,
} from '@tldraw/core'
import { Vec } from '@tldraw/vec'
import {
  intersectBoundsLineSegment,
  intersectLineSegmentPolyline,
  intersectPolylineBounds,
} from '@tldraw/intersect'
import { SVGContainer, TLComponentProps } from '@tldraw/react'

export interface TLDrawShapeProps {
  points: number[][]
  isComplete: boolean
}

export class TLDrawShape<P extends TLDrawShapeProps = any> extends TLShape<P> {
  constructor(props = {} as TLCustomProps<Partial<P>>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'draw'

  @observable points: number[][] = []
  @observable isComplete = false

  Component = observer(({ events, isErasing }: TLComponentProps) => {
    const { points } = this

    return (
      <SVGContainer {...events} opacity={isErasing ? 0.2 : 1}>
        <polyline
          points={points.join()}
          stroke={'#000'}
          fill={'none'}
          strokeWidth={2}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const { points } = this
    return <polyline points={points.join()} fill="transparent" />
  })

  /** The shape's bounds in "shape space". */
  @computed get pointBounds(): TLBounds {
    const { points } = this
    return BoundsUtils.getBoundsFromPoints(points)
  }

  /** The shape's bounds in "page space". */
  getBounds = (): TLBounds => {
    const { pointBounds, point } = this
    return BoundsUtils.translateBounds(pointBounds, point)
  }

  /** The shape's rotated points in "shape space". */
  @computed get rotatedPoints(): number[][] {
    const { point, points, center, rotation } = this
    if (!this.rotation) return points
    const relativeCenter = Vec.sub(center, point)
    return points.map((point) => Vec.rotWith(point, relativeCenter, rotation))
  }

  /** The shape's rotated bounds in "page space". */
  getRotatedBounds = (): TLBounds => {
    const { rotation, bounds, rotatedPoints } = this
    if (!rotation) return bounds
    return BoundsUtils.translateBounds(BoundsUtils.getBoundsFromPoints(rotatedPoints), this.point)
  }

  /**
   * A snapshot of the shape's points normalized against its bounds. For performance and memory
   * reasons, this property must be set manually with `setNormalizedPoints`.
   */
  normalizedPoints: number[][] = []
  isResizeFlippedX = false
  isResizeFlippedY = false

  /** Prepare the shape for a resize session. */
  onResizeStart = () => {
    const { bounds, points } = this
    const size = [bounds.width, bounds.height]
    this.normalizedPoints = points.map((point) => Vec.divV(point, size))
  }

  /**
   * Resize the shape to fit a new bounding box.
   *
   * @param bounds
   * @param info
   */
  onResize = (bounds: TLBounds, info: TLResizeInfo<P>) => {
    const size = [bounds.width, bounds.height]
    const flipX = info.scaleX < 0
    const flipY = info.scaleY < 0

    this.update({
      point: [bounds.minX, bounds.minY],
      points: this.normalizedPoints.map((point) => {
        if (flipX) point = [1 - point[0], point[1]]
        if (flipY) point = [point[0], 1 - point[1]]
        return Vec.mulV(point, size).concat(point[2])
      }),
    })
    return this
  }

  hitTestPoint = (point: number[]): boolean => {
    const { points } = this
    return PointUtils.pointNearToPolyline(Vec.sub(point, this.point), points)
  }

  hitTestLineSegment = (A: number[], B: number[]): boolean => {
    const { bounds, points, point } = this
    if (
      PointUtils.pointInBounds(A, bounds) ||
      PointUtils.pointInBounds(B, bounds) ||
      intersectBoundsLineSegment(bounds, A, B).length > 0
    ) {
      const rA = Vec.sub(A, point)
      const rB = Vec.sub(B, point)
      return (
        intersectLineSegmentPolyline(rA, rB, points).didIntersect ||
        !!points.find((point) => Vec.dist(rA, point) < 5 || Vec.dist(rB, point) < 5)
      )
    }
    return false
  }

  hitTestBounds = (bounds: TLBounds): boolean => {
    const { rotatedBounds, points, point } = this
    const oBounds = BoundsUtils.translateBounds(bounds, Vec.neg(point))
    return (
      BoundsUtils.boundsContain(bounds, rotatedBounds) ||
      points.every((vert) => PointUtils.pointInBounds(vert, oBounds)) ||
      (BoundsUtils.boundsCollide(bounds, rotatedBounds) &&
        intersectPolylineBounds(points, oBounds).length > 0)
    )
  }
}
