import { TLDrawTool } from '@tldraw/next'
import { NuPenShape, Shape } from 'stores'

export class NuPenTool extends TLDrawTool<NuPenShape, Shape> {
  static id = 'pen'
  static shortcut = ['d', 'p']
  shapeClass = NuPenShape
  simplify = false
}
