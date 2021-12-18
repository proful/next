import { TLShape } from '~lib'

export class TLTestBox extends TLShape {
  static id = 'box'
  getBounds = () => ({
    minX: this.point[0],
    minY: this.point[1],
    maxX: this.point[0] + 100,
    maxY: this.point[1] + 100,
    width: 100,
    height: 100,
  })
}
