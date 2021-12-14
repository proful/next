import type { TLApp } from '@tldraw/core'
import * as React from 'react'
import type { TLAppPropsWithoutApp, TLAppPropsWithApp } from '~components'
import type { TLReactShape } from '~lib'
import type { TLReactApp } from '~types'

declare const window: Window & { tln: TLReactApp<any> }

export function useSetup<S extends TLReactShape, R extends TLReactApp<S>>(
  app: R,
  props: TLAppPropsWithApp<S> | TLAppPropsWithoutApp<S>
) {
  const { onPersist, onSave, onSaveAs, onMount } = props

  React.useLayoutEffect(() => {
    const unsubs: (() => void)[] = []
    if (!app) return
    app.history.reset()
    if (typeof window !== undefined) window['tln'] = app
    if (onMount) onMount(app, null)
    return () => {
      unsubs.forEach((unsub) => unsub())
      app.dispose()
    }
  }, [app])

  React.useLayoutEffect(() => {
    const unsubs: (() => void)[] = []
    if (onPersist) unsubs.push(app.subscribe('persist', onPersist))
    if (onSave) unsubs.push(app.subscribe('save', onSave))
    if (onSaveAs) unsubs.push(app.subscribe('saveAs', onSaveAs))
    return () => unsubs.forEach((unsub) => unsub())
  }, [app, onPersist, onSave, onSaveAs])
}
