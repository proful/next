import { TLShape } from '~lib'

export class TLTestBox extends TLShape {
  static id = 'box'
  getBounds = () => ({
    minX: 0,
    minY: 0,
    maxX: 100,
    maxY: 100,
    width: 100,
    height: 100,
  })
}
