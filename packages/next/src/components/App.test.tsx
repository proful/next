import * as React from 'react'
import { render } from '@testing-library/react'
import { observer } from 'mobx-react-lite'
import { makeObservable, observable } from 'mobx'
import { App } from './App'
import { TLApp, TLBoxShape, TLBoxShapeProps, TLComponentProps, TLShapeProps } from '~nu-lib'
import { SVGContainer } from '~components'

describe('app', () => {
  test('mounts component without crashing', () => {
    render(
      <App
        onMount={jest.fn()}
        onPersist={jest.fn()}
        model={mockDocument}
        shapeClasses={[NuBoxShape]}
      ></App>
    )
  })
})

export class NuApp extends TLApp<Shape> {
  constructor() {
    super()
    this.registerShapes(NuBoxShape)
    this.selectTool('select')
  }
}

type Shape = NuBoxShape

export type NuBoxShapeProps = TLBoxShapeProps

export class NuBoxShape extends TLBoxShape<NuBoxShapeProps> {
  constructor(props = {} as TLShapeProps & Partial<NuBoxShapeProps>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'box'

  @observable stroke = '#000000'
  @observable fill = '#ffffff22'
  @observable strokeWidth = 2

  Component = observer(({ events, isSelected }: TLComponentProps) => {
    const {
      size: [w, h],
      stroke,
      fill,
      strokeWidth,
    } = this

    return (
      <SVGContainer {...events}>
        <rect
          className={isSelected ? 'nu-hitarea-fill' : 'nu-hitarea-stroke'}
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={Math.max(0.01, w - strokeWidth)}
          height={Math.max(0.01, h - strokeWidth)}
          pointerEvents="all"
        />
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={Math.max(0.01, w - strokeWidth)}
          height={Math.max(0.01, h - strokeWidth)}
          strokeWidth={strokeWidth}
          stroke={stroke}
          fill={fill}
        />
      </SVGContainer>
    )
  })
}

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
