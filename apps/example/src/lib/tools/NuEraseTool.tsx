import { TLEraseTool } from '@tldraw/erase-tool'
import type { TLReactEventMap } from '@tldraw/react'
import type { Shape } from '~lib'

export class NuEraseTool extends TLEraseTool<Shape, TLReactEventMap> {
  static id = 'erase'
  static shortcut = ['e']
}
