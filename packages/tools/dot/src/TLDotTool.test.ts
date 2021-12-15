import { TLDotShape } from '@tldraw/dot-shape'
import { TLApp } from '@tldraw/core'
import { TLDotTool } from './TLDotTool'

describe('A minimal test', () => {
  it('Creates the shape', () => {
    class DotTool extends TLDotTool<TLDotShape> {
      static id = 'dot'
      static shortcut = ['r']
      Shape = TLDotShape
    }
    const app = new TLApp()
    const shape = new DotTool(app, app)
    expect(shape).toBeDefined()
  })
})
