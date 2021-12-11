/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { getStroke } from 'perfect-freehand'
import {
  assignOwnProps,
  SVGContainer,
  SvgPathUtils,
  TLComponentProps,
  TLCustomProps,
  TLDrawShape,
  TLDrawShapeProps,
  TLIndicatorProps,
  TLShapeProps,
} from '@tldraw/next'
import { observer } from 'mobx-react-lite'
import { observable, computed, makeObservable } from 'mobx'
import { NuStyleProps, withClampedStyles } from './NuStyleProps'

export interface NuPenShapeProps extends TLDrawShapeProps, NuStyleProps {}

export class NuPenShape extends TLDrawShape<NuPenShapeProps> {
  constructor(props = {} as TLCustomProps<NuPenShapeProps>) {
    super(props)
    assignOwnProps(this, props)
    makeObservable(this)
  }

  static id = 'draw'

  @observable stroke = '#000000'
  @observable fill = '#ffffff'
  @observable strokeWidth = 2
  @observable opacity = 1

  @computed get pointsPath() {
    const { points, isComplete } = this
    if (points.length < 2) {
      return `M -4, 0
      a 4,4 0 1,0 8,0
      a 4,4 0 1,0 -8,0`
    }
    const stroke = getStroke(points, { size: 4 + this.strokeWidth * 2, last: isComplete })
    return SvgPathUtils.getCurvedPathForPolygon(stroke)
  }

  Component = observer(({ events, isErasing }: TLComponentProps) => {
    const { pointsPath, stroke, strokeWidth, opacity } = this

    return (
      <SVGContainer {...events} opacity={isErasing ? 0.2 : opacity}>
        <path
          d={pointsPath}
          strokeWidth={strokeWidth}
          stroke={stroke}
          fill={stroke}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const { pointsPath } = this
    return <path d={pointsPath} />
  })

  validateProps = (props: Partial<TLShapeProps & NuPenShapeProps>) => {
    props = withClampedStyles(props)
    if (props.strokeWidth !== undefined) props.strokeWidth = Math.max(props.strokeWidth, 1)
    return props
  }
}
