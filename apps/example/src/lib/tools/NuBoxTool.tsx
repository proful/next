import { TLBoxTool } from '@tldraw/box-tool'
import type { TLReactEventMap } from '@tldraw/react'
import { Shape, NuBoxShape } from '~lib'

export class NuBoxTool extends TLBoxTool<NuBoxShape, Shape, TLReactEventMap> {
  static id = 'box'
  static shortcut = ['r']
  Shape = NuBoxShape
}
