import { TLBoxTool } from '@tldraw/box-tool'
import { NuStarShape, Shape } from '~lib'

export class NuStarTool extends TLBoxTool<NuStarShape, Shape> {
  static id = 'star'
  static shortcut = ['s']
  shapeClass = NuStarShape
}
