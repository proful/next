/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FullGestureState, WebKitGestureEvent } from '@use-gesture/core/types'
import type { KeyboardEvent } from 'react'
import type React from 'react'
import type {
  TLApp,
  TLInputs,
  TLSerializedApp,
  TLShape,
  TLToolClass,
  TLViewport,
  TLRootState,
  TLState,
} from '~lib'

export enum TLBoundsEdge {
  Top = 'top_edge',
  Right = 'right_edge',
  Bottom = 'bottom_edge',
  Left = 'left_edge',
}

export enum TLBoundsCorner {
  TopLeft = 'top_left_corner',
  TopRight = 'top_right_corner',
  BottomRight = 'bottom_right_corner',
  BottomLeft = 'bottom_left_corner',
}

export type TLBoundsHandle =
  | TLBoundsCorner
  | TLBoundsEdge
  | 'rotate'
  | 'left'
  | 'right'
  | 'center'
  | 'background'

export interface TLBoundsWithCenter extends TLBounds {
  midX: number
  midY: number
}

export enum TLSnapPoints {
  minX = 'minX',
  midX = 'midX',
  maxX = 'maxX',
  minY = 'minY',
  midY = 'midY',
  maxY = 'maxY',
}

export type TLSnap =
  | { id: TLSnapPoints; isSnapped: false }
  | {
      id: TLSnapPoints
      isSnapped: true
      to: number
      B: TLBoundsWithCenter
      distance: number
    }

export interface TLTheme {
  accent?: string
  brushFill?: string
  brushStroke?: string
  selectFill?: string
  selectStroke?: string
  background?: string
  foreground?: string
  grid?: string
}

export interface TLHandle {
  id: string
  index: number
  point: number[]
}

export interface TLBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
  rotation?: number
}

export interface TLBinding {
  id: string
  toId: string
  fromId: string
}

/* ------------------- Components ------------------- */

export type TLBoundsComponentProps<S extends TLShape = TLShape> = {
  zoom: number
  shapes: S[]
  bounds: TLBounds
  showResizeHandles: boolean
  showRotateHandle: boolean
}

export type TLBoundsComponent<S extends TLShape = TLShape> = (
  props: TLBoundsComponentProps<S>
) => JSX.Element | null

