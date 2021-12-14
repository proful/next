import { TLToolState, TLShape, TLApp, TLEventMap, TLStateEvents } from '@tldraw/core'
import type { TLDrawShape } from '@tldraw/draw-shape'
import type { TLDrawTool } from '../TLDrawTool'

export class IdleState<
  S extends TLShape,
  T extends S & TLDrawShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLDrawTool<T, S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'idle'

  onPointerDown: TLStateEvents<S, K>['onPointerDown'] = (info, e) => {
    if (info.order > 0) return
    this.tool.transition('pointing')
  }

  onPinchStart: TLStateEvents<S, K>['onPinchStart'] = (...args) => {
    this.app.transition('select', { returnTo: 'draw' })
    this.app._events.onPinchStart?.(...args)
  }
}
