/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import {
  Shape,
  Indicator,
  HTMLLayer,
  Container,
  SelectionDetailContainer,
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
  selectionBounds?: TLBounds
  selectedShapes?: S[]
  erasingShapes?: S[]
  gridSize?: number
  cursor?: TLCursor
  cursorRotation?: number
  selectionRotation?: number
  showGrid?: boolean
  showSelection?: boolean
  showHandles?: boolean
  showResizeHandles?: boolean
  showRotateHandles?: boolean
  showContextBar?: boolean
  showSelectionDetail?: boolean
  showSelectionRotation?: boolean
  children?: React.ReactNode
}

export const Canvas = observer(function Renderer<S extends TLReactShape>({
  id,
  brush,
  shapes,
  bindingShape,
  editingShape,
  hoveredShape,
  selectionBounds,
  selectedShapes,
  erasingShapes,
  cursor = TLCursor.Default,
  cursorRotation = 0,
  selectionRotation = 0,
  showSelection = true,
  showHandles = true,
  showSelectionRotation = false,
  showResizeHandles = true,
  showRotateHandles = true,
  showSelectionDetail = true,
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

  const selectedShapesSet = React.useMemo(() => new Set(selectedShapes || []), [selectedShapes])
  const erasingShapesSet = React.useMemo(() => new Set(erasingShapes || []), [erasingShapes])

  return (
    <div ref={rContainer} className="tl-container">
      <div tabIndex={-1} className="tl-absolute tl-canvas" {...events}>
        {showGrid && components.Grid && <components.Grid size={gridSize} />}
        <HTMLLayer>
          {components.SelectionBackground && selectedShapes && selectionBounds && showSelection && (
            <Container bounds={selectionBounds} zIndex={2}>
              <components.SelectionBackground
                zoom={zoom}
                shapes={selectedShapes}
                bounds={selectionBounds}
                showResizeHandles={showResizeHandles}
                showRotateHandles={showRotateHandles}
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
                isSelected={selectedShapesSet.has(shape)}
                isErasing={erasingShapesSet.has(shape)}
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
          {selectedShapes && selectionBounds && (
            <>
              {showSelection && components.SelectionForeground && (
                <Container bounds={selectionBounds} zIndex={10002}>
                  <components.SelectionForeground
                    zoom={zoom}
                    shapes={selectedShapes}
                    bounds={selectionBounds}
                    showResizeHandles={showResizeHandles}
                    showRotateHandles={showRotateHandles}
                  />
                </Container>
              )}
              {showHandles && onlySelectedShapeWithHandles && components.Handle && (
                <Container bounds={selectionBounds} zIndex={10003}>
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
              {selectedShapes && components.SelectionDetail && (
                <SelectionDetailContainer
                  key={'detail' + selectedShapes.map(shape => shape.id).join('')}
                  shapes={selectedShapes}
                  bounds={selectionBounds}
                  detail={showSelectionRotation ? 'rotation' : 'size'}
                  hidden={!showSelectionDetail}
                  rotation={selectionRotation}
                />
              )}
              {selectedShapes && components.ContextBar && (
                <ContextBarContainer
                  key={'context' + selectedShapes.map(shape => shape.id).join('')}
                  shapes={selectedShapes}
                  hidden={!showContextBar}
                  bounds={selectedShapes.length === 1 ? selectedShapes[0].bounds : selectionBounds}
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
