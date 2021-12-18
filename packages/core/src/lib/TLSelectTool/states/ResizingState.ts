import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLSelectTool, TLToolState, TLSerializedShape } from '~lib'
import { TLBounds, TLBoundsCorner, TLBoundsEdge, TLCursor, TLEventMap, TLEvents } from '~types'
import { BoundsUtils } from '~utils'

export class ResizingState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'resizing'

  isSingle = false
  isAspectRatioLocked = false
  handle: TLBoundsCorner | TLBoundsEdge = TLBoundsCorner.BottomRight
  snapshots: Record<
    string,
    {
      shape: S
      transformOrigin: number[]
    }
  > = {}
  initialRotation = 0
  initialInnerBounds = {} as TLBounds
  initialCommonBounds = {} as TLBounds
  initialCommonCenter = {} as number[]
  transformOrigins: Record<string, number[]> = {}
  boundsRotation = 0

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

  onEnter = (info: { handle: TLBoundsCorner | TLBoundsEdge }) => {
    const { history, selectedShapesArray, selectionBounds } = this.app
    if (!selectionBounds) throw Error('Expected a selected bounds.')

    this.handle = info.handle
    this.app.cursors.setCursor(
      ResizingState.CURSORS[info.handle],
      this.app.selectionBounds?.rotation
    )
    history.pause()

    const initialInnerBounds = BoundsUtils.getBoundsFromPoints(
      selectedShapesArray.map(shape => BoundsUtils.getBoundsCenter(shape.bounds))
    )

    this.isSingle = selectedShapesArray.length === 1
    this.isAspectRatioLocked = this.isSingle && !!selectedShapesArray[0].isAspectRatioLocked
    this.boundsRotation = this.isSingle ? selectedShapesArray[0].rotation ?? 0 : 0
    this.initialCommonBounds = { ...selectionBounds }
    this.initialCommonCenter = BoundsUtils.getBoundsCenter(this.initialCommonBounds)

    this.snapshots = Object.fromEntries(
      selectedShapesArray.map(shape => {
        const { bounds } = shape
        const ic = BoundsUtils.getBoundsCenter(bounds)

        const ix = (ic[0] - initialInnerBounds.minX) / initialInnerBounds.width
        const iy = (ic[1] - initialInnerBounds.minY) / initialInnerBounds.height

        return [
          shape.id,
          {
            shape: shape.clone(),
            transformOrigin: [ix, iy],
          },
        ]
      })
    )

    selectedShapesArray.forEach(shape => shape.onResizeStart?.())
  }

  onExit = () => {
    this.app.cursors.reset()
    this.snapshots = {}
    this.initialCommonBounds = {} as TLBounds
    this.boundsRotation = 0
    this.app.history.resume()
  }

  onWheel: TLEvents<S>['wheel'] = (info, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLEvents<S>['pointer'] = () => {
    const {
      inputs: { shiftKey, originPoint, currentPoint },
    } = this.app

    const { handle, snapshots, initialCommonBounds } = this

    const delta = Vec.sub(currentPoint, originPoint)

    const nextBounds = BoundsUtils.getTransformedBoundingBox(
      initialCommonBounds,
      handle,
      delta,
      this.boundsRotation,
      shiftKey || this.isAspectRatioLocked
    )

    const { scaleX, scaleY } = nextBounds

    this.app.selectedShapes.forEach(shape => {
      const { shape: initialShape, transformOrigin } = snapshots[shape.id]

      const relativeBounds = BoundsUtils.getRelativeTransformedBoundingBox(
        nextBounds,
        initialCommonBounds,
        initialShape.bounds,
        scaleX < 0,
        scaleY < 0
      )

      shape.onResize(relativeBounds, {
        type: handle,
        initialShape,
        scale: [scaleX, scaleY],
        transformOrigin,
      })
    })
  }

  onPointerUp: TLEvents<S>['pointer'] = () => {
    this.app.history.resume()
    this.app.persist()
    this.tool.transition('idle')
  }

  onKeyDown: TLEvents<S>['keyboard'] = (info, e) => {
    switch (e.key) {
      case 'Escape': {
        this.app.selectedShapes.forEach(shape => {
          shape.update({ ...this.snapshots[shape.id].shape })
        })
        this.tool.transition('idle')
        break
      }
    }
  }
}
