/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import {
  Shape,
  Indicator,
  HTMLLayer,
  Container,
  BoundsDetailContainer,
  ContextBarContainer,
} from '~components'
import {
  useCanvasEvents,
  useGestureEvents,
  useResizeObserver,
  useStylesheet,
  useRendererContext,
  usePreventNavigation,
} from '~hooks'
import type { TLShape } from '~lib'
import type { TLCanvasProps } from '~types'
import { EMPTY_OBJECT } from '~constants'

export const Canvas = observer(function Renderer<S extends TLShape>({
  id,
  brush,
  shapes,
  bindingShape,
  editingShape,
  hoveredShape,
  selectedBounds,
  selectedShapes,
  erasingShapes,
  showBounds = true,
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
  useStylesheet(theme, id)
  usePreventNavigation(rContainer)

  const { viewport, components, meta } = useRendererContext()

  useResizeObserver(rContainer, viewport)
  useGestureEvents(rContainer)

  // If we zoomed, set the CSS variable for the zoom
  React.useLayoutEffect(() => {
    return autorun(() => {
      const { zoom } = viewport.camera
      const container = rContainer.current
      if (!container) return
      container.style.setProperty('--tl-zoom', zoom.toString())
    })
  }, [])

  const events = useCanvasEvents()

  const { zoom } = viewport.camera

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
                isEditing={editingShape === shape}
                isHovered={hoveredShape === shape}
                isBinding={bindingShape === shape}
                isSelected={selectedShapes?.includes(shape)}
                isErasing={erasingShapes?.includes(shape)}
                meta={meta}
                zIndex={1000 + i}
              />
            ))}
          {selectedShapes?.map((shape) => (
            <Indicator
              key={'selected_indicator_' + shape.id}
              shape={shape}
              isEditing={false}
              isHovered={false}
              isBinding={false}
              isSelected={true}
            />
          ))}
          {hoveredShape && (
            <Indicator key={'hovered_indicator_' + hoveredShape.id} shape={hoveredShape} />
          )}
          {brush && components.Brush && <components.Brush bounds={brush} />}
          {selectedBounds && (
            <>
              {selectedShapes && showBounds && components.BoundsForeground && (
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
              {selectedShapes && components.BoundsDetail && (
                <BoundsDetailContainer
                  key={'detail' + selectedShapes.map((shape) => shape.id).join('')}
                  shapes={selectedShapes}
                  bounds={selectedBounds}
                  detail={showBoundsRotation ? 'rotation' : 'size'}
                  hidden={!showBoundsDetail}
                />
              )}
              {selectedShapes && components.ContextBar && (
                <ContextBarContainer
                  key={'context' + selectedShapes.map((shape) => shape.id).join('')}
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
