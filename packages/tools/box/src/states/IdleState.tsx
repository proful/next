import type { TLBoxTool } from '../TLBoxTool'
import type { TLBoxShape } from '@tldraw/box-shape'
import { TLShape, TLApp, TLToolState, TLShortcut, TLEventMap, TLStateEvents } from '@tldraw/core'

export class IdleState<
  S extends TLShape,
  T extends S & TLBoxShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLBoxTool<T, S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'idle'

  static shortcuts: TLShortcut<TLShape, TLEventMap, TLApp<any, any>>[] = [
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
    this.app.transition('select', { returnTo: 'box' })
    this.app.onPinchStart?.(...args)
  }
}
