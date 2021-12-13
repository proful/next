import type { TLShape } from '~lib'
import type { TLEventHandlers } from './event-handlers'
import type { TLEvents } from './events'

export type TLOnEnter<T = { fromId: string }> = (info: T) => void

export type TLOnExit<T = { toId: string }> = (info: T) => void

export type TLOnTransition<T = { toId: string; fromId: string }> = (info: T) => void

export type TLOnModifierKey<S extends TLShape = TLShape> = TLEvents<S>['keyboard']

export interface TLStateEventHandlers<S extends TLShape = TLShape> extends TLEventHandlers<S> {
  onEnter: TLOnEnter
  onExit: TLOnExit
  onTransition: TLOnTransition
  handleModifierKey: TLOnModifierKey<S>
}
