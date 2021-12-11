import { IdleState, PointingState, ErasingState } from './states'
import { TLTool } from '~lib'
import type { TLApp, TLShape } from '~lib'
import type { TLKeyboardHandler } from '~types'

export abstract class TLEraseTool<
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>
> extends TLTool<S, R> {
  static id = 'erase'

  static states = [IdleState, PointingState, ErasingState]

  static initial = 'idle'

  onKeyDown: TLKeyboardHandler<S> = (_info, e) => {
    switch (e.key) {
      case 'Escape': {
        this.app.setErasingShapes([])
        this.transition('idle')
        break
      }
    }
  }
}
