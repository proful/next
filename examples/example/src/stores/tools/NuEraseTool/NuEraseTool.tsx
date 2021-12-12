import { TLEraseTool } from '@tldraw/core'
import type { Shape, NuApp } from 'stores'

export class NuEraseTool extends TLEraseTool<Shape, NuApp> {
  static id = 'erase'
  static shortcut = ['e']
}
