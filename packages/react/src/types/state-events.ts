import type { TLEventInfo } from '@tldraw/core'
import type { TLReactShape } from '~lib'
import type { TLHandlers } from './event-handlers'

export interface TLEventHandlers<
  S extends TLReactShape = TLReactShape,
  E extends TLEventInfo<S> = TLEventInfo<S>
> {
  /**
   * Respond to wheel events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onWheel: TLHandlers<S, E>['wheel']
  /**
   * Respond to pointer down events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerDown: TLHandlers<S, E>['pointer']
  /**
   * Respond to pointer up events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerUp: TLHandlers<S, E>['pointer']
  /**
   * Respond to pointer move events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerMove: TLHandlers<S, E>['pointer']

  /**
   * Respond to pointer enter events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerEnter: TLHandlers<S, E>['pointer']
  /**
   * Respond to pointer leave events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerLeave: TLHandlers<S, E>['pointer']

  /**
   * Respond to key down events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onKeyDown: TLHandlers<S, E>['keyboard']

  /**
   * Respond to key up events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onKeyUp: TLHandlers<S, E>['keyboard']

  /**
   * Respond to pinch start events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinchStart: TLHandlers<S, E>['pinch']

  /**
   * Respond to pinch events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinch: TLHandlers<S, E>['pinch']
  /**
   * Respond to pinch end events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinchEnd: TLHandlers<S, E>['pinch']
}

export type TLOnEnter<T = { fromId: string }> = (info: T) => void

export type TLOnExit<T = { toId: string }> = (info: T) => void

export type TLOnTransition<T = { toId: string; fromId: string }> = (info: T) => void

export interface TLStateEvents<S extends TLReactShape = TLReactShape> extends TLEventHandlers<S> {
  onEnter: TLOnEnter
  onExit: TLOnExit
  onTransition: TLOnTransition
  handleModifierKey: TLHandlers<S>['keyboard']
}
