/* eslint-disable @typescript-eslint/no-explicit-any */
import { action, makeObservable, observable } from 'mobx'
import type {
  TLOnTransition,
  TLEventHandlers,
  TLOnEnter,
  TLOnExit,
  TLShortcut,
  TLEvents,
  TLStateEventHandlers,
  AnyObject,
} from '~types'
import type { TLShape } from '~lib'
import { KeyUtils } from '~utils'

export interface TLStateClass<
  S extends TLShape,
  R extends TLRootState<S> = TLRootState<S>,
  P extends R | TLState<S, R, any> = any
> {
  new (parent: P, root: R): TLState<S, R>
  id: string
}

export abstract class TLRootState<S extends TLShape> implements Partial<TLEventHandlers<S>> {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = this.constructor['id'] as string

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const initial = this.constructor['initial'] as string | undefined

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const states = this.constructor['states'] as TLStateClass<S>[]

    this._id = id
    this._initial = initial
    this._states = states
  }

  private _id: string
  private _initial?: string
  private _states: TLStateClass<S, any, any>[]
  private _isActive = false

  protected _disposables: (() => void)[] = []

  dispose() {
    this._disposables.forEach((disposable) => disposable())
    return this
  }

  get initial() {
    return this._initial
  }

  get states() {
    return this._states
  }

  get id() {
    return this._id
  }

  get isActive(): boolean {
    return this._isActive
  }

  get ascendants(): TLRootState<S>[] {
    return [this]
  }

  get descendants(): (TLState<S, this, any> | this)[] {
    return Array.from(this.children.values()).flatMap((state) => [state, ...state.descendants])
  }

  /* ------------------ Child States ------------------ */

  children = new Map<string, TLState<S, any, any>>([])

  registerStates = (...stateClasses: TLStateClass<S, any>[]): void => {
    stateClasses.forEach((StateClass) =>
      this.children.set(StateClass.id, new StateClass(this, this))
    )
  }

  deregisterStates = (...states: TLStateClass<S, any>[]): void => {
    states.forEach((StateClass) => {
      this.children.get(StateClass.id)?.dispose()
      this.children.delete(StateClass.id)
    })
  }

  @observable currentState: TLState<S, any, any> = {} as TLState<S, any, any>

  @action setCurrentState(state: TLState<S, any, any>) {
    this.currentState = state
  }

  /**
   * Transition to a new active state.
   *
   * @param id The id of the new active state.
   * @param data (optional) Any data to send to the new active state's `onEnter` method.
   */
  transition = (id: string, data: AnyObject = {}) => {
    if (this.children.size === 0)
      throw Error(`Tool ${this.id} has no states, cannot transition to ${id}.`)
    const nextState = this.children.get(id)
    const prevState = this.currentState
    if (!nextState) throw Error(`Could not find a state named ${id}.`)
    if (this.currentState) {
      prevState._events.onExit({ ...data, toId: id })
      prevState.dispose()
      nextState.registerKeyboardShortcuts()
      this.setCurrentState(nextState)
      this._events.onTransition({ ...data, fromId: prevState.id, toId: id })
      nextState._events.onEnter({ ...data, fromId: prevState.id })
    } else {
      this.currentState = nextState
      nextState._events.onEnter({ ...data, fromId: '' })
    }
  }

  /* ----------------- Internal Events ---------------- */

  private forwardEvent = <
    K extends keyof TLStateEventHandlers<S>,
    A extends Parameters<TLStateEventHandlers<S>[K]>
  >(
    eventName: keyof TLStateEventHandlers<S>,
    ...args: A
  ) => {
    if (this.currentState?._events?.[eventName]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.currentState._events?.[eventName](...args)
    }
  }

  _events: TLStateEventHandlers<S> = {
    /**
     * Handle the change from inactive to active.
     *
     * @param info The previous state and any info sent via the transition.
     */
    onTransition: (info) => {
      this.onTransition?.(info)
    },

    /**
     * Handle the change from inactive to active.
     *
     * @param info The previous state and any info sent via the transition.
     */
    onEnter: (info) => {
      this._isActive = true
      if (this.initial) this.transition(this.initial, info)
      this.onEnter?.(info)
    },

    /**
     * Handle the change from active to inactive.
     *
     * @param info The next state and any info sent via the transition.
     */
    onExit: (info) => {
      this._isActive = false
      this.currentState?.onExit?.({ fromId: 'parent' })
      this.onExit?.(info)
    },

    /**
     * Respond to wheel events forwarded to the state by its parent. Run the current active child
     * state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onWheel: (info, event) => {
      this.onWheel?.(info, event)
      this.forwardEvent('onWheel', info, event)
    },

    /**
     * Respond to pointer down events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerDown: (info, event) => {
      this.onPointerDown?.(info, event)
      this.forwardEvent('onPointerDown', info, event)
    },

    /**
     * Respond to pointer up events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerUp: (info, event) => {
      this.onPointerUp?.(info, event)
      this.forwardEvent('onPointerUp', info, event)
    },

    /**
     * Respond to pointer move events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerMove: (info, event) => {
      this.onPointerMove?.(info, event)
      this.forwardEvent('onPointerMove', info, event)
    },

    /**
     * Respond to pointer enter events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerEnter: (info, event) => {
      this.onPointerEnter?.(info, event)
      this.forwardEvent('onPointerEnter', info, event)
    },

    /**
     * Respond to pointer leave events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerLeave: (info, event) => {
      this.onPointerLeave?.(info, event)
      this.forwardEvent('onPointerLeave', info, event)
    },

    /**
     * Respond to key down events forwarded to the state by its parent. Run the current active child
     * state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onKeyDown: (info, event) => {
      this._events.handleModifierKey(info, event)
      this.onKeyDown?.(info, event)
      this.forwardEvent('onKeyDown', info, event)
    },

    /**
     * Respond to key up events forwarded to the state by its parent. Run the current active child
     * state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onKeyUp: (info, event) => {
      this._events.handleModifierKey(info, event)
      this.onKeyUp?.(info, event)
      this.forwardEvent('onKeyUp', info, event)
    },

    /**
     * Respond to pinch start events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param gesture The gesture info from useGesture.
     * @param event The DOM event.
     */
    onPinchStart: (info, event) => {
      this.onPinchStart?.(info, event)
      this.forwardEvent('onPinchStart', info, event)
    },

    /**
     * Respond to pinch events forwarded to the state by its parent. Run the current active child
     * state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param gesture The gesture info from useGesture.
     * @param event The DOM event.
     */
    onPinch: (info, event) => {
      this.onPinch?.(info, event)
      this.forwardEvent('onPinch', info, event)
    },

    /**
     * Respond to pinch end events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param gesture The gesture info from useGesture.
     * @param event The DOM event.
     */
    onPinchEnd: (info, event) => {
      this.onPinchEnd?.(info, event)
      this.forwardEvent('onPinchEnd', info, event)
    },

    /**
     * When a modifier key is pressed, treat it as a pointer move.
     *
     * @private
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    handleModifierKey: (info, event) => {
      switch (event.key) {
        case 'Shift':
        case 'Alt':
        case 'Ctrl':
        case 'Meta': {
          this._events.onPointerMove(info, event)
          break
        }
      }
    },
  }

  /* ----------------- For Subclasses ----------------- */

  static id: string

  static shortcuts?: TLShortcut<any, any>[]

  onEnter?: TLOnEnter<any>

  onExit?: TLOnExit<any>

  onTransition?: TLOnTransition<any>

  onWheel?: TLEvents<S>['wheel']

  onPointerDown?: TLEvents<S>['pointer']

  onPointerUp?: TLEvents<S>['pointer']

  onPointerMove?: TLEvents<S>['pointer']

  onPointerEnter?: TLEvents<S>['pointer']

  onPointerLeave?: TLEvents<S>['pointer']

  onKeyDown?: TLEvents<S>['keyboard']

  onKeyUp?: TLEvents<S>['keyboard']

  onPinchStart?: TLEvents<S>['pinch']

  onPinch?: TLEvents<S>['pinch']

  onPinchEnd?: TLEvents<S>['pinch']
}

