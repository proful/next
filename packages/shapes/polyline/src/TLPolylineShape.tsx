import * as React from 'react'
import { computed, makeObservable, observable, override } from 'mobx'
import { observer } from 'mobx-react-lite'
import {
  BoundsUtils,
  TLBounds,
  TLShapeProps,
  TLResizeInfo,
  PointUtils,
  TLCustomProps,
  PolygonUtils,
  TLHandle,
  TLShape,
  TLShapeWithHandles,
} from '@tldraw/core'
import { SVGContainer, TLComponentProps, TLIndicatorProps } from '@tldraw/react'
import { Vec } from '@tldraw/vec'
import {
  intersectBoundsLineSegment,
  intersectLineSegmentPolyline,
  intersectPolylineBounds,
} from '@tldraw/intersect'

export interface TLPolylineShapeProps extends TLShapeProps {
  handles: TLHandle[]
}

export class TLPolylineShape<P extends TLPolylineShapeProps = any> extends TLShapeWithHandles<P> {
  constructor(props = {} as TLCustomProps<Partial<P>>) {
    super(props)
    this.init(props)
    this.handles = props.handles || [{ point: [0, 0] }]
    makeObservable(this)
  }

  static id = 'polyline'

  // handles: TLHandle[]

  ReactComponent = observer(({ events, isErasing }: TLComponentProps) => {
    const { points } = this

    return (
      <SVGContainer {...events} opacity={isErasing ? 0.2 : 1}>
        <path
          points={'M' + points.join('L')}
          stroke={'#000'}
          fill={'none'}
          strokeWidth={2}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  ReactIndicator = observer((props: TLIndicatorProps) => {
    const { points } = this

    return <path points={'M' + points.join('L')} />
  })

  @computed get points() {
    return this.handles.map((h) => h.point)
  }

  @computed get centroid() {
    const { points } = this
    return PolygonUtils.getPolygonCentroid(points)
  }

  @computed get rotatedPoints() {
    const { centroid, handles, rotation } = this
    if (!rotation) return this.points
    return handles.map((h) => Vec.rotWith(h.point, centroid, rotation))
  }

  getBounds = (): TLBounds => {
    const { points, point } = this
    return BoundsUtils.translateBounds(BoundsUtils.getBoundsFromPoints(points), point)
  }

  getRotatedBounds = (): TLBounds => {
    const { rotatedPoints, point } = this
    return BoundsUtils.translateBounds(BoundsUtils.getBoundsFromPoints(rotatedPoints), point)
  }

  private normalizedHandles: number[][] = []

  onResizeStart = () => {
    const { handles, bounds } = this
    const size = [bounds.width, bounds.height]
    this.normalizedHandles = handles.map((h) => Vec.divV(h.point, size))
  }

  onResize = (bounds: TLBounds, info: TLResizeInfo<P>) => {
    const { handles, normalizedHandles } = this
    const size = [bounds.width, bounds.height]

    return this.update({
      point: [bounds.minX, bounds.minY],
      handles: handles.map((handle, i) => ({
        ...handle,
        point: Vec.mulV(normalizedHandles[i], size),
      })),
    })
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

  validateProps = (props: Partial<TLShapeProps> & Partial<P>) => {
    if (props.point) props.point = [0, 0]
    if (props.handles !== undefined && props.handles.length < 1) props.handles = [{ point: [0, 0] }]
    return props
  }
}
