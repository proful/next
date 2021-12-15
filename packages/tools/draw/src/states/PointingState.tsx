import { TLToolState, TLShape, TLApp, uniqueId, TLEventMap, TLStateEvents } from '@tldraw/core'
import type { TLDrawShape } from '@tldraw/draw-shape'
import Vec from '@tldraw/vec'
import type { TLDrawTool } from '../TLDrawTool'

export class PointingState<
  S extends TLShape,
  T extends S & TLDrawShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLDrawTool<T, S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'pointing'

  onPointerMove: TLStateEvents<S, K>['onPointerMove'] = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('creating')
      this.app.setSelectedShapes([])
    }
  }

  onPointerUp: TLStateEvents<S, K>['onPointerUp'] = () => {
    const { Shape } = this.tool

    const { originPoint } = this.app.inputs

    const shape = new Shape({
      id: uniqueId(),
      parentId: this.app.currentPage.id,
      point: originPoint,
      points: [[0, 0, 0.5]],
    })

    this.app.currentPage.addShapes(shape)

    this.tool.transition('idle')
  }
}
