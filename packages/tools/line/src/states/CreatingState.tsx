import type { TLLineTool } from '../TLLineTool'
import type { TLLineShape } from '@tldraw/line-shape'
import { TLShape, TLApp, TLToolState, uniqueId, TLEventMap, TLStateEvents } from '@tldraw/core'
import Vec from '@tldraw/vec'

export class CreatingState<
  S extends TLShape,
  T extends S & TLLineShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLLineTool<T, S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'creating'

  creatingShape?: T
  initialShape?: T

  onEnter = () => {
    const { Shape } = this.tool
    const shape = new Shape({
      id: uniqueId(),
      parentId: this.app.currentPage.id,
      point: this.app.inputs.originPoint,
      handles: [{ point: [0, 0] }, { point: [1, 1] }],
    })
    this.initialShape = shape.clone()
    this.creatingShape = shape
    this.app.currentPage.addShapes(shape)
    this.app.setSelectedShapes([shape])
  }

  onPointerMove: TLStateEvents<S, K>['onPointerMove'] = () => {
    if (!this.creatingShape) throw Error('Expected a creating shape.')
    const {
      inputs: { shiftKey, previousPoint, originPoint, currentPoint },
    } = this.app
    if (Vec.isEqual(previousPoint, currentPoint)) return
    const delta = Vec.sub(currentPoint, originPoint)
    if (shiftKey) {
      if (Math.abs(delta[0]) < Math.abs(delta[1])) {
        delta[0] = 0
      } else {
        delta[1] = 0
      }
    }
    const { initialShape } = this
    this.creatingShape.onHandleChange({ index: 1, initialShape, delta })
  }

  onPointerUp: TLStateEvents<S, K>['onPointerUp'] = () => {
    this.tool.transition('idle')
    if (this.creatingShape) {
      this.app.setSelectedShapes([this.creatingShape])
    }
    if (!this.app.settings.isToolLocked) {
      this.app.transition('select')
    }
  }

  onWheel: TLStateEvents<S, K>['onWheel'] = (info, e) => {
    this.onPointerMove(info, e)
  }

  onKeyDown: TLStateEvents<S>['onKeyDown'] = (info, e) => {
    switch (e.key) {
      case 'Escape': {
        if (!this.creatingShape) throw Error('Expected a creating shape.')
        this.app.deleteShapes([this.creatingShape])
        this.tool.transition('idle')
        break
      }
    }
  }
}
