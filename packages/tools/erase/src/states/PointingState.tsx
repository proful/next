import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLToolState, TLPointerHandler } from '@tldraw/core'
import type { TLEraseTool } from '../TLEraseTool'

export class PointingState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLEraseTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointing'

  onEnter = () => {
    const { currentPoint } = this.app.inputs

    this.app.setErasingShapes(
      this.app.shapesInViewport.filter((shape) => shape.hitTestPoint(currentPoint))
    )
  }

  onPointerMove: TLPointerHandler<S> = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('erasing')

      this.app.deselectAll()
    }
  }

  onPointerUp: TLPointerHandler<S> = () => {
    const shapesToDelete = [...this.app.erasingShapes]
    this.app.setErasingShapes([])
    this.app.deleteShapes(shapesToDelete)
    this.tool.transition('idle')
  }
}
