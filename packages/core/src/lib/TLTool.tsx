import type { TLApp, TLShape } from '~lib'
import type { TLEventMap } from '~types'
import { TLState } from './TLState'

export interface TLToolConstructor<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> {
  new (parent: R, app: R): TLTool<S, K, R>
  id: string
}

export abstract class TLTool<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> extends TLState<S, K, R, R> {
  get app() {
    return this.root
  }
}
