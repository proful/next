import * as React from 'react'
import { Canvas } from './Canvas'
import { useApp } from '~hooks'
import { renderWithApp } from '~test/renderWithApp'

describe('Canvas', () => {
  test('mounts component without crashing', () => {
    const Test = () => {
      const app = useApp()
      return (
        <Canvas
          brush={app.brush}
          hoveredShape={app.hoveredShape}
          selectedBounds={app.selectedBounds}
          selectedShapes={app.selectedShapesArray}
          erasingShapes={app.erasingShapesArray}
          shapes={app.shapesInViewport}
          showGrid={app.showGrid}
          showBounds={app.showBounds}
          showBoundsRotation={app.showBoundsRotation}
          showResizeHandles={app.showResizeHandles}
          showRotateHandle={app.showRotateHandle}
          showBoundsDetail={app.showBoundsDetail}
          showContextBar={app.showContextBar}
        />
      )
    }

    renderWithApp(<Test />)
  })
})
