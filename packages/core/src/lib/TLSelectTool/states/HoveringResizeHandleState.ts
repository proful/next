import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~lib'
import {
  TLEvents,
  TLBoundsHandle,
  TLEventMap,
  TLBoundsEdge,
  TLBoundsCorner,
  TLCursor,
  TLTargetType,
  TLEventBoundsInfo,
} from '~types'

export class HoveringResizeHandleState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'hoveringResizeHandle'

  handle?: TLBoundsHandle

  CURSORS: Record<TLBoundsHandle, TLCursor> = {
    [TLBoundsEdge.Bottom]: TLCursor.NsResize,
    [TLBoundsEdge.Top]: TLCursor.NsResize,
    [TLBoundsEdge.Left]: TLCursor.EwResize,
    [TLBoundsEdge.Right]: TLCursor.EwResize,
    [TLBoundsCorner.BottomLeft]: TLCursor.NeswResize,
    [TLBoundsCorner.BottomRight]: TLCursor.NwseResize,
    [TLBoundsCorner.TopLeft]: TLCursor.NwseResize,
    [TLBoundsCorner.TopRight]: TLCursor.NeswResize,
    rotate: TLCursor.Grab,
    left: TLCursor.Grab,
    right: TLCursor.Grab,
    center: TLCursor.Grab,
    background: TLCursor.Grab,
  }

  onEnter = (info: TLEventBoundsInfo) => {
    const rotation = this.app.selectionBounds!.rotation
    this.app.cursors.setCursor(this.CURSORS[info.handle], rotation)
    this.handle = info.handle
  }

  onExit = () => {
    this.app.cursors.reset()
  }

  onPinchStart: TLEvents<S>['pinch'] = (info, event) => {
    this.tool.transition('pinching', { info, event })
  }

  onPointerDown: TLEvents<S>['pointer'] = info => {
    const {
      inputs: { ctrlKey },
    } = this.app

    // Holding ctrlKey should ignore shapes
    if (ctrlKey) {
      this.tool.transition('pointingCanvas')
      return
    }

    switch (info.type) {
      case TLTargetType.Bounds: {
        switch (info.handle) {
          case 'center': {
            break
          }
          case 'background': {
            break
          }
          case 'rotate': {
            this.tool.transition('pointingRotateHandle')
            break
          }
          default: {
            this.tool.transition('pointingResizeHandle', info)
          }
        }
        break
      }
    }
  }

  onPointerLeave: TLEvents<S>['pointer'] = () => {
    this.tool.transition('idle')
  }

  onDoubleClick: TLEvents<S>['pointer'] = info => {
    if (info.order) return

    if (this.app.selectedShapesArray.length !== 1) return
    const selectedShape = this.app.selectedShapesArray[0]
    if (!selectedShape.isEditable) return

    switch (info.type) {
      case TLTargetType.Shape: {
        this.tool.transition('editingShape', info)
        break
      }
      case TLTargetType.Bounds: {
        if (this.app.selectedShapesArray.length === 1) {
          this.tool.transition('editingShape', {
            type: TLTargetType.Shape,
            target: selectedShape,
          })
        }
        break
      }
    }
  }
}
