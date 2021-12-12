import { TLDrawTool } from '@tldraw/core'
import { NuHighlighterShape, Shape, NuApp } from 'unused-app'

export class NuHighlighterTool extends TLDrawTool<NuHighlighterShape, Shape, NuApp> {
  static id = 'highlighter'
  static shortcut = ['h']
  shapeClass = NuHighlighterShape
  simplify = true
  simplifyTolerance = 0.618
}
