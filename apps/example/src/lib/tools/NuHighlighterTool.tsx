import { TLDrawTool } from '@tldraw/draw-tool'
import { NuHighlighterShape, Shape, NuApp } from '~lib'

export class NuHighlighterTool extends TLDrawTool<NuHighlighterShape, Shape, NuApp> {
  static id = 'highlighter'
  static shortcut = ['h']
  shapeClass = NuHighlighterShape
  simplify = true
  simplifyTolerance = 0.618
}
