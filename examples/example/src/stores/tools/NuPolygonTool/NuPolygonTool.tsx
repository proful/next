import { TLBoxTool } from '@tldraw/core'
import { NuPolygonShape, Shape, NuApp } from 'stores'

export class NuPolygonTool extends TLBoxTool<NuPolygonShape, Shape, NuApp> {
  static id = 'polygon'
  static shortcut = ['g']
  shapeClass = NuPolygonShape
}
