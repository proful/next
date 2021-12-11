import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { App } from './App'
import { TLApp, TLBoxShape } from '~nu-lib'

describe('app', () => {
  test('mounts component without crashing', () => {
    render(
      <App
        onMount={jest.fn()}
        onPersist={jest.fn()}
        model={mockDocument}
        shapeClasses={[TLBoxShape]}
      ></App>
    )
  })

  test('check the default attributes with only box shape', () => {
    render(
      <App
        onMount={jest.fn()}
        onPersist={jest.fn()}
        model={mockDocument}
        shapeClasses={[TLBoxShape]}
      ></App>
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const app = tln as TLApp

    // App State
    expect(app.serialized).toMatchSnapshot()

    expect(app.showBounds).toBe(true)
    expect(app.showBoundsDetail).toBe(true)
    expect(app.showBoundsRotation).toBe(false)
    expect(app.showContextBar).toBe(true)
    expect(app.showRotateHandle).toBe(true)
    expect(app.showResizeHandles).toBe(true)

    // Settings
    expect(app.isToolLocked).toBe(false)

    // Selected Shapes
    expect(app.selectedIds.length).toBe(1)
    expect(app.selectedIds[0]).toBe('box1')
  })
})

const mockDocument = {
  currentPageId: 'page1',
  selectedIds: ['box1'],
  pages: [
    {
      name: 'Page',
      id: 'page1',
      shapes: [
        {
          id: 'box1',
          type: 'box',
          parentId: 'page1',
          point: [100, 400],
          size: [100, 100],
        },
      ],
      bindings: [],
    },
  ],
}
