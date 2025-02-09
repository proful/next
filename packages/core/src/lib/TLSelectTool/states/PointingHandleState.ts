import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~lib'
import { TLEvents, TLEventMap, TLHandle, TLCursor } from '~types'

export class PointingHandleState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'pointingHandle'
  cursor = TLCursor.Grabbing

  info = {} as { shape: S; target: S; handle: TLHandle; index: number }

  onEnter = (info: { shape: S; target: S; handle: TLHandle; index: number }) => {
    this.info = info
  }

  onWheel: TLEvents<S>['wheel'] = (info, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLEvents<S>['pointer'] = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('translatingHandle', this.info)
    }
  }

  onPointerUp: TLEvents<S>['pointer'] = () => {
    this.tool.transition('idle')
  }

  onPinchStart: TLEvents<S>['pinch'] = (info, event) => {
    this.tool.transition('pinching', { info, event })
  }
}
