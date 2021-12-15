import { IdleState, PointingState, CreatingState } from './states'
import { TLTool, TLApp, TLShape, TLCustomProps, TLEventMap, TLCursor } from '@tldraw/core'
import type { TLLineShape, TLLineShapeProps } from '@tldraw/line-shape'

// shape tools need to have two generics: a union of all shapes in
// the app, and the particular shape that they'll be creating

export interface TLLineShapeClass<T extends TLLineShape = TLLineShape> {
  new (props: TLCustomProps<TLLineShapeProps & unknown>): T
}

export abstract class TLLineTool<
  T extends TLLineShape = TLLineShape,
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> extends TLTool<S, K, R> {
  static id = 'line'

  static states = [IdleState, PointingState, CreatingState]

  static initial = 'idle'

  cursor = TLCursor.Cross

  abstract Shape: TLLineShapeClass<T>
}
