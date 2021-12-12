import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { HTMLContainer } from '~components'
import { TAU } from '~constants'
import { GeomUtils } from '~utils'
import type { TLBoundsDetailProps } from '~types'
import type { TLShape } from '~lib'

export const BoundsDetail = observer(function BoundsDetail<S extends TLShape>({
  bounds,
  detail,
  scaledBounds,
}: TLBoundsDetailProps<S>) {
  const { rotation = 0 } = bounds
  const isFlipped = Math.abs(rotation) > TAU

  return (
    <HTMLContainer centered>
      <div
        className="tl-bounds-detail"
        style={{
          transform: isFlipped
            ? `rotate(${Math.PI + rotation}rad) translateY(${scaledBounds.height / 2 + 32}px)`
            : ` rotate(${rotation}rad) translateY(${scaledBounds.height / 2 + 24}px)`,
          padding: '2px 3px',
          borderRadius: '1px',
        }}
      >
        {detail === 'size'
          ? `${bounds.width.toFixed()} × ${bounds.height.toFixed()}`
          : `∠${GeomUtils.radiansToDegrees(GeomUtils.clampRadians(rotation)).toFixed()}°`}
      </div>
    </HTMLContainer>
  )
})
