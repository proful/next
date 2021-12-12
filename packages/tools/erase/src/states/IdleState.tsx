import {
  TLShape,
  TLApp,
  TLToolState,
  TLPinchHandler,
  TLPointerHandler,
  TLShortcut,
} from '@tldraw/core'
import type { TLEraseTool } from '../TLEraseTool'

export class IdleState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLEraseTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'idle'

  static shortcuts: TLShortcut<TLShape, TLApp>[] = [
    {
      keys: ['mod+a'],
      fn: (app) => {
        app.transition('select')
        app.selectAll()
      },
    },
  ]

  onPointerDown: TLPointerHandler<S> = (info, e) => {
    if (info.order > 0) return
    this.tool.transition('pointing')
  }

  onPinchStart: TLPinchHandler<S> = (...args) => {
    this.app.transition('select', { returnTo: 'draw' })
    this.app.onPinchStart?.(...args)
  }
}
