import type { TLShape } from '~lib'
import type { TLEventInfo } from './types'
import type { TLEvents } from './events'

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
  onWheel: TLEvents<S, E>['wheel']
  /**
   * Respond to pointer down events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerDown: TLEvents<S, E>['pointer']
  /**
   * Respond to pointer up events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerUp: TLEvents<S, E>['pointer']
  /**
   * Respond to pointer move events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerMove: TLEvents<S, E>['pointer']

  /**
   * Respond to pointer enter events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerEnter: TLEvents<S, E>['pointer']
  /**
   * Respond to pointer leave events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onPointerLeave: TLEvents<S, E>['pointer']

  /**
   * Respond to key down events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onKeyDown: TLEvents<S, E>['keyboard']

  /**
   * Respond to key up events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param event The DOM event.
   */
  onKeyUp: TLEvents<S, E>['keyboard']

  /**
   * Respond to pinch start events forwarded to the state by its parent. Run the current active
   * child state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinchStart: TLEvents<S, E>['pinch']

  /**
   * Respond to pinch events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinch: TLEvents<S, E>['pinch']
  /**
   * Respond to pinch end events forwarded to the state by its parent. Run the current active child
   * state's handler, then the state's own handler.
   *
   * @param info The event info from TLInputs.
   * @param gesture The gesture info from useGesture.
   * @param event The DOM event.
   */
  onPinchEnd: TLEvents<S, E>['pinch']
}
