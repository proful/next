import { TLDrawTool } from '@tldraw/draw-tool'
import { NuPenShape, Shape } from '~lib'

export class NuPenTool extends TLDrawTool<NuPenShape, Shape> {
  static id = 'pen'
  static shortcut = ['d', 'p']
  shapeClass = NuPenShape
  simplify = false
}
