import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useBoundsEvents } from '~hooks/useBoundsEvents'
import type { TLBoundsComponentProps } from '~types'
import { SVGContainer } from '~components'
import type { TLShape } from '~lib'

export const BoundsBackground = observer(function BoundsBackground<S extends TLShape>({
  bounds,
}: TLBoundsComponentProps<S>) {
  const events = useBoundsEvents('background')

  return (
    <SVGContainer>
      <rect
        className="tl-bounds-bg"
        width={Math.max(1, bounds.width)}
        height={Math.max(1, bounds.height)}
        pointerEvents="all"
        {...events}
      />
    </SVGContainer>
  )
})
