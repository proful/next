import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useRendererContext } from '~hooks'
import { BoundsUtils } from '@tldraw/core'
import type { TLBounds } from '@tldraw/core'
import { useCounterScaledPosition } from '~hooks'
import type { TLReactShape } from '~lib'

export interface TLBoundsDetailContainerProps<S extends TLReactShape> {
  hidden: boolean
  bounds: TLBounds
  shapes: S[]
  detail?: 'size' | 'rotation'
  rotation?: number
}

export const BoundsDetailContainer = observer(function BoundsDetail<S extends TLReactShape>({
  bounds,
  hidden,
  shapes,
  rotation = 0,
  detail = 'size',
}: TLBoundsDetailContainerProps<S>) {
  const {
    components: { BoundsDetail },
    viewport: {
      camera: { zoom },
    },
  } = useRendererContext()

  const rBounds = React.useRef<HTMLDivElement>(null)
  const scaledBounds = BoundsUtils.multiplyBounds(bounds, zoom)
  useCounterScaledPosition(rBounds, scaledBounds, zoom, 10003)

  if (!BoundsDetail) throw Error('Expected a BoundsDetail component.')

  return (
    <div
      ref={rBounds}
      className={`tl-counter-scaled-positioned ${hidden ? `tl-fade-out` : ''}`}
      aria-label="bounds-detail-container"
    >
      <BoundsDetail
        shapes={shapes}
        bounds={bounds}
        scaledBounds={scaledBounds}
        zoom={zoom}
        rotation={rotation}
        detail={detail}
      />
    </div>
  )
})
