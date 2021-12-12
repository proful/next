/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import {
  App as NextApp,
  TLApp,
  TLComponents,
  TLSerializedApp,
  TLSubscriptionCallbacks,
} from '@tldraw/next'
import {
  NuBoxShape,
  NuEllipseShape,
  NuBoxTool,
  NuEllipseTool,
  NuPolygonTool,
  NuPolygonShape,
  NuPenShape,
  NuPenTool,
  NuHighlighterShape,
  NuHighlighterTool,
  NuDotShape,
  NuDotTool,
  NuEraseTool,
  NuStarTool,
  NuStarShape,
  Shape,
  NuApp,
} from 'stores'
import { AppUI } from 'components/AppUI'
import { NuContextBar } from 'components/NuContextBar/NuContextBar'

const components: TLComponents<Shape> = {
  ContextBar: NuContextBar,
}

function App(): JSX.Element {
  const [app, setApp] = React.useState<TLApp<Shape>>()

  const [shapeClasses] = React.useState(() => [
    NuBoxShape,
    NuEllipseShape,
    NuPolygonShape,
    NuPenShape,
    NuHighlighterShape,
    NuDotShape,
    NuStarShape,
  ])

  const [toolClasses] = React.useState(() => [
    NuBoxTool,
    NuEllipseTool,
    NuPolygonTool,
    NuPenTool,
    NuHighlighterTool,
    NuDotTool,
    NuStarTool,
    NuEraseTool,
  ])

  const [model] = React.useState<TLSerializedApp>({
    currentPageId: 'page1',
    selectedIds: ['dot1'],
    pages: [
      {
        name: 'Page',
        id: 'page1',
        shapes: [
          // {
          //   id: 'dot1',
          //   type: 'dot',
          //   parentId: 'page1',
          //   point: [500, 300],
          //   radius: 3,
          // },
          {
            id: 'box1',
            type: 'box',
            parentId: 'page1',
            point: [100, 400],
            size: [100, 100],
          },
          // {
          //   id: 'ellipse1',
          //   type: 'ellipse',
          //   parentId: 'page1',
          //   point: [100, 100],
          //   size: [100, 200],
          //   rotation: Math.PI / 6,
          // },
          {
            id: 'polygon2',
            type: 'polygon',
            parentId: 'page1',
            point: [100, 300],
            size: [150, 150],
            sides: 5,
            ratio: 1,
          },
          // {
          //   id: 'polygon3',
          //   type: 'polygon',
          //   parentId: 'page1',
          //   point: [300, 300],
          //   size: [150, 150],
          //   sides: 5,
          //   ratio: 0.5,
          // },
          // {
          //   id: 'polygon4',
          //   type: 'polygon',
          //   parentId: 'page1',
          //   point: [500, 300],
          //   size: [150, 150],
          //   sides: 5,
          //   ratio: 1,
          // },
          {
            id: 'star1',
            type: 'star',
            parentId: 'page1',
            point: [100, 500],
            size: [150, 150],
            points: 5,
            ratio: 1,
          },
          // {
          //   id: 'star2',
          //   type: 'star',
          //   parentId: 'page1',
          //   point: [300, 500],
          //   size: [150, 150],
          //   points: 5,
          //   ratio: 0.5,
          // },
          // {
          //   id: 'star3',
          //   type: 'star',
          //   parentId: 'page1',
          //   point: [500, 500],
          //   size: [150, 150],
          //   points: 5,
          //   ratio: 1,
          // },
        ],
        bindings: [],
      },
    ],
  })

  const onMount = React.useCallback<TLSubscriptionCallbacks<Shape, NuApp>['onMount']>((app) => {
    setApp(app)
    // app.selectAll()
  }, [])

  const onPersist = React.useCallback<TLSubscriptionCallbacks<Shape, NuApp>['onPersist']>(() => {
    // todo
  }, [])

  return (
    <div className="tl-app">
      <NextApp
        onMount={onMount}
        onPersist={onPersist}
        model={model}
        shapeClasses={shapeClasses}
        toolClasses={toolClasses}
        components={components}
      >
        <AppUI />
      </NextApp>
    </div>
  )
}

export default App
