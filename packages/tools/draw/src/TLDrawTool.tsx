import { IdleState, PointingState, CreatingState } from './states'
import { TLCursor, TLShapeProps, TLTool, TLApp, TLShape, TLEventMap } from '@tldraw/core'
import type { TLDrawShapeProps, TLDrawShape } from '@tldraw/draw-shape'

export abstract class TLDrawTool<
  T extends TLDrawShape = TLDrawShape,
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> extends TLTool<S, K, R> {
  static id = 'draw'

  static states = [IdleState, PointingState, CreatingState]

  static initial = 'idle'

  cursor = TLCursor.Cross

  /** Whether to simplify the shape's points after creating. */
  simplify = true

  /** The minimum distance between points when simplifying a line. */
  simplifyTolerance = 1

  abstract Shape: {
    new (props: TLShapeProps & Partial<TLDrawShapeProps & unknown>): T
  }
}
