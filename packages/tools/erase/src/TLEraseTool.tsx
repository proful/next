import { IdleState, PointingState, ErasingState } from './states'
import { TLTool, TLApp, TLShape, TLEventMap, TLStateEvents } from '@tldraw/core'

export abstract class TLEraseTool<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> extends TLTool<S, K, R> {
  static id = 'erase'

  static states = [IdleState, PointingState, ErasingState]

  static initial = 'idle'

  onKeyDown: TLStateEvents<S, K>['onKeyDown'] = (_info, e) => {
    switch (e.key) {
      case 'Escape': {
        this.app.setErasingShapes([])
        this.transition('idle')
        break
      }
    }
  }
}
