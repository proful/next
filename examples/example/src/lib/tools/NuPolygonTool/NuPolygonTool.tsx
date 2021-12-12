import { TLBoxTool } from '@tldraw/core'
import { NuPolygonShape, Shape, NuApp } from 'unused-app'

export class NuPolygonTool extends TLBoxTool<NuPolygonShape, Shape, NuApp> {
  static id = 'polygon'
  static shortcut = ['g']
  shapeClass = NuPolygonShape
}
