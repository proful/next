import * as React from 'react'
import { useApp } from '~hooks'
import { renderWithApp } from '~test/renderWithApp'
import { Renderer } from './Renderer'

describe('HTMLLayer', () => {
  test('mounts component without crashing', () => {
    const Test = () => {
      const app = useApp()
      return (
        <Renderer
          viewport={app.viewport}
          inputs={app.inputs}
          callbacks={app._events}
          brush={app.brush}
          hoveredShape={app.hoveredShape}
          selectedBounds={app.selectedBounds}
          selectedShapes={app.selectedShapes}
          erasingShapes={app.erasingShapes}
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
