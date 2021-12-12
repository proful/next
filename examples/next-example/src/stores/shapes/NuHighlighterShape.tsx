/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import {
  assignOwnProps,
  SVGContainer,
  SvgPathUtils,
  TLComponentProps,
  TLDrawShape,
  TLDrawShapeProps,
  TLIndicatorProps,
  TLShapeProps,
} from '@tldraw/next'
import { observer } from 'mobx-react-lite'
import { observable, computed, makeObservable } from 'mobx'
import { NuStyleProps, withClampedStyles } from './NuStyleProps'

export interface NuHighlighterShapeProps extends TLDrawShapeProps, NuStyleProps {}

export class NuHighlighterShape extends TLDrawShape<NuHighlighterShapeProps> {
  constructor(props = {} as TLShapeProps & Partial<NuHighlighterShapeProps>) {
    super(props)
    assignOwnProps(this, props)
    makeObservable(this)
  }

  static id = 'highlighter'

  @observable stroke = '#000000'
  @observable fill = '#ffffff'
  @observable strokeWidth = 2
  @observable opacity = 1

  @computed get pointsPath() {
    const { points } = this
    return SvgPathUtils.getCurvedPathForPoints(points)
  }

  Component = observer(({ events }: TLComponentProps) => {
    const { pointsPath, stroke, fill, strokeWidth, opacity } = this

    return (
      <SVGContainer {...events} opacity={opacity}>
        <path
          d={pointsPath}
          strokeWidth={strokeWidth * 16}
          stroke={stroke}
          fill={fill}
          pointerEvents="all"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.17}
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const { pointsPath } = this
    return <path d={pointsPath} fill="none" />
  })

  validateProps = (props: Partial<TLShapeProps & NuHighlighterShapeProps>) => {
    props = withClampedStyles(props)
    if (props.strokeWidth !== undefined) props.strokeWidth = Math.max(props.strokeWidth, 1)
    return props
  }
}
