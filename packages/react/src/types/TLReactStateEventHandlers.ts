import type { TLReactShape } from '~lib'
import type { TLStateEvents } from '@tldraw/core'
import type { TLReactEventMap } from './TLReactEventMap'

export type TLReactStateEvents<S extends TLReactShape = TLReactShape> = TLStateEvents<
  S,
  TLReactEventMap
>
