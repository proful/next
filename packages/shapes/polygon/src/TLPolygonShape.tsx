import * as React from 'react'
import { computed, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import {
  BoundsUtils,
  TLBounds,
  TLShapeProps,
  TLResizeInfo,
  PointUtils,
  TLCustomProps,
  PolygonUtils,
} from '@tldraw/core'
import { SVGContainer, TLComponentProps, TLIndicatorProps } from '@tldraw/react'
import { Vec } from '@tldraw/vec'
import { intersectLineSegmentPolyline, intersectPolygonBounds } from '@tldraw/intersect'
import { TLBoxShape, TLBoxShapeProps } from '@tldraw/box-shape'

export interface TLPolygonShapeProps extends TLBoxShapeProps {
  sides: number
  ratio: number
  isFlippedY: boolean
}

export class TLPolygonShape<P extends TLPolygonShapeProps = any> extends TLBoxShape<P> {
  constructor(props = {} as TLCustomProps<Partial<P>>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  @observable sides = 3
  @observable ratio = 1
  @observable isFlippedY = false

  static id = 'polygon'

  Component = observer(({ events, isErasing }: TLComponentProps) => {
    const {
      offset: [x, y],
    } = this

    return (
      <SVGContainer {...events} opacity={isErasing ? 0.2 : 1}>
        <polygon
          transform={`translate(${x}, ${y})`}
          points={this.vertices.join()}
          stroke={'#000'}
          fill={'none'}
          strokeWidth={2}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const {
      offset: [x, y],
    } = this

    return <polygon transform={`translate(${x}, ${y})`} points={this.vertices.join()} />
  })

  @computed get vertices() {
    return this.getVertices()
  }

  @computed get pageVertices() {
    const { point, vertices } = this
    return vertices.map((vert) => Vec.add(vert, point))
  }

  @computed get centroid() {
    const { vertices } = this
    return PolygonUtils.getPolygonCentroid(vertices)
  }

  @computed get rotatedVertices() {
    const { vertices, centroid, rotation } = this
    if (!rotation) return vertices
    return vertices.map((v) => Vec.rotWith(v, centroid, rotation))
  }

  getRotatedBounds = (): TLBounds => {
    const { rotatedVertices, point, offset } = this
    return BoundsUtils.translateBounds(
      BoundsUtils.getBoundsFromPoints(rotatedVertices),
      Vec.add(point, offset)
    )
  }

  @computed get offset() {
    const {
      size: [w, h],
    } = this
    const center = BoundsUtils.getBoundsCenter(BoundsUtils.getBoundsFromPoints(this.vertices))
    return Vec.sub(Vec.div([w, h], 2), center)
  }

  getVertices(padding = 0): number[][] {
    const { ratio, sides, size, isFlippedY } = this
    const vertices =
      sides === 3
        ? PolygonUtils.getTriangleVertices(size, padding, ratio)
        : PolygonUtils.getPolygonVertices(size, sides, padding, ratio)

    if (isFlippedY) {
      return vertices.map((point) => [point[0], size[1] - point[1]])
    }

    return vertices
  }

  initialFlipped = this.isFlippedY

  onResizeStart = () => {
    this.initialFlipped = this.isFlippedY
  }

  onResize = (bounds: TLBounds, info: TLResizeInfo<P>) => {
    const { initialFlipped } = this
    return this.update({
      point: [bounds.minX, bounds.minY],
      size: [Math.max(1, bounds.width), Math.max(1, bounds.height)],
      isFlippedY: info.scaleY < 0 ? !initialFlipped : initialFlipped,
    })
  }

  hitTestPoint = (point: number[]): boolean => {
    const { vertices } = this
    return PointUtils.pointInPolygon(Vec.add(point, this.point), vertices)
  }

  hitTestLineSegment = (A: number[], B: number[]): boolean => {
    const { vertices, point } = this
    return intersectLineSegmentPolyline(Vec.sub(A, point), Vec.sub(B, point), vertices).didIntersect
  }

  hitTestBounds = (bounds: TLBounds): boolean => {
    const { rotatedBounds, offset, rotatedVertices, point } = this
    const oBounds = BoundsUtils.translateBounds(bounds, Vec.neg(Vec.add(point, offset)))
    return (
      BoundsUtils.boundsContain(bounds, rotatedBounds) ||
      rotatedVertices.every((vert) => PointUtils.pointInBounds(vert, oBounds)) ||
      intersectPolygonBounds(rotatedVertices, oBounds).length > 0
    )
  }

  validateProps = (props: Partial<TLShapeProps> & Partial<P>) => {
    if (props.point) props.point = [0, 0]
    if (props.sides !== undefined && props.sides < 3) props.sides = 3
    return props
  }
}
