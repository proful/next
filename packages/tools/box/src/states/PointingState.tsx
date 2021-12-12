import { Vec } from '@tldraw/vec'
import type { TLBoxTool } from '../TLBoxTool'
import type { TLBoxShape } from '@tldraw/box-shape'
import { TLShape, TLApp, TLToolState, TLPointerHandler } from '@tldraw/core'

export class PointingState<
  S extends TLShape,
  T extends S & TLBoxShape,
  R extends TLApp<S>,
  P extends TLBoxTool<T, S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointing'

  onPointerMove: TLPointerHandler<S> = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('creating')
      this.app.deselectAll()
    }
  }
}
