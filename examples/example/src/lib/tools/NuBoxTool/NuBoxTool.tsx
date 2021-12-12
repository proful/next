import { TLBoxTool } from '@tldraw/core'
import { Shape, NuBoxShape } from '~lib/shapes'

export class NuBoxTool extends TLBoxTool<NuBoxShape, Shape> {
  static id = 'box'
  static shortcut = ['r']
  shapeClass = NuBoxShape
}
