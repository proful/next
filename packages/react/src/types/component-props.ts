/* -------------------- App Props ------------------- */

import type { TLBounds, TLOffset } from '@tldraw/core'
import type { TLReactShape } from '~lib'

/* ------------------- Components ------------------- */

export type TLBoundsComponentProps<S extends TLReactShape = TLReactShape> = {
  zoom: number
  shapes: S[]
  bounds: TLBounds
  showResizeHandles?: boolean
  showRotateHandle?: boolean
}

export type TLBoundsComponent<S extends TLReactShape = TLReactShape> = (
  props: TLBoundsComponentProps<S>
) => JSX.Element | null

export type TLContextBarProps<S extends TLReactShape = TLReactShape> = {
  shapes: S[]
  bounds: TLBounds
  scaledBounds: TLBounds
  rotation: number
  offset: TLOffset
}

export type TLContextBarComponent<S extends TLReactShape = TLReactShape> = (
  props: TLContextBarProps<S>
) => JSX.Element | null

export type TLBoundsDetailProps<S extends TLReactShape = TLReactShape> = {
  shapes: S[]
  bounds: TLBounds
  scaledBounds: TLBounds
  zoom: number
  detail: 'size' | 'rotation'
}

export type TLBoundsDetailComponent<S extends TLReactShape = TLReactShape> = (
  props: TLBoundsDetailProps<S>
) => JSX.Element | null

export interface TLBrushProps {
  bounds: TLBounds
}

export type TLBrushComponent = (props: TLBrushProps) => JSX.Element | null

export interface TLGridProps {
  size: number
}

export type TLGridComponent = (props: TLGridProps) => JSX.Element | null

export type TLReactComponents<S extends TLReactShape = TLReactShape> = {
  BoundsBackground?: TLBoundsComponent<S> | null
  BoundsForeground?: TLBoundsComponent<S> | null
  BoundsDetail?: TLBoundsDetailComponent<S> | null
  ContextBar?: TLContextBarComponent<S> | null
  Brush?: TLBrushComponent | null
  Grid?: TLGridComponent | null
}
