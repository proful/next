import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { EdgeHandle, CornerHandle, RotateHandle } from './handles'
import { SVGContainer } from '../../SVGContainer'
import type { TLReactShape } from '~lib'
import type { TLBoundsComponentProps } from '~types/component-props'
import { TLBoundsCorner, TLBoundsEdge } from '@tldraw/core'

export const BoundsForeground = observer(function BoundsForeground<S extends TLReactShape>({
  bounds,
  zoom,
  showResizeHandles,
  showRotateHandle,
}: TLBoundsComponentProps<S>) {
  const { width, height } = bounds

  const size = 8 / zoom
  const targetSize = 6 / zoom

  return (
    <SVGContainer>
      <rect
        className="tl-bounds-fg"
        width={Math.max(width, 1)}
        height={Math.max(height, 1)}
        pointerEvents="none"
      />
      <EdgeHandle
        x={targetSize * 2}
        y={0}
        width={width - targetSize * 4}
        height={0}
        targetSize={targetSize}
        edge={TLBoundsEdge.Top}
        isHidden={!showResizeHandles}
      />
      <EdgeHandle
        x={width}
        y={targetSize * 2}
        width={0}
        height={height - targetSize * 4}
        targetSize={targetSize}
        edge={TLBoundsEdge.Right}
        isHidden={!showResizeHandles}
      />
      <EdgeHandle
        x={targetSize * 2}
        y={height}
        width={width - targetSize * 4}
        height={0}
        targetSize={targetSize}
        edge={TLBoundsEdge.Bottom}
        isHidden={!showResizeHandles}
      />
      <EdgeHandle
        x={0}
        y={targetSize * 2}
        width={0}
        height={height - targetSize * 4}
        targetSize={targetSize}
        edge={TLBoundsEdge.Left}
        isHidden={!showResizeHandles}
      />
      <CornerHandle
        cx={0}
        cy={0}
        size={size}
        targetSize={targetSize}
        corner={TLBoundsCorner.TopLeft}
        isHidden={!showResizeHandles}
      />
      <CornerHandle
        cx={width}
        cy={0}
        size={size}
        targetSize={targetSize}
        corner={TLBoundsCorner.TopRight}
        isHidden={!showResizeHandles}
      />
      <CornerHandle
        cx={width}
        cy={height}
        size={size}
        targetSize={targetSize}
        corner={TLBoundsCorner.BottomRight}
        isHidden={!showResizeHandles}
      />
      <CornerHandle
        cx={0}
        cy={height}
        size={size}
        targetSize={targetSize}
        corner={TLBoundsCorner.BottomLeft}
        isHidden={!showResizeHandles}
      />
      {showRotateHandle && (
        <RotateHandle cx={width / 2} cy={0 - targetSize * 2} size={size} targetSize={targetSize} />
      )}
    </SVGContainer>
  )
})
