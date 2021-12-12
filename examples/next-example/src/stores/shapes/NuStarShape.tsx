/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import {
  SVGContainer,
  TLIndicatorProps,
  TLComponentProps,
  TLStarShape,
  TLStarShapeProps,
  TLShapeProps,
  assignOwnProps,
} from '@tldraw/next'
import { observer } from 'mobx-react-lite'
import { computed, makeObservable, observable } from 'mobx'
import { NuStyleProps, withClampedStyles } from './NuStyleProps'

interface NuStarShapeProps extends NuStyleProps, TLStarShapeProps {}

export class NuStarShape extends TLStarShape<NuStarShapeProps> {
  constructor(props = {} as TLShapeProps & Partial<NuStarShapeProps>) {
    super(props)
    assignOwnProps(this, props)
    makeObservable(this)
  }

  @observable stroke = '#000000'
  @observable fill = '#ffffff'
  @observable strokeWidth = 2
  @observable opacity = 1

  static id = 'star'

  Component = observer(({ events, isSelected }: TLComponentProps) => {
    const {
      offset: [x, y],
      stroke,
      fill,
      strokeWidth,
      opacity,
    } = this

    const path = this.getVertices(strokeWidth / 2).join()

    return (
      <SVGContainer {...events} opacity={opacity}>
        <polygon
          className={isSelected ? 'tl-hitarea-fill' : 'tl-hitarea-stroke'}
          transform={`translate(${x}, ${y})`}
          points={path}
        />
        <polygon
          transform={`translate(${x}, ${y})`}
          points={path}
          stroke={stroke}
          fill={fill}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const {
      offset: [x, y],
      strokeWidth,
    } = this

    return (
      <polygon
        transform={`translate(${x}, ${y})`}
        points={this.getVertices(strokeWidth / 2).join()}
      />
    )
  })

  validateProps = (props: Partial<NuStarShapeProps & TLShapeProps>) => {
    if (props.sides !== undefined) props.sides = Math.max(props.sides, 3)
    return withClampedStyles(props)
  }
}
