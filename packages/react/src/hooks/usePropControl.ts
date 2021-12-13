import type { TLApp } from '@tldraw/core'
import * as React from 'react'
import type { TLAppPropsWithApp, TLAppPropsWithoutApp } from '~components'
import type { TLReactShape } from '~lib'

export function usePropControl<S extends TLReactShape, R extends TLApp<S> = TLApp<S>>(
  app: R,
  props: TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S, R>
) {
  React.useEffect(() => {
    if (!('model' in props)) return
    if (props.model) app.history.deserialize(props.model)
  }, [(props as TLAppPropsWithoutApp<S>).model])
}
