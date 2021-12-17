import { TLTestApp } from '~test/TLTestApp'
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

describe('When in the idle state', () => {
  it('Sets hovered shape when entering a shape', () => {
    const app = new TLTestApp()
    app.pointerEnter([10, 10], 'box1')
    expect(app.hoveredId).toBe('box1')
  })

  it('Clears hovered shape when exiting a shape', () => {
    const app = new TLTestApp()
    app.pointerEnter([10, 10], 'box1')
    app.pointerLeave([10, 10], 'box1')
    expect(app.hoveredId).toBeUndefined()
  })

  it('Sets editing shape', () => {
    const app = new TLTestApp()
    app.pointerEnter([10, 10], 'box1')
    app.doubleClick([10, 10], 'box1')
    expect(app.editingId).toBe('box1')
  })

  it('Clears editing shape', () => {
    const app = new TLTestApp()
    app.pointerEnter([10, 10], 'box1')
    app.doubleClick([10, 10], 'box1')
    app.pointerDown([10, 10], 'box2')
    expect(app.editingId).toBeUndefined()
  })
})
