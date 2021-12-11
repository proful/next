import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLDrawShape, TLDrawTool, TLToolState } from '~lib'
import type { TLKeyboardHandler, TLPointerHandler } from '~types'

export class PointingState<
  S extends TLShape,
  T extends S & TLDrawShape,
  R extends TLApp<S>,
  P extends TLDrawTool<T, S, R>
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
