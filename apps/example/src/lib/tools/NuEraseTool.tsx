import { TLEraseTool } from '@tldraw/erase-tool'
import type { Shape, NuApp } from '~lib'

export class NuEraseTool extends TLEraseTool<Shape, NuApp> {
  static id = 'erase'
  static shortcut = ['e']
}
