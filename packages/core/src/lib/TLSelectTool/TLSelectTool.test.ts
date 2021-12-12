import { TLApp } from '../TLApp'
import { TLSelectTool } from './TLSelectTool'

describe('A minimal test', () => {
  it('Creates the shape', () => {
    class SelectTool extends TLSelectTool {
      static id = 'erase'
      static shortcut = ['e']
    }
    const app = new TLApp()
    const shape = new SelectTool(app, app)
    expect(shape).toBeDefined()
  })
})
