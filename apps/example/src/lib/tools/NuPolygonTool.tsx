import { TLBoxTool } from '@tldraw/box-tool'
import { NuPolygonShape, Shape, NuApp } from '~lib'

export class NuPolygonTool extends TLBoxTool<NuPolygonShape, Shape, NuApp> {
  static id = 'polygon'
  static shortcut = ['g']
  shapeClass = NuPolygonShape
}
