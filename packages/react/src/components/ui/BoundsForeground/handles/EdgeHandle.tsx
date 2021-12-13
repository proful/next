import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { TLBoundsEdge } from '@tldraw/core'
import { useBoundsEvents } from '~hooks/useBoundsEvents'

const edgeClassnames = {
  [TLBoundsEdge.Top]: 'tl-cursor-ns',
  [TLBoundsEdge.Right]: 'tl-cursor-ew',
  [TLBoundsEdge.Bottom]: 'tl-cursor-ns',
  [TLBoundsEdge.Left]: 'tl-cursor-ew',
}

interface EdgeHandleProps {
  x: number
  y: number
  width: number
  height: number
  targetSize: number
  edge: TLBoundsEdge
  isHidden?: boolean
}

export const EdgeHandle = observer<EdgeHandleProps>(function EdgeHandle({
  x,
  y,
  width,
  height,
  targetSize,
  edge,
  isHidden,
}: EdgeHandleProps): JSX.Element {
  const events = useBoundsEvents(edge)

  return (
    <rect
      pointerEvents={isHidden ? 'none' : 'all'}
      className={'tl-transparent tl-edge-handle ' + (isHidden ? '' : edgeClassnames[edge])}
      aria-label={`${edge} target`}
      opacity={isHidden ? 0 : 1}
      x={x - targetSize}
      y={y - targetSize}
      width={Math.max(1, width + targetSize * 2)}
      height={Math.max(1, height + targetSize * 2)}
      {...events}
    />
  )
})
