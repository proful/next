import { IdleState, PointingState, CreatingState } from './states'
import { TLTool, TLShortcut, TLShapeProps, TLApp, TLShape, TLEventMap } from '@tldraw/core'
import type { TLDotShapeProps, TLDotShape } from '@tldraw/dot-shape'

export abstract class TLDotTool<
  T extends TLDotShape = TLDotShape,
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

  abstract shapeClass: {
    new (props: TLShapeProps & Partial<TLDotShapeProps & unknown>): T
  }
}
