import type { TLReactShape } from '~lib'
import type { TLReactEventHandlers } from './TLReactEventHandlers'
import type { TLReactEvents } from './TLReactEvents'

export interface TLReactStateEvents<S extends TLReactShape = TLReactShape>
  extends TLReactEventHandlers<S> {
  onEnter: (info: { fromId: string } & any) => void
  onExit: (info: { toId: string } & any) => void
  onTransition: (info: { toId: string; fromId: string } & any) => void
  onModifierKey: TLReactEvents<S>['keyboard']
}
