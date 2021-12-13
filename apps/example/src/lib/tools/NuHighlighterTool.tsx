import { TLDrawTool } from '@tldraw/draw-tool'
import type { TLReactEventMap } from '@tldraw/react'
import { NuHighlighterShape, Shape } from '~lib'

export class NuHighlighterTool extends TLDrawTool<NuHighlighterShape, Shape, TLReactEventMap> {
  static id = 'highlighter'
  static shortcut = ['h']
  shapeClass = NuHighlighterShape
  simplify = true
  simplifyTolerance = 0.618
}
