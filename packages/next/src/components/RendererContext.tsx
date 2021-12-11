/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import {
  BoundsBackground as _BoundsBackground,
  BoundsForeground as _BoundsForeground,
  BoundsDetail as _BoundsDetail,
  Grid as _Grid,
  Brush as _Brush,
} from '~components'
import type { TLShape, TLInputs, TLViewport } from '~lib'
import { autorun } from 'mobx'
import type { TLRendererContext, TLComponents, TLEventHandlers } from '~types'
import { getRendererContext } from '~hooks'
import { EMPTY_OBJECT } from '~constants'

export interface TLRendererContextProps<S extends TLShape = TLShape> {
  id?: string
  viewport: TLViewport
  inputs: TLInputs
  callbacks?: Partial<TLEventHandlers<S>>
  components?: Partial<TLComponents<S>>
  meta?: any
  children?: React.ReactNode
}

export const RendererContext = observer(function App<S extends TLShape>({
  id = 'noid',
  viewport,
  inputs,
  callbacks = EMPTY_OBJECT,
  meta = EMPTY_OBJECT,
  components = EMPTY_OBJECT,
  children,
}: TLRendererContextProps<S>): JSX.Element {
  const [currentContext, setCurrentContext] = React.useState<TLRendererContext<S>>(() => {
    const { Brush, Grid, ContextBar, BoundsBackground, BoundsForeground, BoundsDetail } = components

    return {
      id,
      viewport,
      inputs,
      callbacks,
      meta,
      components: {
        BoundsBackground: BoundsBackground === null ? undefined : _BoundsBackground,
        BoundsForeground: BoundsForeground === null ? undefined : _BoundsForeground,
        BoundsDetail: BoundsDetail === null ? undefined : _BoundsDetail,
        Brush: Brush === null ? undefined : _Brush,
        Grid: Grid === null ? undefined : _Grid,
        ContextBar,
      },
    }
  })

  React.useEffect(() => {
    const { Brush, Grid, ContextBar, BoundsBackground, BoundsForeground, BoundsDetail } = components

    autorun(() => {
      setCurrentContext({
        id,
        viewport,
        inputs,
        callbacks,
        meta,
        components: {
          BoundsBackground: BoundsBackground === null ? undefined : _BoundsBackground,
          BoundsForeground: BoundsForeground === null ? undefined : _BoundsForeground,
          BoundsDetail: BoundsDetail === null ? undefined : _BoundsDetail,
          Brush: Brush === null ? undefined : _Brush,
          Grid: Grid === null ? undefined : _Grid,
          ContextBar,
        },
      })
    })
  }, [])

  const context = getRendererContext<S>(id)

  return <context.Provider value={currentContext}>{children}</context.Provider>
})
