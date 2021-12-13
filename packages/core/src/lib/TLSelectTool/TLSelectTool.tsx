import type { TLApp, TLShape } from '~lib'
import type { TLEventMap } from '~types'
import { TLTool } from '../TLTool'
import {
  IdleState,
  BrushingState,
  PointingCanvasState,
  PointingShapeState,
  PointingShapeBehindBoundsState,
  PointingBoundsBackgroundState,
  PointingSelectedShapeState,
  PointingResizeHandleState,
  PointingRotateHandleState,
  TranslatingState,
  ResizingState,
  RotatingState,
  PinchingState,
} from './states'

export class TLSelectTool<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> extends TLTool<S, K, R> {
  static id = 'select'

  static initial = 'idle'

  static shortcut = ['v']

  static states = [
    IdleState,
    BrushingState,
    PointingCanvasState,
    PointingShapeState,
    PointingShapeBehindBoundsState,
    PointingSelectedShapeState,
    PointingBoundsBackgroundState,
    PointingResizeHandleState,
    PointingRotateHandleState,
    TranslatingState,
    ResizingState,
    RotatingState,
    RotatingState,
    PinchingState,
  ]
}
