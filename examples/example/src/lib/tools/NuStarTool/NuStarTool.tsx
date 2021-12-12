import { TLBoxTool } from '@tldraw/core'
import { NuStarShape, Shape } from '~lib/shapes'

export class NuStarTool extends TLBoxTool<NuStarShape, Shape> {
  static id = 'star'
  static shortcut = ['s']
  shapeClass = NuStarShape
}
