import { IdleState, PointingState, CreatingState } from './states'
import { TLTool, TLShortcut, TLApp, TLShape, TLCustomProps, TLEventMap } from '@tldraw/core'
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

  static shortcuts: TLShortcut<TLShape, TLEventMap, TLApp>[] = [
    {
      keys: ['mod+a'],
      fn: (app) => {
        app.transition('select')
        app.selectAll()
      },
    },
  ]

  abstract shapeClass: TLBoxShapeClass<T>
}
