import { TLDotTool } from '@tldraw/core'
import { Shape, NuDotShape } from '~lib/shapes'

export class NuDotTool extends TLDotTool<NuDotShape, Shape> {
  static id = 'dot'
  static shortcut = ['t']
  shapeClass = NuDotShape
}
