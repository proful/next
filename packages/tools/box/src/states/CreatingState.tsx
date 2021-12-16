import type { TLBoxTool } from '../TLBoxTool'
import type { TLBoxShape } from '@tldraw/box-shape'
import {
  TLShape,
  TLApp,
  TLToolState,
  uniqueId,
  BoundsUtils,
  TLEventMap,
  TLStateEvents,
} from '@tldraw/core'
import Vec from '@tldraw/vec'

export class CreatingState<
  S extends TLShape,
  T extends S & TLBoxShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLBoxTool<T, S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'creating'

  creatingShape?: T
  aspectRatio?: number

  onEnter = () => {
    const { Shape } = this.tool
    const shape = new Shape({
      id: uniqueId(),
      parentId: this.app.currentPage.id,
      point: this.app.inputs.originPoint,
      size: [1, 1],
    })

    this.aspectRatio = Shape.aspectRatio

    this.creatingShape = shape
    this.app.currentPage.addShapes(shape)
    this.app.setSelectedShapes([shape])
  }

  onPointerMove: TLStateEvents<S, K>['onPointerMove'] = () => {
    if (!this.creatingShape) throw Error('Expected a creating shape.')
    const { currentPoint, originPoint } = this.app.inputs
    const bounds = BoundsUtils.getBoundsFromPoints([currentPoint, originPoint])

    if (this.aspectRatio) {
      const size = [bounds.width, Math.max(1, bounds.width * this.aspectRatio)]
      const delta = Vec.sub(currentPoint, originPoint)
      const point = [
        delta[0] < 0 ? originPoint[0] - size[0] : originPoint[0],
        delta[1] < 0 ? originPoint[1] - size[1] : originPoint[1],
      ]
      this.creatingShape.update({ point, size })
      return
    }

    this.creatingShape.update({
      point: [bounds.minX, bounds.minY],
      size: [bounds.width, bounds.height],
    })
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
