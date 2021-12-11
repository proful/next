import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLSelectTool, TLToolState } from '~lib'
import type { TLPinchHandler, TLPointerHandler, TLWheelHandler } from '~types'

export class PointingShapeBehindBoundsState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointingShapeBehindBounds'

  info = {} as { target: TLShape }

  onEnter = (info: { target: TLShape }) => {
    this.info = info
  }

  onWheel: TLWheelHandler<S> = (info, gesture, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLPointerHandler<S> = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('translating')
    }
  }

  onPointerUp: TLPointerHandler<S> = () => {
    const {
      selectedIds,
      inputs: { shiftKey },
    } = this.app

    if (shiftKey) {
      this.app.select(...selectedIds, this.info.target.id)
    } else {
      this.app.select(this.info.target.id)
    }

    this.tool.transition('idle')
  }

  onPinchStart: TLPinchHandler<S> = (info, gesture, event) => {
    this.tool.transition('pinching', { info, gesture, event })
  }
}
