import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~lib'
import type { TLBounds, TLKeyboardHandler, TLPointerHandler, TLWheelHandler } from '~types'
import { BoundsUtils, GeomUtils } from '~utils'

export class RotatingState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'rotating'

  snapshot: Record<
    string,
    {
      point: number[]
      center: number[]
      rotation?: number
    }
  > = {}
  initialCommonCenter = [0, 0]
  initialCommonBounds = {} as TLBounds
  initialAngle = 0

  onEnter = () => {
    const { history, selectedShapes, selectedBounds } = this.app

    if (!selectedBounds) throw Error('Expected selected bounds.')

    history.pause()
    this.initialCommonBounds = { ...selectedBounds }
    this.initialCommonCenter = BoundsUtils.getBoundsCenter(selectedBounds)
    this.initialAngle = Vec.angle(this.initialCommonCenter, this.app.inputs.currentPoint)
    this.snapshot = Object.fromEntries(
      selectedShapes.map((shape) => [
        shape.id,
        { point: [...shape.point], center: [...shape.center], rotation: shape.rotation },
      ])
    )
  }

  onExit = () => {
    this.app.history.resume()
    this.snapshot = {}
  }

  onWheel: TLWheelHandler<S> = (info, gesture, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLPointerHandler<S> = () => {
    const {
      selectedShapes,
      inputs: { shiftKey, currentPoint },
    } = this.app

    const { snapshot, initialCommonCenter, initialAngle } = this

    const currentAngle = Vec.angle(initialCommonCenter, currentPoint)

    let angleDelta = currentAngle - initialAngle

    if (shiftKey) {
      angleDelta = GeomUtils.snapAngleToSegments(angleDelta, 24)
    }

    selectedShapes.forEach((shape) => {
      const initialShape = snapshot[shape.id]

      let initialAngle = 0

      if (shiftKey) {
        const { rotation = 0 } = initialShape
        initialAngle = GeomUtils.snapAngleToSegments(rotation, 24) - rotation
      }

      const relativeCenter = Vec.sub(initialShape.center, initialShape.point)
      const rotatedCenter = Vec.rotWith(initialShape.center, initialCommonCenter, angleDelta)

      if (shape.handles) {
        // Don't rotate shapes with handles; instead, rotate the handles
        // Object.values(shape.handles).forEach((handle) => {
        //   handle.point = Vec.rotWith(
        //     initialShape.handles![handle.id as keyof ArrowShape['handles']].point,
        //     relativeCenter,
        //     angleDelta
        //   )
        // })
        // const handlePoints = {
        //   start: [...shape.handles.start.point],
        //   end: [...shape.handles.end.point],
        // }
        // const offset = Utils.getCommonTopLeft([handlePoints.start, handlePoints.end])
        // shape.handles.start.point = Vec.sub(handlePoints.start, offset)
        // shape.handles.end.point = Vec.sub(handlePoints.end, offset)
        // shape.point = Vec.add(Vec.sub(rotatedCenter, relativeCenter), offset)
      } else {
        shape.update({
          point: Vec.sub(rotatedCenter, relativeCenter),
          rotation: (initialShape.rotation || 0) + angleDelta + initialAngle,
        })
      }
    })
  }

  onPointerUp: TLPointerHandler<S> = () => {
    this.app.history.resume()
    this.app.persist()
    this.tool.transition('idle')
  }

  onKeyDown: TLKeyboardHandler<S> = (info, e) => {
    switch (e.key) {
      case 'Escape': {
        this.app.selectedShapes.forEach((shape) => {
          shape.update(this.snapshot[shape.id])
        })
        this.tool.transition('idle')
        break
      }
    }
  }
}
