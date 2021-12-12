import { Vec } from '@tldraw/vec'
import { PolygonUtils } from '~utils'
import { makeObservable } from 'mobx'
import type { TLShapeProps, TLStarShapeProps } from '~types'
import { TLPolygonShape } from '~lib'

/**
 * A star shape works just like a polygon shape, except it uses a different algorithm to find the
 * location of its vertices.
 */
export class TLStarShape<P extends TLStarShapeProps = any> extends TLPolygonShape<P> {
  constructor(props = {} as TLShapeProps & Partial<P>) {
    super(props)
    props.sides = props.sides ?? 5 // mobx inheritance issue
    this.init(props)
    makeObservable(this)
  }

  id = 'star'

  getVertices(padding = 0): number[][] {
    const { ratio, sides, size, isFlippedY } = this
    const [w, h] = size
    const vertices = PolygonUtils.getStarVertices(
      Vec.div([w, h], 2),
      [Math.max(1, w - padding), Math.max(1, h - padding)],
      Math.round(sides),
      ratio
    )
    if (isFlippedY) {
      return vertices.map((point) => [point[0], h - point[1]])
    }
    return vertices
  }
}
