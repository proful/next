/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TLEventInfo, WebkitGesture } from './types'
import type { TLShape } from '~lib'

export interface TLPointerEvent<T = Element> extends React.MouseEvent<T, PointerEvent> {
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

export type TLPointerEventHandler<T = Element> = React.EventHandler<TLPointerEvent<T>>

export interface TLEvents<S extends TLShape = TLShape, E extends TLEventInfo<S> = TLEventInfo<S>> {
  wheel: (info: E & { delta: number[]; point: number[] }, event: WheelEvent) => void
  pinch: (
    info: E & { delta: number[]; point: number[]; offset: number[] },
    event: WheelEvent | PointerEvent | TouchEvent | KeyboardEvent | WebkitGesture
  ) => void
  pointer: (info: E, event: TLPointerEvent | KeyboardEvent | WheelEvent) => void
  keyboard: (info: E, event: KeyboardEvent) => void
}
