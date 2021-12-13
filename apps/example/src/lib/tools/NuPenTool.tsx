import { TLDrawTool } from '@tldraw/draw-tool'
import type { TLReactEventMap } from '@tldraw/react'
import { NuPenShape, Shape } from '~lib'

export class NuPenTool extends TLDrawTool<NuPenShape, Shape, TLReactEventMap> {
  static id = 'pen'
  static shortcut = ['d', 'p']
  shapeClass = NuPenShape
  simplify = false
}
