import type { TLApp } from '@tldraw/core'
import * as React from 'react'
import type { TLReactShape } from '~lib'

const contextMap: Record<string, React.Context<any>> = {}

export function getAppContext<S extends TLReactShape = TLReactShape, R extends TLApp<S> = TLApp<S>>(
  id = 'noid'
): React.Context<R> {
  if (!contextMap[id]) {
    contextMap[id] = React.createContext({} as R)
  }
  return contextMap[id]
}

export function useApp<S extends TLReactShape = TLReactShape, R extends TLApp<S> = TLApp<S>>(
  id = 'noid'
): R {
  return React.useContext(getAppContext<S, R>(id))
}
