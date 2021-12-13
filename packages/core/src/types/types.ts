/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TLApp, TLShape, TLRootState, TLState } from '~lib'

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

export interface TLOffset {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

/* --------------------- Events --------------------- */

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

export interface TLSubscriptionCallbacks<
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>
> {
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

export interface TLResizeInfo<P = any> {
  type: TLBoundsEdge | TLBoundsCorner
  scaleX: number
  scaleY: number
  transformOrigin: number[]
  initialBounds: TLBounds
  initialProps: TLShapeProps & P
}

export type TLCustomProps<P extends AnyObject = any> = TLShapeProps & Partial<P>

export type WebkitGesture = PointerEvent & {
  scale: number
  rotation: number
}