export abstract class TLState<
  S extends TLShape,
  R extends TLRootState<S>,
  P extends R | TLState<S, any> = any
> extends TLRootState<S> {
  constructor(parent: P, root: R) {
    super()
    this._parent = parent
    this._root = root

    if (this.states && this.states.length > 0) {
      this.registerStates(...this.states)
      const initialId = this.initial ?? this.states[0].id
      const state = this.children.get(initialId)
      if (state) {
        this.setCurrentState(state)
        this.currentState?._events.onEnter({ fromId: 'initial' })
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const shortcut = this.constructor['shortcut'] as string
    if (shortcut) {
      KeyUtils.registerShortcut(shortcut, () => {
        this.parent.transition(this.id)
      })
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const shortcuts = this.constructor['shortcuts'] as TLShortcut<S>[]
    this._shortcuts = shortcuts

    makeObservable(this)
  }

  registerKeyboardShortcuts = (): void => {
    if (!this._shortcuts?.length) return

    this._disposables.push(
      ...this._shortcuts.map(({ keys, fn }) => {
        return KeyUtils.registerShortcut(keys, () => {
          if (!this.isActive) return
          fn(this.root, this)
        })
      })
    )
  }

  /* --------------------- States --------------------- */

  protected _root: R
  protected _parent: P
  private _shortcuts: TLShortcut<S>[] = []

  get root() {
    return this._root
  }

  get parent() {
    return this._parent
  }

  get ascendants(): (P | TLState<S, R>)[] {
    if (!this.parent) return [this]
    if (!('ascendants' in this.parent)) return [this.parent, this]
    return [...this.parent.ascendants, this]
  }

  children = new Map<string, TLState<S, R, any>>([])

  registerStates = (...stateClasses: TLStateClass<S, R, any>[]): void => {
    stateClasses.forEach((StateClass) =>
      this.children.set(StateClass.id, new StateClass(this, this._root))
    )
  }

  deregisterStates = (...states: TLStateClass<S, R, any>[]): void => {
    states.forEach((StateClass) => {
      this.children.get(StateClass.id)?.dispose()
      this.children.delete(StateClass.id)
    })
  }
}
