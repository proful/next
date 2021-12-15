import * as React from 'react'
import { makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { TLShapeProps, TLCustomProps, TLHandle } from '@tldraw/core'
import { TLPolylineShape, TLPolylineShapeProps } from '@tldraw/polyline-shape'
import { SVGContainer, TLComponentProps, TLIndicatorProps } from '@tldraw/react'

export interface TLLineShapeProps extends TLPolylineShapeProps {
  handles: TLHandle[]
}

export class TLLineShape<P extends TLLineShapeProps = any> extends TLPolylineShape<P> {
  constructor(props = {} as TLCustomProps<Partial<P>>) {
    super(props)
    this.init(props)
    this.handles = props.handles ?? [{ point: [0, 0] }, { point: [1, 1] }]
    makeObservable(this)
  }

  // @observable handles = [{ point: [0, 0] }, { point: [1, 1] }]

  static id = 'line'

  ReactComponent = observer(({ events, isErasing }: TLComponentProps) => {
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

  ReactIndicator = observer((props: TLIndicatorProps) => {
    const { points } = this

    return <polygon points={points.join()} />
  })

  validateProps = (props: Partial<TLShapeProps> & Partial<P>) => {
    if (props.point) props.point = [0, 0]
    if (props.handles !== undefined && props.handles.length < 1) props.handles = [{ point: [0, 0] }]
    return props
  }
}
