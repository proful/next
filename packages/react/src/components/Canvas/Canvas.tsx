/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import {
  Shape,
  Indicator,
  HTMLLayer,
  Container,
  BoundsDetailContainer,
  ContextBarContainer,
  SVGContainer,
} from '~components'
import {
  useCanvasEvents,
  useGestureEvents,
  useResizeObserver,
  useStylesheet,
  useRendererContext,
  usePreventNavigation,
  useCursor,
  useZoom,
} from '~hooks'
import { TLBinding, TLBounds, TLCursor, TLHandle, TLTheme } from '@tldraw/core'
import { EMPTY_OBJECT } from '~constants'
import type { TLReactShape } from '~lib'

export interface TLCanvasProps<S extends TLReactShape> {
  id?: string
  bindings?: TLBinding[]
  brush?: TLBounds
  shapes?: S[]
  theme?: TLTheme
  hoveredShape?: S
  editingShape?: S
  bindingShape?: S
  selectedBounds?: TLBounds
  selectedShapes?: S[]
  erasingShapes?: S[]
  gridSize?: number
  cursor?: TLCursor
  cursorRotation?: number
  boundsRotation?: number
  showGrid?: boolean
  showBounds?: boolean
  showHandles?: boolean
  showResizeHandles?: boolean
  showRotateHandle?: boolean
  showContextBar?: boolean
  showBoundsDetail?: boolean
  showBoundsRotation?: boolean
  children?: React.ReactNode
}

export const Canvas = observer(function Renderer<S extends TLReactShape>({
  id,
  brush,
  shapes,
  bindingShape,
  editingShape,
  hoveredShape,
  selectedBounds,
  selectedShapes,
  erasingShapes,
  cursor = TLCursor.Default,
  cursorRotation = 0,
  boundsRotation = 0,
  showBounds = true,
  showHandles = true,
  showBoundsRotation = false,
  showResizeHandles = true,
  showRotateHandle = true,
  showBoundsDetail = true,
  showContextBar = true,
  showGrid = true,
  gridSize = 8,
  theme = EMPTY_OBJECT,
  children,
}: Partial<TLCanvasProps<S>>): JSX.Element {
  const rContainer = React.useRef<HTMLDivElement>(null)
  const { viewport, components, meta } = useRendererContext()
  const { zoom } = viewport.camera

  useStylesheet(theme, id)
  usePreventNavigation(rContainer)
  useResizeObserver(rContainer, viewport)
  useGestureEvents(rContainer)
  useCursor(rContainer, cursor, cursorRotation)
  useZoom(rContainer)

  const events = useCanvasEvents()

  const onlySelectedShape = selectedShapes?.length === 1 && selectedShapes[0]

  const onlySelectedShapeWithHandles =
    onlySelectedShape && 'handles' in onlySelectedShape
      ? (selectedShapes[0] as S & { handles: TLHandle[] })
      : undefined

  return (
    <div ref={rContainer} className="tl-container">
      <div tabIndex={-1} className="tl-absolute tl-canvas" {...events}>
        {showGrid && components.Grid && <components.Grid size={gridSize} />}
        <HTMLLayer>
          {components.BoundsBackground && selectedShapes && selectedBounds && showBounds && (
            <Container bounds={selectedBounds} zIndex={2}>
              <components.BoundsBackground
                zoom={zoom}
                shapes={selectedShapes}
                bounds={selectedBounds}
                showResizeHandles={showResizeHandles}
                showRotateHandle={showRotateHandle}
              />
            </Container>
          )}
          {shapes &&
            shapes.map((shape, i) => (
              <Shape
                key={'shape_' + shape.id}
                shape={shape}
                isEditing={shape === editingShape}
                isHovered={shape === hoveredShape}
                isBinding={shape === bindingShape}
                isSelected={selectedShapes?.includes(shape)}
                isErasing={erasingShapes?.includes(shape)}
                meta={meta}
                zIndex={1000 + i}
              />
            ))}
          {selectedShapes?.map(shape => (
            <Indicator
              key={'selected_indicator_' + shape.id}
              shape={shape}
              isEditing={shape === editingShape}
              isHovered={false}
              isBinding={false}
              isSelected={true}
            />
          ))}
          {hoveredShape && (
            <Indicator key={'hovered_indicator_' + hoveredShape.id} shape={hoveredShape} />
          )}
          {brush && components.Brush && <components.Brush bounds={brush} />}
          {selectedShapes && selectedBounds && (
            <>
              {showBounds && components.BoundsForeground && (
                <Container bounds={selectedBounds} zIndex={10002}>
                  <components.BoundsForeground
                    zoom={zoom}
                    shapes={selectedShapes}
                    bounds={selectedBounds}
                    showResizeHandles={showResizeHandles}
                    showRotateHandle={showRotateHandle}
                  />
                </Container>
              )}
              {showHandles && onlySelectedShapeWithHandles && components.Handle && (
                <Container bounds={selectedBounds} zIndex={10003}>
                  <SVGContainer>
                    {onlySelectedShapeWithHandles.handles.map((handle, i) =>
                      React.createElement(components.Handle!, {
                        key: `${handle.id}_handle_${i}`,
                        shape: onlySelectedShapeWithHandles,
                        handle,
                        index: i,
                      })
                    )}
                  </SVGContainer>
                </Container>
              )}
              {selectedShapes && components.BoundsDetail && (
                <BoundsDetailContainer
                  key={'detail' + selectedShapes.map(shape => shape.id).join('')}
                  shapes={selectedShapes}
                  bounds={selectedBounds}
                  detail={showBoundsRotation ? 'rotation' : 'size'}
                  hidden={!showBoundsDetail}
                  rotation={boundsRotation}
                />
              )}
              {selectedShapes && components.ContextBar && (
                <ContextBarContainer
                  key={'context' + selectedShapes.map(shape => shape.id).join('')}
                  shapes={selectedShapes}
                  hidden={!showContextBar}
                  bounds={selectedShapes.length === 1 ? selectedShapes[0].bounds : selectedBounds}
                  rotation={selectedShapes.length === 1 ? selectedShapes[0].rotation : 0}
                />
              )}
            </>
          )}
        </HTMLLayer>
      </div>
      {children}
    </div>
  )
})
