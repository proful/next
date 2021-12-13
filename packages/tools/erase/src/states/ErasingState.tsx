import { Vec } from '@tldraw/vec'
import { TLToolState, TLShape, TLApp, TLPointerHandler, TLWheelHandler } from '@tldraw/core'
import type { TLEraseTool } from '../TLEraseTool'

export class ErasingState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLEraseTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'erasing'

  private points: number[][] = [[0, 0, 0.5]]
  private hitShapes: Set<S> = new Set()

  onEnter = () => {
    const { originPoint } = this.app.inputs
    this.points = [originPoint]
    this.hitShapes.clear()
  }

  onPointerMove: TLPointerHandler<S> = () => {
    const { currentPoint, previousPoint } = this.app.inputs
    if (Vec.isEqual(previousPoint, currentPoint)) return
    this.points.push(currentPoint)

    this.app.shapesInViewport
      .filter((shape) => shape.hitTestLineSegment(previousPoint, currentPoint))
      .forEach((shape) => this.hitShapes.add(shape))

    this.app.setErasingShapes(Array.from(this.hitShapes.values()))
  }

  onPointerUp: TLPointerHandler<S> = () => {
    this.app.deleteShapes(Array.from(this.hitShapes.values()))
    this.tool.transition('idle')
  }

  onWheel: TLEvents<S>['wheel'] = (info, gesture, e) => {
    this.onPointerMove(info, e)
  }
}
