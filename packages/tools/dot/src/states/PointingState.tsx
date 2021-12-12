import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLToolState, TLPointerHandler } from '@tldraw/core'
import type { TLDotShape } from '@tldraw/dot-shape'
import type { TLDotTool } from '../TLDotTool'

export class PointingState<
  S extends TLShape,
  T extends S & TLDotShape,
  R extends TLApp<S>,
  P extends TLDotTool<T, S, R>
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
