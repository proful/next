import { TLToolState, TLShape, TLApp, TLPointerHandler, uniqueId } from '@tldraw/core'
import type { TLDrawShape } from '@tldraw/draw-shape'
import Vec from '@tldraw/vec'
import type { TLDrawTool } from '../TLDrawTool'

export class PointingState<
  S extends TLShape,
  T extends S & TLDrawShape,
  R extends TLApp<S>,
  P extends TLDrawTool<T, S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointing'

  onPointerMove: TLPointerHandler<S> = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('creating')
      this.app.deselectAll()
    }
  }

  onPointerUp: TLPointerHandler<S> = () => {
    const { shapeClass } = this.tool

    const { originPoint } = this.app.inputs

    const shape = new shapeClass({
      id: uniqueId(),
      parentId: this.app.currentPage.id,
      point: originPoint,
      points: [[0, 0, 0.5]],
    })

    this.app.currentPage.addShapes(shape)

    this.tool.transition('idle')
  }
}
