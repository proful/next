import { TLPolylineShape } from './TLPolylineShape'

describe('A minimal test', () => {
  it('Creates the shape', () => {
    const shape = new TLPolylineShape()
    expect(shape).toBeDefined()
  })
})
