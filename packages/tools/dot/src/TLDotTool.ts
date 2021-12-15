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

  abstract Shape: {
    new (props: TLShapeProps & Partial<TLDotShapeProps & unknown>): T
  }

  onEnter = () => {
    this.app.cursors.push('cross')
  }

  onExit = () => {
    this.app.cursors.pop()
  }
}