export interface TLOffset {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export type TLContextBarProps<S extends TLShape = TLShape> = {
  shapes: S[]
  bounds: TLBounds
  scaledBounds: TLBounds
  rotation: number
  offset: TLOffset
}

export type TLContextBarComponent<S extends TLShape = TLShape> = (
  props: TLContextBarProps<S>
) => JSX.Element | null

export type TLBoundsDetailProps<S extends TLShape = TLShape> = {
  shapes: S[]
  bounds: TLBounds
  scaledBounds: TLBounds
  zoom: number
  detail: 'size' | 'rotation'
}

export type TLBoundsDetailComponent<S extends TLShape = TLShape> = (
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

export type TLComponents<S extends TLShape> = {
  BoundsBackground?: TLBoundsComponent<S> | null
  BoundsForeground?: TLBoundsComponent<S> | null
  BoundsDetail?: TLBoundsDetailComponent<S> | null
  ContextBar?: TLContextBarComponent<S> | null
  Brush?: TLBrushComponent | null
  Grid?: TLGridComponent | null
}

/* --------------------- Events --------------------- */

export type TLOnEnter<T = { fromId: string }> = (info: T) => void
export type TLOnExit<T = { toId: string }> = (info: T) => void
export type TLOnTransition<T = { toId: string; fromId: string }> = (info: T) => void

export type TLSubscriptionEvent =
  | {
      event: 'mount'
      info: null
    }
  | {
      event: 'persist'
      info: null
    }
  | {
      event: 'save'
      info: null
    }
  | {
      event: 'saveAs'
      info: null
    }
  | {
      event: 'undo'
      info: null
    }
  | {
      event: 'redo'
      info: null
    }

export type TLSubscriptionEventName = TLSubscriptionEvent['event']

export type TLSubscriptionEventInfo<T extends TLSubscriptionEventName> = Extract<
  TLSubscriptionEvent,
  { event: T }
>['info']

export type TLSubscriptionCallback<
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>,
  E extends TLSubscriptionEventName = TLSubscriptionEventName
> = (app: R, info: TLSubscriptionEventInfo<E>) => void

export type TLSubscription<
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>,
  E extends TLSubscriptionEventName = TLSubscriptionEventName
> = {
  event: E
  callback: TLSubscriptionCallback<S, R, E>
}

export type TLSubscribe<S extends TLShape = TLShape, R extends TLApp<S> = TLApp<S>> = {
  <E extends TLSubscriptionEventName>(subscription: TLSubscription<S, R, E>): () => void
  <E extends TLSubscriptionEventName>(
    event: E,
    callback: TLSubscriptionCallback<S, R, E>
  ): () => void
}

export interface TLSubscriptionCallbacks<S extends TLShape, R extends TLApp<S>> {
  onMount: TLSubscriptionCallback<S, R, 'mount'>
  onPersist: TLSubscriptionCallback<S, R, 'persist'>
  onSave: TLSubscriptionCallback<S, R, 'save'>
  onSaveAs: TLSubscriptionCallback<S, R, 'saveAs'>
}

/* ----------------- Event Handlers ----------------- */

export enum TLTargetType {
  Canvas = 'canvas',
  Shape = 'shape',
  Bounds = 'bounds',
}

export type TLEventInfo<S extends TLShape> =
  | { type: TLTargetType.Canvas; target: 'canvas'; order: number }
  | { type: TLTargetType.Shape; target: S; order: number }
  | {
      type: TLTargetType.Bounds
      target: TLBoundsHandle
      order: number
    }

export type TLWheelHandler<
  S extends TLShape = TLShape,
  E extends TLEventInfo<S> = TLEventInfo<S>
> = (
  info: E,
  gesture: Omit<FullGestureState<'wheel'>, 'event'> & {
    event: WheelEvent
  },
  event: WheelEvent
) => void

export interface TLPointerEvent<T = Element> extends TLReactPointerEvent<T> {
  order?: number
}

interface TLReactPointerEvent<T = Element> extends React.MouseEvent<T, PointerEvent> {
  pointerId: number
  pressure: number
  tangentialPressure: number
  tiltX: number
  tiltY: number
  twist: number
  width: number
  height: number
  pointerType: 'mouse' | 'pen' | 'touch'
  isPrimary: boolean
}

export type TLPointerEventHandler<T = Element> = React.EventHandler<TLPointerEvent<T>>

export type TLPointerHandler<
  S extends TLShape = TLShape,
  E extends TLEventInfo<S> = TLEventInfo<S>
> = (info: E, event: TLPointerEvent | KeyboardEvent | WheelEvent) => void

export type TLKeyboardHandler<
  S extends TLShape = TLShape,
  E extends TLEventInfo<S> = TLEventInfo<S>
> = (info: E, event: React.KeyboardEvent) => void

export type TLPinchHandler<
  S extends TLShape = TLShape,
  E extends TLEventInfo<S> = TLEventInfo<S>
> = (
  info: E,
  gesture: Omit<FullGestureState<'pinch'>, 'event'> & {
    event: WheelEvent | PointerEvent | TouchEvent | WebKitGestureEvent
  },
  event: WheelEvent | PointerEvent | TouchEvent | WebKitGestureEvent
) => void

export interface TLEventHandlers<
  S extends TLShape = TLShape,
  E extends TLEventInfo<S> = TLEventInfo<S>
> {
  /**
   * Respond to wheel events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onWheel: TLWheelHandler<S, E>
  /**
   * Respond to pointer down events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerDown: TLPointerHandler<S, E>
  /**
   * Respond to pointer up events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerUp: TLPointerHandler<S, E>
  /**
   * Respond to pointer move events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerMove: TLPointerHandler<S, E>

  /**
   * Respond to pointer enter events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerEnter: TLPointerHandler<S, E>
  /**
   * Respond to pointer leave events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerLeave: TLPointerHandler<S, E>

  /**
   * Respond to key down events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onKeyDown: TLKeyboardHandler<S, E>

  /**
   * Respond to key up events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onKeyUp: TLKeyboardHandler<S, E>

  /**
   * Respond to pinch start events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinchStart: TLPinchHandler<S, E>

  /**
   * Respond to pinch events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinch: TLPinchHandler<S, E>
  /**
   * Respond to pinch end events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinchEnd: TLPinchHandler<S, E>
}

export interface TLStateEvents<S extends TLShape = TLShape> extends TLEventHandlers<S> {
  onEnter: TLOnEnter
  onExit: TLOnExit
  onTransition: TLOnTransition
  handleModifierKey: TLKeyboardHandler<S>
}

/* -------------------- App Props ------------------- */

export interface TLCommonAppProps<S extends TLShape, R extends TLApp<S> = TLApp<S>> {
  id?: string
  meta?: AnyObject
  theme?: Partial<TLTheme>
  components?: TLComponents<S>
  children?: React.ReactNode
  onMount?: TLSubscriptionCallback<S, R, 'mount'>
  onPersist?: TLSubscriptionCallback<S, R, 'persist'>
  onSave?: TLSubscriptionCallback<S, R, 'save'>
  onSaveAs?: TLSubscriptionCallback<S, R, 'saveAs'>
}

export interface TLAppPropsWithoutApp<S extends TLShape, R extends TLApp<S> = TLApp<S>>
  extends TLCommonAppProps<S, R> {
  model?: TLSerializedApp
  shapeClasses?: TLShapeClass<S>[]
  toolClasses?: TLToolClass<S, TLApp<S>>[]
  children?: React.ReactNode
}

export interface TLAppPropsWithApp<S extends TLShape, R extends TLApp<S> = TLApp<S>>
  extends TLCommonAppProps<S, R> {
  app: R
  children?: React.ReactNode
}

/* ------------------ Canvas Props ------------------ */

export interface TLCanvasProps<S extends TLShape> {
  id?: string
  bindings?: TLBinding[]
  brush?: TLBounds
  shapes?: S[]
  theme?: TLTheme
  hoveredShape?: S
  editingShape?: S
  bindingShape?: S
  selectedBounds?: TLBounds
  selectedShapes?: S[]
  erasingShapes?: S[]
  gridSize?: number
  showGrid?: boolean
  showBounds?: boolean
  showResizeHandles?: boolean
  showRotateHandle?: boolean
  showContextBar?: boolean
  showBoundsDetail?: boolean
  showBoundsRotation?: boolean
  children?: React.ReactNode
}

/* ----------------- Renderer Props ----------------- */

export interface TLRendererProps<S extends TLShape>
  extends Partial<TLCanvasProps<S>>,
    Partial<TLCommonAppProps<S>> {
  viewport: TLViewport
  inputs: TLInputs
  callbacks?: Partial<TLEventHandlers<S>>
}

/* --------------------- Context -------------------- */

export interface TLRendererContext<S extends TLShape = TLShape> {
  id: string
  viewport: TLViewport
  inputs: TLInputs
  callbacks: Partial<TLEventHandlers<S>>
  components: Partial<TLComponents<S>>
  meta: any
}

/* --------------- Keyboard Shortcuts --------------- */

export type TLShortcut<
  S extends TLShape = TLShape,
  R extends TLRootState<S> = TLRootState<S>,
  T extends R | TLState<S, R, any> = any
> = {
  keys: string | string[]
  fn: (root: R, state: T) => void
}

/* ----------------- Type Assertion ----------------- */

export function isStringArray(arr: string[] | any[]): asserts arr is string[] {
  if (arr[0] && typeof arr[0] !== 'string') {
    throw Error('Expected a string array.')
  }
}

/* ---------------------- Misc ---------------------- */

export type AnyObject = { [key: string]: any }

/* ---------------------- Shape --------------------- */

export interface TLShapeProps {
  id: string
  parentId: string
  point: number[]
  rotation?: number
  name?: string
  children?: string[]
  handles?: Record<string, TLHandle>
  isGhost?: boolean
  isHidden?: boolean
  isLocked?: boolean
  isGenerated?: boolean
  isAspectRatioLocked?: boolean
}

export type TLSerializedShape<P = AnyObject> = TLShapeProps & {
  type: string
  nonce?: number
} & P

export interface TLShapeClass<S extends TLShape = TLShape> {
  new (props: any): S
  id: string
}

export interface TLCommonProps<M = unknown> {
  meta: M
  isEditing: boolean
  isBinding: boolean
  isHovered: boolean
  isSelected: boolean
  isErasing: boolean
}

export interface TLIndicatorProps<M = unknown> extends TLCommonProps<M> {
  meta: M
}

export interface TLComponentProps<M = unknown> extends TLIndicatorProps<M> {
  events: {
    onPointerMove: React.PointerEventHandler
    onPointerDown: React.PointerEventHandler
    onPointerUp: React.PointerEventHandler
    onPointerEnter: React.PointerEventHandler
    onPointerLeave: React.PointerEventHandler
    onKeyUp: React.KeyboardEventHandler
    onKeyDown: React.KeyboardEventHandler
  }
}

export interface TLResizeInfo<P = any> {
  type: TLBoundsEdge | TLBoundsCorner
  scaleX: number
  scaleY: number
  transformOrigin: number[]
  initialBounds: TLBounds
  initialProps: TLShapeProps & P
}

/* ----------------------- Dot ---------------------- */

export interface TLDotShapeProps {
  radius: number
}

/* -------------------- Box Shape ------------------- */

export interface TLBoxShapeProps {
  size: number[]
}

/* ------------------- Draw Shape ------------------- */

export interface TLDrawShapeProps {
  points: number[][]
  isComplete: boolean
}

/* --------------------- Polygon -------------------- */

export interface TLPolygonShapeProps extends TLBoxShapeProps {
  sides: number
  ratio: number
  isFlippedY: boolean
}

/* ---------------------- Star ---------------------- */

export interface TLStarShapeProps extends TLPolygonShapeProps {
  points: number
  ratio: number
  isFlippedY: boolean
}
