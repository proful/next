import { TLBoxTool } from '@tldraw/next'
import { Shape, NuApp, NuBoxShape } from 'stores'

export class NuBoxTool extends TLBoxTool<NuBoxShape, Shape, NuApp> {
  static id = 'box'
  static shortcut = ['r']
  shapeClass = NuBoxShape
}
