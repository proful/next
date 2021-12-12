import { IdleState, PointingState, CreatingState } from './states'
import { TLTool, TLShortcut, TLShapeProps, TLApp, TLShape } from '@tldraw/core'
import type { TLDotShapeProps, TLDotShape } from '@tldraw/dot-shape'

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
