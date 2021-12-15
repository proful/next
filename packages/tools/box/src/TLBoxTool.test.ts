import { TLBoxShape } from '@tldraw/box-shape'
import { TLApp } from '@tldraw/core'
import { TLBoxTool } from './TLBoxTool'

describe('A minimal test', () => {
  it('Creates the shape', () => {
    class BoxTool extends TLBoxTool<TLBoxShape> {
      static id = 'box'
      static shortcut = ['r']
      Shape = TLBoxShape
    }
    const app = new TLApp()
    const shape = new BoxTool(app, app)
    expect(shape).toBeDefined()
  })
})
