import { TLLineShape } from '@tldraw/line-shape'
import { TLApp } from '@tldraw/core'
import { TLLineTool } from './TLLineTool'

describe('A minimal test', () => {
  it('Creates the shape', () => {
    class LineTool extends TLLineTool<TLLineShape> {
      static id = 'line'
      static shortcut = ['l']
      Shape = TLLineShape
    }
    const app = new TLApp()
    const shape = new LineTool(app, app)
    expect(shape).toBeDefined()
  })
})
