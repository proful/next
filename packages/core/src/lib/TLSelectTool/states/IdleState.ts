import { TLShape, TLApp, TLSelectTool, TLToolState } from '~lib'
import { TLEventMap, TLEvents, TLShortcut, TLTargetType } from '~types'
import { PointUtils } from '~utils'

export class IdleState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'idle'

  static shortcuts: TLShortcut<TLShape, TLEventMap, TLApp>[] = [
    {
      keys: ['delete', 'backspace'],
      fn: app => app.api.deleteShapes(),
    },
  ]

  onExit = () => {
    this.app.setHoveredShape(undefined)
  }

  onPointerEnter: TLEvents<S>['pointer'] = info => {
    if (info.order > 0) return

    switch (info.type) {
      case TLTargetType.Shape: {
        this.app.setHoveredShape(info.target.id)
        break
      }
      case TLTargetType.Bounds: {
        if (!(info.target === 'background' || info.target === 'center')) {
          this.tool.transition('hoveringResizeHandle', info)
        }
        break
      }
    }
  }

  onPointerDown: TLEvents<S>['pointer'] = (info, event) => {
    const {
      selectedShapes,
      inputs: { ctrlKey },
    } = this.app

    // Holding ctrlKey should ignore shapes
    if (ctrlKey) {
      this.tool.transition('pointingCanvas')
      return
    }

    switch (info.type) {
      case TLTargetType.Bounds: {
        switch (info.target) {
          case 'center': {
            break
          }
          case 'background': {
            this.tool.transition('pointingBoundsBackground')
            break
          }
          case 'rotate': {
            this.tool.transition('pointingRotateHandle')
            break
          }
          default: {
            this.tool.transition('pointingResizeHandle', { target: info.target })
          }
        }
        break
      }
      case TLTargetType.Shape: {
        if (selectedShapes.has(info.target)) {
          this.tool.transition('pointingSelectedShape', { target: info.target })
        } else {
          const { selectedBounds, inputs } = this.app
          if (selectedBounds && PointUtils.pointInBounds(inputs.currentPoint, selectedBounds)) {
            this.tool.transition('pointingShapeBehindBounds', { target: info.target })
          } else {
            this.tool.transition('pointingShape', { target: info.target })
          }
        }
        break
      }
      case TLTargetType.Handle: {
        this.tool.transition('pointingHandle', info)
        break
      }
      case TLTargetType.Canvas: {
        this.tool.transition('pointingCanvas')
        break
      }
    }
  }

  onPointerLeave: TLEvents<S>['pointer'] = info => {
    if (info.order > 0) return

    if (info.type === TLTargetType.Shape) {
      if (this.app.hoveredId) {
        this.app.setHoveredShape(undefined)
      }
    }
  }

  onPinchStart: TLEvents<S>['pinch'] = (info, event) => {
    this.tool.transition('pinching', { info, event })
  }
}
