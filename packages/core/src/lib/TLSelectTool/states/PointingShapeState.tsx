import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLSelectTool, TLToolState } from '~lib'
import type { TLEvents } from '~types'

export class PointingShapeState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointingShape'

  onEnter = (info: { target: TLShape }) => {
    const {
      selectedIds,
      inputs: { shiftKey },
    } = this.app

    if (shiftKey) {
      this.app.select(...selectedIds, info.target.id)
    } else {
      this.app.select(info.target.id)
    }
  }

  onWheel: TLEvents<S>['wheel'] = (info, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLEvents<S>['pointer'] = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('translating')
    }
  }

  onPointerUp: TLEvents<S>['pointer'] = () => {
    this.tool.transition('idle')
  }

  onPinchStart: TLEvents<S>['pinch'] = (info, event) => {
    this.tool.transition('pinching', { info, event })
  }
}
