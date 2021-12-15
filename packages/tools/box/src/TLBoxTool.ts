import { IdleState, PointingState, CreatingState } from './states'
import { TLTool, TLApp, TLShape, TLCustomProps, TLEventMap, TLCursor } from '@tldraw/core'
import type { TLBoxShape, TLBoxShapeProps } from '@tldraw/box-shape'

// shape tools need to have two generics: a union of all shapes in
// the app, and the particular shape that they'll be creating

export interface TLBoxShapeClass<T extends TLBoxShape = TLBoxShape> {
  new (props: TLCustomProps<TLBoxShapeProps & unknown>): T
}

export abstract class TLBoxTool<
  T extends TLBoxShape = TLBoxShape,
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> extends TLTool<S, K, R> {
  static id = 'box'

  static states = [IdleState, PointingState, CreatingState]

  static initial = 'idle'

  cursor = TLCursor.Cross

  abstract Shape: TLBoxShapeClass<T>
}
