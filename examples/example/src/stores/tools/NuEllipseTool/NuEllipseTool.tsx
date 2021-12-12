import { TLBoxTool } from '@tldraw/core'
import { NuEllipseShape, Shape, NuApp } from 'stores'

export class NuEllipseTool extends TLBoxTool<NuEllipseShape, Shape, NuApp> {
  static id = 'ellipse'
  static shortcut = ['o']
  shapeClass = NuEllipseShape
}
