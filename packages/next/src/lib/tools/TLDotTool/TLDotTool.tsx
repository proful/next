import { IdleState, PointingState, CreatingState } from './states'
import { TLTool } from '~lib'
import type { TLShortcut } from '~types'
import type { TLDotShapeProps, TLApp, TLShape, TLDotShape, TLShapeProps } from '~lib'

// shape tools need to have two generics: a union of all shapes in
// the app, and the particular shape that they'll be creating

export abstract class TLDotTool<
  T extends TLDotShape = TLDotShape,
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>
> extends TLTool<S, R> {
  static id = 'box'

  static states = [IdleState, PointingState, CreatingState]

  static initial = 'idle'

  static shortcuts: TLShortcut<TLShape, TLApp>[] = [
    {
      keys: ['mod+a'],
      fn: (app) => {
        app.transition('select')
        app.selectAll()
      },
    },
  ]

  abstract shapeClass: {
    new (props: TLShapeProps & Partial<TLDotShapeProps & unknown>): T
  }
}
