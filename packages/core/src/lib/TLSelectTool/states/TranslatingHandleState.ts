/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLShapeWithHandles, TLToolState } from '~lib'
import { TLCursor, TLEventHandleInfo, TLEventMap, TLEvents, TLHandle } from '~types'
import { BoundsUtils, deepCopy } from '~utils'

export class TranslatingHandleState<
  S extends TLShapeWithHandles,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'translatingHandle'
  cursor = TLCursor.Grabbing

  private offset = [0, 0]
  private initialTopLeft = [0, 0]
  private index = 0
  private shape: S = {} as S
  private initialShape: S = {} as S
  private handles: TLHandle[] = []
  private initialHandles: TLHandle[] = []

  onEnter = (
    info: {
      fromId: string
    } & TLEventHandleInfo<S, TLHandle>
  ) => {
    this.app.history.pause()
    this.offset = [0, 0]
    this.index = info.index
    this.shape = info.shape
    this.initialShape = this.shape.clone()
    this.handles = deepCopy(info.shape.handles)
    this.initialHandles = deepCopy(info.shape.handles)
    this.initialTopLeft = [...info.shape.point]
  }

  onExit = () => {
    this.app.history.resume()
  }

  onWheel: TLEvents<S>['wheel'] = (info, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLEvents<S>['pointer'] = () => {
    const {
      inputs: { shiftKey, previousPoint, originPoint, currentPoint },
    } = this.app
    if (Vec.isEqual(previousPoint, currentPoint)) return
    const delta = Vec.sub(currentPoint, originPoint)
    if (shiftKey) {
      if (Math.abs(delta[0]) < Math.abs(delta[1])) {
        delta[0] = 0
      } else {
        delta[1] = 0
      }
    }
    const { shape, initialShape, index } = this
    shape.onHandleChange({ index, initialShape, delta })
  }

  onPointerUp: TLEvents<S>['pointer'] = () => {
    this.app.history.resume()
    this.app.persist()
    this.tool.transition('idle')
  }

  onKeyDown: TLEvents<S>['keyboard'] = (info, e) => {
    switch (e.key) {
      case 'Escape': {
        this.shape.update({
          handles: this.initialHandles,
        })
        this.tool.transition('idle')
        break
      }
    }
  }
}
