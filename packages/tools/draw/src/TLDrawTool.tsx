import { IdleState, PointingState, CreatingState } from './states'
import { TLShapeProps, TLTool, TLApp, TLShape } from '@tldraw/core'
import type { TLDrawShapeProps, TLDrawShape } from '@tldraw/draw-shape'

export abstract class TLDrawTool<
  T extends TLDrawShape = TLDrawShape,
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>
> extends TLTool<S, R> {
  static id = 'draw'

  static states = [IdleState, PointingState, CreatingState]

  static initial = 'idle'

  /** Whether to simplify the shape's points after creating. */
  simplify = true

  /** The minimum distance between points when simplifying a line. */
  simplifyTolerance = 1

  abstract shapeClass: {
    new (props: TLShapeProps & Partial<TLDrawShapeProps & unknown>): T
  }
}
