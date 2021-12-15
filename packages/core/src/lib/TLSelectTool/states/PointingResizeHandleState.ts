import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~lib'
import {
  TLEvents,
  TLBoundsHandle,
  TLEventMap,
  TLBoundsEdge,
  TLBoundsCorner,
  TLCursor,
} from '~types'

export class PointingResizeHandleState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'pointingResizeHandle'

  pointedHandle?: TLBoundsHandle

  static CURSORS: Record<TLBoundsCorner | TLBoundsEdge, TLCursor> = {
    [TLBoundsEdge.Bottom]: TLCursor.NsResize,
    [TLBoundsEdge.Top]: TLCursor.NsResize,
    [TLBoundsEdge.Left]: TLCursor.EwResize,
    [TLBoundsEdge.Right]: TLCursor.EwResize,
    [TLBoundsCorner.BottomLeft]: TLCursor.NeswResize,
    [TLBoundsCorner.BottomRight]: TLCursor.NwseResize,
    [TLBoundsCorner.TopLeft]: TLCursor.NwseResize,
    [TLBoundsCorner.TopRight]: TLCursor.NeswResize,
  }

  onEnter = (info: { target: TLBoundsCorner | TLBoundsEdge }) => {
    const rotation = this.app.selectedBounds!.rotation
    this.app.cursors.setCursor(PointingResizeHandleState.CURSORS[info.target], rotation)
    this.pointedHandle = info.target
  }

  onExit = () => {
    this.app.cursors.reset()
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
