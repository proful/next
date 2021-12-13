import type { TLBoxTool } from '../TLBoxTool'
import type { TLBoxShape } from '@tldraw/box-shape'
import {
  TLShape,
  TLApp,
  TLToolState,
  TLPointerHandler,
  uniqueId,
  TLWheelHandler,
  BoundsUtils,
} from '@tldraw/core'

export class CreatingState<
  S extends TLShape,
  T extends S & TLBoxShape,
  R extends TLApp<S>,
  P extends TLBoxTool<T, S, R>
> extends TLToolState<S, R, P> {
  static id = 'creating'

  creatingShape?: T

  onEnter = () => {
    const { shapeClass } = this.tool
    const shape = new shapeClass({
      id: uniqueId(),
      parentId: this.app.currentPage.id,
      point: this.app.inputs.currentPoint,
      size: [1, 1],
    })

    this.creatingShape = shape
    this.app.currentPage.addShapes(shape)
    this.app.select(shape)
  }

  onPointerMove: TLPointerHandler<S> = () => {
    if (!this.creatingShape) throw Error('Expected a creating shape.')
    const { currentPoint, originPoint } = this.app.inputs
    const bounds = BoundsUtils.getBoundsFromPoints([currentPoint, originPoint])
    this.creatingShape.update({
      point: [bounds.minX, bounds.minY],
      size: [bounds.width, bounds.height],
    })
  }

  onPointerUp: TLPointerHandler<S> = () => {
    this.tool.transition('idle')
    if (this.creatingShape) {
      this.app.select(this.creatingShape)
    }
    if (!this.app.isToolLocked) {
      this.app.transition('select')
    }
  }

  onWheel: TLEvents<S>['wheel'] = (info, gesture, e) => {
    this.onPointerMove(info, e)
  }
}
