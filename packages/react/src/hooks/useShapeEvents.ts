import * as React from 'react'
import { TLTargetType } from '@tldraw/core'
import { useRendererContext } from '~hooks'
import type { TLReactShape } from '~lib'
import type { TLReactCustomEvents } from '~types'

export function useShapeEvents<S extends TLReactShape>(shape: S) {
  const { inputs, callbacks } = useRendererContext()

  const events = React.useMemo(() => {
    const onPointerMove: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      callbacks.onPointerMove?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onPointerDown: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      if (e.order === 0) e.currentTarget.setPointerCapture(e.pointerId)
      callbacks.onPointerDown?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onPointerUp: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      if (e.order === 0) e.currentTarget.releasePointerCapture(e.pointerId)
      callbacks.onPointerUp?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onPointerEnter: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      callbacks.onPointerEnter?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onPointerLeave: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      callbacks.onPointerLeave?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onKeyDown: TLReactCustomEvents['keyboard'] = (e) => {
      callbacks.onKeyDown?.({ type: TLTargetType.Shape, target: shape, order: -1 }, e)
    }

    const onKeyUp: TLReactCustomEvents['keyboard'] = (e) => {
      callbacks.onKeyUp?.({ type: TLTargetType.Shape, target: shape, order: -1 }, e)
    }

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      onKeyUp,
      onKeyDown,
    }
  }, [shape.id, inputs, callbacks])

  return events
}
