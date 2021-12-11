import type { TLShape, TLApp, TLBoxShape, TLBoxTool } from '~lib'
import { TLToolState } from '~lib'
import type { TLPinchHandler, TLPointerHandler, TLShortcut } from '~types'

export class IdleState<
  S extends TLShape,
  T extends S & TLBoxShape,
  R extends TLApp<S>,
  P extends TLBoxTool<T, S, R>
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

  onPointerDown: TLPointerHandler = (info, e) => {
    if (info.order > 0) return
    this.tool.transition('pointing')
  }

  onPinchStart: TLPinchHandler = (...args) => {
    this.app.transition('select', { returnTo: 'box' })
    this.app.onPinchStart?.(...args)
  }
}
