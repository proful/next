/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'
import type { TLEventInfo, TLEvents } from '@tldraw/core'
import type { TLReactShape } from '~lib'

export type WebKitGestureEvent = PointerEvent & {
  scale: number
  rotation: number
}

export interface TLHandlers<
  S extends TLReactShape = TLReactShape,
  E extends TLEventInfo<S> = TLEventInfo<S>
> extends TLEvents<S, E> {
  wheel: (info: E & { delta: number[]; point: number[] }, event: WheelEvent) => void
  pinch: (
    info: E & { delta: number[]; point: number[]; offset: number[] },
    event:
      | WheelEvent
      | PointerEvent
      | TouchEvent
      | KeyboardEvent
      | (PointerEvent & {
          scale: number
          rotation: number
        })
  ) => void
  pointer: (info: E, event: TLPointerEvent | KeyboardEvent | WheelEvent) => void
  keyboard: (info: E, event: KeyboardEvent | React.KeyboardEvent) => void
}

export type TLPointerEventHandler<T = Element> = React.EventHandler<TLPointerEvent<T>>

interface TLPointerEvent<T = Element> extends React.MouseEvent<T, PointerEvent> {
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
  order?: number
}
