import { TLDrawTool } from '@tldraw/core'
import { NuPenShape, Shape } from 'unused-app'

export class NuPenTool extends TLDrawTool<NuPenShape, Shape> {
  static id = 'pen'
  static shortcut = ['d', 'p']
  shapeClass = NuPenShape
  simplify = false
}
