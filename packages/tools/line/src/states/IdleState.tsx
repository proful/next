import type { TLLineTool } from '../TLLineTool'
import type { TLLineShape } from '@tldraw/line-shape'
import { TLShape, TLApp, TLToolState, TLEventMap, TLStateEvents } from '@tldraw/core'

export class IdleState<
  S extends TLShape,
  T extends S & TLLineShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLLineTool<T, S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'idle'

  onPointerDown: TLStateEvents<S, K>['onPointerDown'] = (info, e) => {
    if (info.order) return
    this.tool.transition('pointing')
  }

  onPinchStart: TLStateEvents<S, K>['onPinchStart'] = (...args) => {
    this.app.transition('select', { returnTo: 'Line' })
    this.app.onPinchStart?.(...args)
  }
}
