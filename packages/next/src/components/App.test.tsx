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

  test('check the attributes', () => {
    render(
      <App
        onMount={jest.fn()}
        onPersist={jest.fn()}
        model={mockDocument}
        shapeClasses={[TLBoxShape]}
      ></App>
    )
    screen.logTestingPlaygroundURL()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const app = tln as TLApp
    console.log(app.currentPageId)
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
