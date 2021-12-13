import { TLShape, TLApp, TLToolState, TLShortcut, TLEventMap, TLStateEvents } from '@tldraw/core'
import type { TLEraseTool } from '../TLEraseTool'

export class IdleState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLEraseTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'idle'

  static shortcuts: TLShortcut<TLShape, TLEventMap, TLApp>[] = [
    {
      keys: ['mod+a'],
      fn: (app) => {
        app.transition('select')
        app.selectAll()
      },
    },
  ]

  onPointerDown: TLStateEvents<S, K>['onPointerDown'] = (info, e) => {
    if (info.order > 0) return
    this.tool.transition('pointing')
  }

  onPinchStart: TLStateEvents<S, K>['onPinchStart'] = (...args) => {
    this.app.transition('select', { returnTo: 'draw' })
    this.app.onPinchStart?.(...args)
  }
}
