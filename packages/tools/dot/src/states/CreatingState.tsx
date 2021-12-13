import {
  TLApp,
  TLShape,
  TLToolState,
  TLPointerHandler,
  uniqueId,
  TLWheelHandler,
} from '@tldraw/core'
import type { TLDotShape } from '@tldraw/dot-shape'
import type { TLDotTool } from '../TLDotTool'

export class CreatingState<
  S extends TLShape,
  T extends S & TLDotShape,
  R extends TLApp<S>,
  P extends TLDotTool<T, S, R>
> extends TLToolState<S, R, P> {
  static id = 'creating'

  creatingShape?: S

  onEnter = () => {
    const { shapeClass } = this.tool
    const shape = new shapeClass({
      id: uniqueId(),
      parentId: this.app.currentPage.id,
      point: this.app.inputs.currentPoint,
    })

    this.creatingShape = shape
    this.app.currentPage.addShapes(shape)
    this.app.select(shape)
  }

  onPointerMove: TLPointerHandler<S> = () => {
    if (!this.creatingShape) throw Error('Expected a creating shape.')
    const { currentPoint } = this.app.inputs
    this.creatingShape.update({
      point: currentPoint,
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
