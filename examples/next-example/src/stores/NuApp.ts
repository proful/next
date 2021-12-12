import { TLApp, TLEraseTool } from '@tldraw/next'
import {
  NuBoxShape,
  NuDotShape,
  NuPenShape,
  NuPolygonShape,
  NuEllipseShape,
  NuHighlighterShape,
  Shape,
} from './shapes'
import {
  NuDotTool,
  NuPenTool,
  NuPolygonTool,
  NuBoxTool,
  NuEllipseTool,
  NuHighlighterTool,
  NuEraseTool,
} from './tools'

// Not used! (It could be, but we're not using it. Just here for types.)

export class NuApp extends TLApp<Shape> {
  constructor() {
    super()
    this.registerShapes(
      NuBoxShape,
      NuEllipseShape,
      NuPolygonShape,
      NuPenShape,
      NuHighlighterShape,
      NuDotShape
    )
    this.registerTools(
      NuBoxTool,
      NuEllipseTool,
      NuPolygonTool,
      NuPenTool,
      NuHighlighterTool,
      NuDotTool,
      NuEraseTool
    )
    this.selectTool('select')
  }
}
