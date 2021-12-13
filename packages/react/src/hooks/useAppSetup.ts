import * as React from 'react'
import { TLApp } from '@tldraw/core'
import type { TLAppPropsWithApp, TLAppPropsWithoutApp } from '~components'
import type { TLReactShape } from '~lib'

export function useAppSetup<S extends TLReactShape, R extends TLApp<S> = TLApp<S>>(
  props: TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S, R>
): R {
  if ('app' in props) return props.app
  const [app] = React.useState<R>(
    () => new TLApp(props.model, props.shapeClasses, props.toolClasses) as R
  )
  return app
}
