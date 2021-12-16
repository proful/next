import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { HTMLContainer } from '~components'
import { TAU } from '~constants'
import { GeomUtils, TLShapeWithHandles } from '@tldraw/core'
import type { TLReactShape } from '~lib'
import type { TLBoundsDetailProps } from '~types/component-props'
import Vec from '@tldraw/vec'

export const BoundsDetail = observer(function BoundsDetail<S extends TLReactShape>({
  bounds,
  shapes,
  scaledBounds,
  detail = 'size',
  rotation = 0,
}: TLBoundsDetailProps<S>) {
  // This is the actual rotation of the bounding box, used to position the detail. Note that when rotating only one shape, the bounds rotation and the rotation shown in the detail will be the same; however, when rotating more than one shape, the bounding box will be axis-aligned, but the detail will show the angle that the bounds has been rotated by.
  const boundsRotation = shapes.length === 1 ? rotation : bounds.rotation ?? 0
  const isFlipped = Math.abs(boundsRotation) > TAU
  const isLine = shapes.length === 1 && shapes[0].type === 'line'

  return (
    <HTMLContainer centered>
      <div
        className="tl-bounds-detail"
        style={{
          transform: isFlipped
            ? `rotate(${Math.PI + boundsRotation}rad) translateY(${scaledBounds.height / 2 + 32}px)`
            : ` rotate(${boundsRotation}rad) translateY(${scaledBounds.height / 2 + 24}px)`,
          padding: '2px 3px',
          borderRadius: '1px',
        }}
      >
        {isLine
          ? `${Vec.dist(
              (shapes[0] as unknown as TLShapeWithHandles).handles[0].point,
              (shapes[0] as unknown as TLShapeWithHandles).handles[1].point
            ).toFixed()}`
          : detail === 'size'
          ? `${bounds.width.toFixed()} × ${bounds.height.toFixed()}`
          : `∠${GeomUtils.radiansToDegrees(GeomUtils.clampRadians(rotation)).toFixed()}°`}
      </div>
    </HTMLContainer>
  )
})
