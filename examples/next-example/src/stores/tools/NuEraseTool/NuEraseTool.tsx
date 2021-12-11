import { TLEraseTool } from '@tldraw/next'
import type { Shape, NuApp } from 'stores'

export class NuEraseTool extends TLEraseTool<Shape, NuApp> {
  static id = 'erase'
  static shortcut = ['e']
}
