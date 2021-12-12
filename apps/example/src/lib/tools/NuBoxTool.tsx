import { TLBoxTool } from '@tldraw/box-tool'
import { Shape, NuBoxShape, NuApp } from '~lib'

export class NuBoxTool extends TLBoxTool<NuBoxShape, Shape, NuApp> {
  static id = 'box'
  static shortcut = ['r']
  shapeClass = NuBoxShape
}
