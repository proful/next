import { Vec } from '@tldraw/vec'
import { PolygonUtils } from '~utils'
import { TLPolygonShape, TLPolygonShapeProps } from '../TLPolygonShape'

export interface TLStarShapeProps extends TLPolygonShapeProps {
  points: number
  ratio: number
  isFlippedY: boolean
}

/**
 * A star shape works just like a polygon shape, except it uses a different algorithm to find the
 * location of its vertices.
 */
export class TLStarShape<P extends TLStarShapeProps = any> extends TLPolygonShape<P> {
  id = 'star'

  getVertices(padding = 0): number[][] {
    const { ratio, points, size, isFlippedY } = this
    const [w, h] = size
    const vertices = PolygonUtils.getStarVertices(
      Vec.div([w, h], 2),
      [Math.max(1, w - padding), Math.max(1, h - padding)],
      Math.round(points),
      ratio
    )
    if (isFlippedY) {
      return vertices.map((point) => [point[0], h - point[1]])
    }
    return vertices
  }
}
