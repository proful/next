/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import type { TLReactShape, TLReactShapeClass } from '~lib'
import { AppContext, Renderer } from '~components'
import { useApp } from '~hooks'
import type {
  AnyObject,
  TLApp,
  TLSerializedApp,
  TLSubscriptionCallback,
  TLTheme,
  TLToolClass,
} from '@tldraw/core'
import type { TLComponents } from '~types/component-props'
import type { TLReactEventMap } from '~types'

export interface TLCommonAppProps<S extends TLReactShape, R extends TLApp<S> = TLApp<S>> {
  id?: string
  meta?: AnyObject
  theme?: Partial<TLTheme>
  components?: TLComponents<S>
  children?: React.ReactNode
  onMount?: TLSubscriptionCallback<S, TLReactEventMap, R, 'mount'>
  onPersist?: TLSubscriptionCallback<S, TLReactEventMap, R, 'persist'>
  onSave?: TLSubscriptionCallback<S, TLReactEventMap, R, 'save'>
  onSaveAs?: TLSubscriptionCallback<S, TLReactEventMap, R, 'saveAs'>
}

export interface TLAppPropsWithoutApp<S extends TLReactShape, R extends TLApp<S> = TLApp<S>>
  extends TLCommonAppProps<S, R> {
  model?: TLSerializedApp
  shapeClasses?: TLReactShapeClass<S>[]
  toolClasses?: TLToolClass<S, TLApp<S>>[]
  children?: React.ReactNode
}

export interface TLAppPropsWithApp<S extends TLReactShape, R extends TLApp<S> = TLApp<S>>
  extends TLCommonAppProps<S, R> {
  app: R
  children?: React.ReactNode
}

export type AppProps<S extends TLReactShape> = TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S>

export function App<S extends TLReactShape>(props: AppProps<S>): JSX.Element {
  return (
    <AppContext {...props}>
      <InnerApp {...props} />
    </AppContext>
  )
}

const InnerApp = observer(function InnerApp<S extends TLReactShape>(
  props: AppProps<S>
): JSX.Element {
  const app = useApp<S>()

  return (
    <Renderer
      viewport={app.viewport}
      inputs={app.inputs}
      callbacks={app._events as any}
      brush={app.brush}
      hoveredShape={app.hoveredShape}
      selectedBounds={app.selectedBounds}
      selectedShapes={app.selectedShapes}
      erasingShapes={app.erasingShapes}
      shapes={app.shapesInViewport}
      showGrid={app.showGrid}
      showBounds={app.showBounds}
      showBoundsRotation={app.showBoundsRotation}
      showResizeHandles={app.showResizeHandles}
      showRotateHandle={app.showRotateHandle}
      showBoundsDetail={app.showBoundsDetail}
      showContextBar={app.showContextBar}
      {...props}
    />
  )
})
