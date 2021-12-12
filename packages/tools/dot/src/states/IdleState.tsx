import {
  TLApp,
  TLShape,
  TLToolState,
  TLPinchHandler,
  TLPointerHandler,
  TLShortcut,
} from '@tldraw/core'
import type { TLDotShape } from '@tldraw/dot-shape'
import type { TLDotTool } from '../TLDotTool'

export class IdleState<
  S extends TLShape,
  T extends S & TLDotShape,
  R extends TLApp<S>,
  P extends TLDotTool<T, S, R>
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
    this.app.transition('select', { returnTo: 'box' })
    this.app.onPinchStart?.(...args)
  }
}
