import { TLApp } from '@tldraw/core'
import type { TLReactShape } from '~lib'
import type { TLReactEventMap } from './TLReactEventMap'

export class TLReactApp<S extends TLReactShape = TLReactShape> extends TLApp<S, TLReactEventMap> {}
