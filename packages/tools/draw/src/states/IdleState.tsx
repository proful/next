import {
  TLToolState,
  TLShape,
  TLApp,
  TLPinchHandler,
  TLPointerHandler,
  TLShortcut,
} from '@tldraw/core'
import type { TLDrawShape } from '@tldraw/draw-shape'
import type { TLDrawTool } from '../TLDrawTool'

export class IdleState<
  S extends TLShape,
  T extends S & TLDrawShape,
  R extends TLApp<S>,
  P extends TLDrawTool<T, S, R>
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
    this.app._events.onPinchStart?.(...args)
  }
}
