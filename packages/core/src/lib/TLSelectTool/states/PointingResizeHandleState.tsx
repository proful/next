import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~lib'
import type { TLEvents, TLBoundsHandle } from '~types'

export class PointingResizeHandleState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointingResizeHandle'

  pointedHandle?: TLBoundsHandle

  onEnter = (info: { target: TLBoundsHandle }) => {
    this.pointedHandle = info.target
  }

  onWheel: TLEvents<S>['wheel'] = (info, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLEvents<S>['pointer'] = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('resizing', { handle: this.pointedHandle })
    }
  }

  onPointerUp: TLEvents<S>['pointer'] = () => {
    this.tool.transition('idle')
  }

  onPinchStart: TLEvents<S>['pinch'] = (info, event) => {
    this.tool.transition('pinching', { info, event })
  }
}
