import { Vec } from '@tldraw/vec'
import type { FullGestureState, WebKitGestureEvent } from '@use-gesture/core/types'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~lib'
import type { TLEventInfo, TLPinchHandler } from '~types'

type GestureInfo<S extends TLShape = TLShape> = {
  info: TLEventInfo<S>
  gesture: Omit<FullGestureState<'pinch'>, 'event'> & {
    event: WheelEvent | PointerEvent | TouchEvent | WebKitGestureEvent
  }
  event: WheelEvent | PointerEvent | TouchEvent | WebKitGestureEvent
}

export class PinchingState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'pinching'

  origin: number[] = [0, 0]
  prevDelta: number[] = [0, 0]

  private pinchCamera(point: number[], delta: number[], zoom: number) {
    const { camera } = this.app.viewport
    const nextPoint = Vec.sub(camera.point, Vec.div(delta, camera.zoom))
    const p0 = Vec.sub(Vec.div(point, camera.zoom), nextPoint)
    const p1 = Vec.sub(Vec.div(point, zoom), nextPoint)
    this.app.setCamera(Vec.toFixed(Vec.add(nextPoint, Vec.sub(p1, p0))), zoom)
  }

  onEnter = (info: GestureInfo<any>) => {
    this.prevDelta = info.gesture.delta
    this.origin = info.gesture.origin
  }

  onPinch: TLPinchHandler<S> = (info, gesture, event) => {
    // const delta = Vec.sub(this.origin, gesture.origin)
    // const trueDelta = Vec.sub(delta, this.prevDelta)
    // this.prevDelta = gesture.delta
    this.pinchCamera(gesture.origin, [0, 0], gesture.offset[0])
  }

  onPinchEnd: TLPinchHandler<S> = (_info, gesture, event) => {
    this.tool.transition('idle')
  }
}
