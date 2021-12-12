import { TLBoxTool } from '@tldraw/core'
import { NuStarShape, Shape, NuApp } from 'stores'

export class NuStarTool extends TLBoxTool<NuStarShape, Shape, NuApp> {
  static id = 'star'
  static shortcut = ['s']
  shapeClass = NuStarShape
}
