/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import type { TLAppPropsWithoutApp, TLAppPropsWithApp } from '~types'
import type { TLShape } from '~lib'
import { useSetup, getAppContext, useApp, usePropControl } from '~hooks'

export const AppContext = observer(function App<S extends TLShape>(
  props: TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S>
): JSX.Element {
  const app = useApp(props)
  const context = getAppContext<S>(props.id)
  usePropControl(app, props)
  useSetup(app, props)
  return <context.Provider value={app}>{props.children}</context.Provider>
})
