import { TLDotTool } from '@tldraw/core'
import { NuApp, Shape, NuDotShape } from 'stores'

export class NuDotTool extends TLDotTool<NuDotShape, Shape, NuApp> {
  static id = 'dot'
  static shortcut = ['t']
  shapeClass = NuDotShape
}
