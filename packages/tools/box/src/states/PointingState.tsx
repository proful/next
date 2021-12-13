import { Vec } from '@tldraw/vec'
import type { TLBoxTool } from '../TLBoxTool'
import type { TLBoxShape } from '@tldraw/box-shape'
import { TLShape, TLApp, TLToolState, TLEventMap } from '@tldraw/core'
import type { TLReactStateEvents } from '@tldraw/react'

export class PointingState<
  S extends TLShape,
  T extends S & TLBoxShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLBoxTool<T, S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'pointing'

  onPointerMove: TLReactStateEvents<S>['pointer'] = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('creating')
      this.app.deselectAll()
    }
  }
}
