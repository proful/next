/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TLApp, TLShape } from '~lib'
import type { TLEventMap } from './TLEventMap'
import type { TLHandle } from './TLHandle'

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
  | {
      event: 'load'
      info: null
    }

export type TLSubscriptionEventName = TLSubscriptionEvent['event']

export type TLSubscriptionEventInfo<T extends TLSubscriptionEventName> = Extract<
  TLSubscriptionEvent,
  { event: T }
>['info']

export type TLCallback<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>,
  E extends TLSubscriptionEventName = TLSubscriptionEventName
> = (app: R, info: TLSubscriptionEventInfo<E>) => void

export type TLSubscription<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>,
  E extends TLSubscriptionEventName = TLSubscriptionEventName
> = {
  event: E
  callback: TLCallback<S, K, R, E>
}

export type TLSubscribe<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> = {
  <E extends TLSubscriptionEventName>(subscription: TLSubscription<S, K, R, E>): () => void
  <E extends TLSubscriptionEventName>(event: E, callback: TLCallback<S, K, R, E>): () => void
}

export interface TLCallbacks<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> {
  onMount: TLCallback<S, K, R, 'mount'>
  onPersist: TLCallback<S, K, R, 'persist'>
  onSave: TLCallback<S, K, R, 'save'>
  onSaveAs: TLCallback<S, K, R, 'saveAs'>
}

/* ----------------- Event Handlers ----------------- */

export enum TLTargetType {
  Canvas = 'canvas',
  Shape = 'shape',
  Bounds = 'bounds',
  Handle = 'handle',
}

export type TLEventInfo<S extends TLShape, H extends TLHandle = TLHandle> =
  | { type: TLTargetType.Canvas; target: 'canvas'; order: number }
  | { type: TLTargetType.Shape; target: S; order: number }
  | { type: TLTargetType.Handle; target: S; handle: H; index: number; order: number }
  | {
      type: TLTargetType.Bounds
      target: TLBoundsHandle
      order: number
    }

/* ----------------- Type Assertion ----------------- */

export function isStringArray(arr: string[] | any[]): asserts arr is string[] {
  if (arr[0] && typeof arr[0] !== 'string') {
    throw Error('Expected a string array.')
  }
}

/* ---------------------- Misc ---------------------- */

export type AnyObject = { [key: string]: any }
