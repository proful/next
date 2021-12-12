import * as React from 'react'
import { makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import {
  SVGContainer,
  TLShape,
  BoundsUtils,
  TLBounds,
  TLComponentProps,
  TLIndicatorProps,
  TLResizeInfo,
  TLCustomProps,
} from '@tldraw/core'

export interface TLBoxShapeProps {
  size: number[]
}

export class TLBoxShape<P extends TLBoxShapeProps = any> extends TLShape<P & TLBoxShapeProps> {
  constructor(props = {} as TLCustomProps<Partial<P>>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'box'

  @observable size: number[] = [100, 100]

  Component = observer(({ events, isErasing }: TLComponentProps) => {
    const {
      size: [w, h],
    } = this

    return (
      <SVGContainer {...events} opacity={isErasing ? 0.2 : 1}>
        <rect
          width={Math.max(0.01, w)}
          height={Math.max(0.01, h)}
          stroke={'#000'}
          fill={'none'}
          strokeWidth={2}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    return <rect width={this.size[0]} height={this.size[1]} fill="transparent" />
  })

  getBounds = (): TLBounds => {
    const [x, y] = this.point
    const [width, height] = this.size
    return {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height,
      width,
      height,
    }
  }

  getRotatedBounds = (): TLBounds => {
    return BoundsUtils.getBoundsFromPoints(
      BoundsUtils.getRotatedCorners(this.bounds, this.rotation)
    )
  }

  onResize = (bounds: TLBounds, info: TLResizeInfo<P>): this => {
    return this.update({
      point: [bounds.minX, bounds.minY],
      size: [Math.max(1, bounds.width), Math.max(1, bounds.height)],
    })
  }
}
