/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vec } from '@tldraw/vec'
import { action, computed, makeObservable, observable } from 'mobx'
import { BoundsUtils, KeyUtils } from '~utils'
import {
  TLSelectTool,
  TLInputs,
  TLPage,
  TLViewport,
  TLShape,
  TLSerializedPage,
  TLToolClass,
  TLShapeClass,
  TLSerializedShape,
} from '~lib'
import type {
  TLBounds,
  TLEvents,
  TLSubscription,
  TLSubscriptionEventInfo,
  TLSubscriptionEventName,
  TLCallback,
  TLShortcut,
  TLEventMap,
  TLStateEvents,
} from '~types'
import { TLHistory } from '../TLHistory'
import { TLSettings } from '../TLSettings'
import { TLRootState } from '../TLState'
import { TLApi } from '~lib/TLApi'

export interface TLSerializedApp {
  currentPageId: string
  selectedIds: string[]
  pages: TLSerializedPage[]
}

export class TLApp<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap
> extends TLRootState<S, K> {
  constructor(
    serializedApp?: TLSerializedApp,
    shapeClasses?: TLShapeClass<S>[],
    tools?: TLToolClass<S, K>[]
  ) {
    super()
    this.history.pause()

    if (this.states && this.states.length > 0) {
      this.registerStates(...this.states)
      const initialId = this.initial ?? this.states[0].id
      const state = this.children.get(initialId)
      if (state) {
        this.currentState = state
        this.currentState?._events.onEnter({ fromId: 'initial' })
      }
    }

    if (shapeClasses) this.registerShapes(...shapeClasses)
    if (tools) this.registerStates(...tools)

    this.history.resume()

    if (serializedApp) this.history.deserialize(serializedApp)

    const ownShortcuts: TLShortcut<S, K>[] = [
      {
        keys: 'mod+shift+g',
        fn: () => this.api.toggleGrid(),
      },
      {
        keys: 'shift+0',
        fn: () => this.api.resetZoom(),
      },
      {
        keys: 'mod+-',
        fn: () => this.api.zoomToSelection(),
      },
      {
        keys: 'mod+-',
        fn: () => this.api.zoomOut(),
      },
      {
        keys: 'mod+=',
        fn: () => this.api.zoomIn(),
      },
      {
        keys: 'mod+z',
        fn: () => this.undo(),
      },
      {
        keys: 'mod+shift+z',
        fn: () => this.redo(),
      },
      {
        keys: 'mod+a',
        fn: () => {
          const { selectedTool } = this
          if (selectedTool.currentState.id !== 'idle') return
          if (selectedTool.id !== 'select') {
            this.selectTool('select')
          }
          this.api.selectAll()
        },
      },
      {
        keys: 'mod+s',
        fn: () => {
          this.save()
          this.notify('save', null)
        },
      },
      {
        keys: 'mod+shift+s',
        fn: () => {
          this.saveAs()
          this.notify('saveAs', null)
        },
      },
    ]

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const shortcuts = (this.constructor['shortcuts'] || []) as TLShortcut<S, K>[]
    this._disposables.push(
      ...[...ownShortcuts, ...shortcuts].map(({ keys, fn }) => {
        return KeyUtils.registerShortcut(keys, (e) => {
          fn(this, this, e)
        })
      })
    )

    this.api = new TLApi(this)

    makeObservable(this)

    this.notify('mount', null)
  }

  static id = 'app'

  static states: TLToolClass<any, any>[] = [TLSelectTool]

  static initial = 'select'

  api: TLApi<S, K>

  inputs = new TLInputs<K>()

  viewport = new TLViewport()

  settings = new TLSettings()

  /* -------------------- Document -------------------- */

  load = () => {
    // todo
    this.notify('load', null)
    return this
  }

  save = () => {
    // todo
    this.notify('save', null)
    return this
  }

  saveAs = () => {
    // todo
    this.notify('saveAs', null)
    return this
  }

  /* --------------------- History -------------------- */

  // this needs to be at the bottom

  history = new TLHistory<S, K>(this)

  persist = this.history.persist

  undo = this.history.undo

  redo = this.history.redo

  saving = false // used to capture direct mutations as part of the history stack

  saveState = () => {
    if (this.history.isPaused) return
    this.saving = true
    requestAnimationFrame(() => {
      if (this.saving) {
        this.persist()
        this.saving = false
      }
    })
  }

  /* ---------------------- Tools --------------------- */

  get selectedTool() {
    return this.currentState
  }

  selectTool = this.transition

  registerTools = this.registerStates

  /* -------------------- App State ------------------- */

  loadAppState(state: TLSerializedApp) {
    this.history.deserialize(state)
  }

  @computed get serialized(): TLSerializedApp {
    return {
      currentPageId: this.currentPageId,
      selectedIds: Array.from(this.selectedIds.values()),
      pages: this.pages.map((page) => page.serialized),
    }
  }

  @computed get showBounds() {
    return (
      this.currentState.id === 'select' &&
      this.selectedShapes.size > 0 &&
      !this.selectedShapesArray.every((shape) => shape.hideBounds)
    )
  }

  @computed get showBoundsDetail() {
    return (
      this.currentState.id === 'select' &&
      this.selectedShapes.size > 0 &&
      !this.selectedShapesArray.every((shape) => shape.hideBoundsDetail)
    )
  }

  @computed get showBoundsRotation() {
    const stateId = this.selectedTool.currentState.id
    return (
      this.currentState.id === 'select' &&
      ((this.selectedShapes.size > 0 && stateId === 'rotating') ||
        stateId === 'pointingRotateHandle')
    )
  }

  @computed get showContextBar() {
    const stateId = this.selectedTool.currentState.id
    return (
      this.currentState.id === 'select' &&
      this.selectedShapes.size > 0 &&
      stateId === 'idle' &&
      !this.selectedShapesArray.every((shape) => shape.hideContextBar)
    )
  }

  @computed get showRotateHandle() {
    const stateId = this.selectedTool.currentState.id
    return (
      this.currentState.id === 'select' &&
      this.selectedShapes.size > 0 &&
      stateId === 'idle' &&
      !this.selectedShapesArray.every((shape) => shape.hideRotateHandle)
    )
  }

  @computed get showResizeHandles() {
    const stateId = this.selectedTool.currentState.id
    return (
      this.currentState.id === 'select' &&
      this.selectedShapes.size > 0 &&
      stateId === 'idle' &&
      !this.selectedShapesArray.every((shape) => shape.hideResizeHandles)
    )
  }

  /* ------------------ Shape Classes ----------------- */

  // Map of shape classes (used for deserialization)
  shapeClasses = new Map<string, TLShapeClass<S>>()

  registerShapes = (...shapeClasses: TLShapeClass<S>[]) => {
    shapeClasses.forEach((shapeClass) => this.shapeClasses.set(shapeClass.id, shapeClass))
  }

  deregisterShapes = (...shapeClasses: TLShapeClass<S>[]) => {
    shapeClasses.forEach((shapeClass) => this.shapeClasses.delete(shapeClass.id))
  }

  getShapeClass = (type: string): TLShapeClass<S> => {
    if (!type) throw Error('No shape type provided.')
    const shapeClass = this.shapeClasses.get(type)
    if (!shapeClass) throw Error(`Could not find shape class for ${type}`)
    return shapeClass
  }

  /* -------------------- Settings -------------------- */

  /* ---------------------- Pages --------------------- */

  @observable pages: TLPage<S, K>[] = [
    new TLPage(this, { id: 'page', name: 'page', shapes: [], bindings: [] }),
  ]

  @action addPages(...pages: TLPage<S, K>[]): void {
    this.pages.push(...pages)
    this.persist()
  }

  @action removePages(...pages: TLPage<S, K>[]): void {
    this.pages = this.pages.filter((page) => !pages.includes(page))
    this.persist()
  }

  /* ------------------ Current Page ------------------ */

  @observable currentPageId = 'page'

  @action setCurrentPage(page: string | TLPage<S, K>) {
    this.currentPageId = typeof page === 'string' ? page : page.id
    return this
  }

  @computed get currentPage(): TLPage<S, K> {
    const page = this.pages.find((page) => page.id === this.currentPageId)
    if (!page) throw Error(`Could not find a page named ${this.currentPageId}.`)
    return page
  }

  /* --------------------- Shapes --------------------- */

  @computed get shapesInViewport(): S[] {
    const {
      currentPage,
      viewport: { currentView },
    } = this

    return currentPage.shapes.filter((shape) => {
      return (
        shape.parentId === currentPage.id &&
        (BoundsUtils.boundsContain(currentView, shape.rotatedBounds) ||
          BoundsUtils.boundsCollide(currentView, shape.rotatedBounds))
      )
    })
  }

  @action readonly createShapes = (shapes: S[] | TLSerializedShape[]): this => {
    this.currentPage.addShapes(...shapes)
    return this
  }

  @action readonly deleteShapes = (shapes: S[] | string[]): this => {
    if (shapes.length === 0) return this

    let ids: Set<string>
    if (typeof shapes[0] === 'string') {
      ids = new Set(shapes as string[])
    } else {
      ids = new Set((shapes as S[]).map((shape) => shape.id))
    }
    this.setSelectedShapes(this.selectedShapesArray.filter((shape) => !ids.has(shape.id)))
    this.currentPage.removeShapes(...shapes)
    this.persist()
    return this
  }

  /* ------------------ Hovered Shape ----------------- */

  @observable hoveredId?: string

  @computed get hoveredShape(): S | undefined {
    const { hoveredId, currentPage } = this
    return hoveredId ? currentPage.shapes.find((shape) => shape.id === hoveredId) : undefined
  }

  @action readonly setHoveredShape = (shape: string | S | undefined): this => {
    this.hoveredId = typeof shape === 'string' ? shape : shape?.id
    return this
  }

  /* ----------------- Selected Shapes ---------------- */

  @observable erasingIds: Set<string> = new Set()
  @observable erasingShapes: Set<S> = new Set()

  @computed get erasingShapesArray() {
    return Array.from(this.erasingShapes.values())
  }

  @observable selectedIds: Set<string> = new Set()
  @observable selectedShapes: Set<S> = new Set()

  @computed get selectedShapesArray() {
    const { selectedShapes, selectedTool } = this
    const stateId = selectedTool.id
    if (stateId !== 'select') return []
    return Array.from(selectedShapes.values())
  }

  @action readonly setErasingShapes = (shapes: S[] | string[]): this => {
    const { erasingIds, erasingShapes } = this
    erasingIds.clear()
    erasingShapes.clear()
    if (shapes[0] && typeof shapes[0] === 'string') {
      shapes.forEach((s) => erasingIds.add(s as string))
    } else {
      shapes.forEach((s) => erasingIds.add((s as S).id))
    }
    const newErasingShapes = this.currentPage.shapes.filter((shape) => erasingIds.has(shape.id))
    newErasingShapes.forEach((s) => erasingShapes.add(s))
    return this
  }

  @action readonly setSelectedShapes = (shapes: S[] | string[]): this => {
    const { selectedIds, selectedShapes } = this
    selectedIds.clear()
    selectedShapes.clear()
    if (shapes[0] && typeof shapes[0] === 'string') {
      shapes.forEach((s) => selectedIds.add(s as string))
    } else {
      shapes.forEach((s) => selectedIds.add((s as S).id))
    }
    const newSelectedShapes = this.currentPage.shapes.filter((shape) => selectedIds.has(shape.id))
    newSelectedShapes.forEach((s) => selectedShapes.add(s))
    return this
  }

  @computed get selectedBounds(): TLBounds | undefined {
    return this.selectedShapesArray.length === 1
      ? { ...this.selectedShapesArray[0].bounds, rotation: this.selectedShapesArray[0].rotation }
      : BoundsUtils.getCommonBounds(this.selectedShapesArray.map((shape) => shape.rotatedBounds))
  }

  /* ---------------------- Brush --------------------- */

  @observable brush?: TLBounds

  @action readonly setBrush = (brush: TLBounds): this => {
    this.brush = brush
    return this
  }

  @action readonly clearBrush = (): this => {
    this.brush = undefined
    return this
  }

  // Camera

  @action setCamera = (point?: number[], zoom?: number): this => {
    this.viewport.update({ point, zoom })
    return this
  }

  readonly getPagePoint = (point: number[]): number[] => {
    const { camera } = this.viewport
    return Vec.sub(Vec.div(point, camera.zoom), camera.point)
  }

  readonly getScreenPoint = (point: number[]): number[] => {
    const { camera } = this.viewport
    return Vec.mul(Vec.add(point, camera.point), camera.zoom)
  }

  /* --------------------- Events --------------------- */

  private subscriptions = new Set<TLSubscription<S, K, any, TLSubscriptionEventName>>([])

  readonly unsubscribe = (subscription: TLSubscription<S, K, any, TLSubscriptionEventName>) => {
    this.subscriptions.delete(subscription)
    return this
  }

  subscribe = <E extends TLSubscriptionEventName>(
    event: E | TLSubscription<S>,
    callback?: TLCallback<S, K, this, E>
  ) => {
    if (typeof event === 'object') {
      this.subscriptions.add(event)
      return () => this.unsubscribe(event)
    } else {
      if (callback === undefined) throw Error('Callback is required.')
      const subscription = { event, callback }
      this.subscriptions.add(subscription)
      return () => this.unsubscribe(subscription)
    }
  }

  notify = <E extends TLSubscriptionEventName>(event: E, info: TLSubscriptionEventInfo<E>) => {
    this.subscriptions.forEach((subscription) => {
      if (subscription.event === event) {
        subscription.callback(this, info)
      }
    })
    return this
  }

  /* ----------------- Event Handlers ----------------- */

  readonly onTransition: TLStateEvents<S, K>['onTransition'] = () => {
    this.settings.update({ isToolLocked: false })
  }

  readonly onWheel: TLEvents<S, K>['wheel'] = (info, e) => {
    this.viewport.panCamera(info.delta)
    this.inputs.onWheel([...this.viewport.getPagePoint([e.clientX, e.clientY]), 0.5], e)
  }

  readonly onPointerDown: TLEvents<S, K>['pointer'] = (info, e) => {
    if ('clientX' in e) {
      this.inputs.onPointerDown(
        [...this.viewport.getPagePoint([e.clientX, e.clientY]), 0.5],
        e as K['pointer']
      )
    }
  }

  readonly onPointerUp: TLEvents<S, K>['pointer'] = (info, e) => {
    if ('clientX' in e) {
      this.inputs.onPointerUp(
        [...this.viewport.getPagePoint([e.clientX, e.clientY]), 0.5],
        e as K['pointer']
      )
    }
  }

  readonly onPointerMove: TLEvents<S, K>['pointer'] = (info, e) => {
    if ('clientX' in e) {
      this.inputs.onPointerMove([...this.viewport.getPagePoint([e.clientX, e.clientY]), 0.5], e)
    }
  }

  readonly onKeyDown: TLEvents<S, K>['keyboard'] = (info, e) => {
    this.inputs.onKeyDown(e)
  }

  readonly onKeyUp: TLEvents<S, K>['keyboard'] = (info, e) => {
    this.inputs.onKeyUp(e)
  }

  readonly onPinchStart: TLEvents<S, K>['pinch'] = (info, e) => {
    this.inputs.onPinchStart([...this.viewport.getPagePoint(info.point), 0.5], e)
  }

  readonly onPinch: TLEvents<S, K>['pinch'] = (info, e) => {
    this.inputs.onPinch([...this.viewport.getPagePoint(info.point), 0.5], e)
  }

  readonly onPinchEnd: TLEvents<S, K>['pinch'] = (info, e) => {
    this.inputs.onPinchEnd([...this.viewport.getPagePoint(info.point), 0.5], e)
  }

  // /* ------------------- Public API ------------------- */

  // /**
  //  * Set the current page.
  //  *
  //  * @param page The new current page or page id.
  //  */
  // changePage = (page: string | TLPage<S, K>): this => {
  //   return this.setCurrentPage(page)
  // }

  // /**
  //  * Set the hovered shape.
  //  *
  //  * @param shape The new hovered shape or shape id.
  //  */
  // hover = (shape: string | S | undefined): this => {
  //   return this.setHoveredShape(shape)
  // }

  // /**
  //  * Create one or more shapes on the current page.
  //  *
  //  * @param shapes The new shape instances or serialized shapes.
  //  */
  // create = (...shapes: S[] | TLSerializedShape[]): this => {
  //   return this.createShapes(shapes)
  // }

  // /**
  //  * Update one or more shapes on the current page.
  //  *
  //  * @param shapes The serialized shape changes to apply.
  //  */
  // update = (...shapes: { id: string } & TLSerializedShape[]): this => {
  //   shapes.forEach((shape) => {
  //     this.currentPage.shapes.find((instance) => shape.id === instance.id)?.update(shape)
  //   })
  //   return this
  // }

  // /**
  //  * Delete one or more shapes from the current page.
  //  *
  //  * @param shapes The shapes or shape ids to delete.
  //  */
  // delete = (...shapes: S[] | string[]): this => {
  //   if (shapes.length === 0) shapes = this.selectedIds
  //   return this.deleteShapes(shapes)
  // }

  // /**
  //  * Select one or more shapes on the current page.
  //  *
  //  * @param shapes The shapes or shape ids to select.
  //  */
  // select = (...shapes: S[] | string[]): this => {
  //   return this.setSelectedShapes(shapes)
  // }

  // /**
  //  * Deselect one or more selected shapes on the current page.
  //  *
  //  * @param ids The shapes or shape ids to deselect.
  //  */
  // deselect = (...shapes: S[] | string[]): this => {
  //   const ids =
  //     typeof shapes[0] === 'string'
  //       ? (shapes as string[])
  //       : (shapes as S[]).map((shape) => shape.id)
  //   this.setSelectedShapes(this.selectedIds.filter((id) => !ids.includes(id)))
  //   return this
  // }

  // /** Select all shapes on the current page. */
  // selectAll = (): this => {
  //   return this.setSelectedShapes(this.currentPage.shapes)
  // }

  // /** Deselect all shapes on the current page. */
  // deselectAll = (): this => {
  //   return this.setSelectedShapes([])
  // }

  // /** Zoom the camera in. */
  // zoomIn = (): this => {
  //   this.viewport.zoomIn()
  //   return this
  // }

  // /** Zoom the camera out. */
  // zoomOut = (): this => {
  //   this.viewport.zoomOut()
  //   return this
  // }

  // /** Reset the camera to 100%. */
  // resetZoom = (): this => {
  //   this.viewport.resetZoom()
  //   return this
  // }

  // /** Zoom to fit all of the current page's shapes in the viewport. */
  // zoomToFit = (): this => {
  //   const { shapes } = this.currentPage
  //   if (shapes.length === 0) return this
  //   const commonBounds = BoundsUtils.getCommonBounds(shapes.map((shape) => shape.bounds))
  //   this.viewport.zoomToBounds(commonBounds)
  //   return this
  // }

  // /** Zoom to fit the current selection in the viewport. */
  // zoomToSelection = (): this => {
  //   const { selectedBounds } = this
  //   if (!selectedBounds) return this
  //   this.viewport.zoomToBounds(selectedBounds)
  //   return this
  // }

  // toggleGrid = (): this => {
  //   return this.setSetting('showGrid', !this.showGrid)
  // }
}
