import { TLEraseTool } from '@tldraw/core'
import type { Shape, NuApp } from 'unused-app'

export class NuEraseTool extends TLEraseTool<Shape, NuApp> {
  static id = 'erase'
  static shortcut = ['e']
}
