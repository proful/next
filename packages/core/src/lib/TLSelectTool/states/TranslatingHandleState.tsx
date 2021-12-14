/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~lib'
import type { TLEventMap, TLEvents, TLHandle } from '~types'
import { BoundsUtils, deepCopy } from '~utils'

export class TranslatingHandleState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'translatingHandle'

  private offset = [0, 0]
  private initialTopLeft = [0, 0]
  private index = 0
  private shape: S = {} as S
  private handles: TLHandle[] = []
  private initialHandles: TLHandle[] = []

  onEnter = (info: { target: S & { handles: TLHandle[] }; handle: TLHandle; index: number }) => {
    this.app.history.pause()
    this.offset = [0, 0]
    this.index = info.index
    this.shape = info.target
    this.handles = deepCopy(info.target.handles)
    this.initialHandles = deepCopy(info.target.handles)
    this.initialTopLeft = [...info.target.point]
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
    const { shape, initialTopLeft, handles, initialHandles, index } = this
    handles[index].point = Vec.add(delta, initialHandles[index].point)
    const topLeft = BoundsUtils.getCommonTopLeft(handles.map((h) => h.point))
    shape.update({
      point: Vec.add(initialTopLeft, topLeft),
      handles: handles.map((h) => ({ ...h, point: Vec.sub(h.point, topLeft) })),
    })
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
