import * as React from 'react'
import { useRendererContext } from '~hooks'
import { TLTargetType } from '@tldraw/core'
import type { TLReactCustomEvents } from '~types'

export function useCanvasEvents() {
  const { callbacks } = useRendererContext()

  const events = React.useMemo(() => {
    const onPointerMove: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      callbacks.onPointerMove?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onPointerDown: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      e.currentTarget.setPointerCapture(e.pointerId)
      callbacks.onPointerDown?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onPointerUp: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      e.currentTarget.releasePointerCapture(e.pointerId)
      callbacks.onPointerUp?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onPointerEnter: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      callbacks.onPointerEnter?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onPointerLeave: TLReactCustomEvents['pointer'] = (e) => {
      const { order = 0 } = e
      callbacks.onPointerLeave?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onKeyDown: TLReactCustomEvents['keyboard'] = (e) => {
      callbacks.onKeyDown?.({ type: TLTargetType.Canvas, target: 'canvas', order: -1 }, e)
    }

    const onKeyUp: TLReactCustomEvents['keyboard'] = (e) => {
      callbacks.onKeyUp?.({ type: TLTargetType.Canvas, target: 'canvas', order: -1 }, e)
    }

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onKeyDown,
      onKeyUp,
      onPointerEnter,
      onPointerLeave,
    }
  }, [callbacks])

  return events
}
