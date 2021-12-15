/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import type { TLReactShape, TLReactShapeConstructor } from '~lib'
import { AppContext, Renderer } from '~components'
import { useApp } from '~hooks'
import type {
  AnyObject,
  TLSerializedApp,
  TLCallback,
  TLTheme,
  TLToolConstructor,
} from '@tldraw/core'
import type { TLReactComponents } from '~types/component-props'
import type { TLReactApp, TLReactEventMap } from '~types'

export interface TLCommonAppProps<S extends TLReactShape, R extends TLReactApp<S> = TLReactApp<S>> {
  id?: string
  meta?: AnyObject
  theme?: Partial<TLTheme>
  components?: TLReactComponents<S>
  children?: React.ReactNode
  onMount?: TLCallback<S, TLReactEventMap, R, 'mount'>
  onPersist?: TLCallback<S, TLReactEventMap, R, 'persist'>
  onSave?: TLCallback<S, TLReactEventMap, R, 'save'>
  onSaveAs?: TLCallback<S, TLReactEventMap, R, 'saveAs'>
}

export interface TLAppPropsWithoutApp<
  S extends TLReactShape,
  R extends TLReactApp<S> = TLReactApp<S>
> extends TLCommonAppProps<S, R> {
  model?: TLSerializedApp
  Shapes?: TLReactShapeConstructor<S>[]
  Tools?: TLToolConstructor<S, TLReactEventMap, TLReactApp<S>>[]
  children?: React.ReactNode
}

export interface TLAppPropsWithApp<S extends TLReactShape, R extends TLReactApp<S> = TLReactApp<S>>
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
      selectedShapes={app.selectedShapesArray}
      erasingShapes={app.erasingShapesArray}
      shapes={app.shapesInViewport}
      showGrid={app.settings.showGrid}
      showBounds={app.showBounds}
      showBoundsRotation={app.showBoundsRotation}
      showResizeHandles={app.showResizeHandles}
      showRotateHandle={app.showRotateHandle}
      showBoundsDetail={app.showBoundsDetail}
      showContextBar={app.showContextBar}
      cursor={app.cursors.cursor}
      cursorRotation={app.cursors.rotation}
      {...props}
    />
  )
})
