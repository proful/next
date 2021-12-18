/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TLTestApp } from '~test/TLTestApp'
import { TLTestBox } from '~test/TLTestBox'
import { TLApp } from './TLApp'

describe('TLApp', () => {
  it('creates a new app', () => {
    const app = new TLApp()
    expect(app).toBeTruthy()
  })

  it('creates a new test app', () => {
    const app = new TLTestApp()
    expect(app).toBeTruthy()
  })
})

describe('When creating a TLApp', () => {
  it.todo('Loads serialized document via constructor')
  it.todo('Registers shape classes via constructor')
  it.todo('Registers tool classes via constructor')
})

describe('When adding event subscriptions', () => {
  it.todo('Notifies onPersist subscription')
  it.todo('Notifies onSave subscription')
  it.todo('Notifies onSaveAs subscription')
})

describe('When interacting with the public API', () => {
  it.todo('Registers shape classes (provided in constructor')
  it.todo('Registers tools via tools prop')
  it.todo('Changes selected tool...')

  it('Handles events', () => {
    const app = new TLApp()
    const spy = jest.fn()
    app.subscribe('mount', spy)
    app.notify('mount', null)
    expect(spy).toHaveBeenCalled()
  })

  it.todo('Changes pages') // changePage
  it.todo('Creates shapes') // create
  it.todo('Updates shapes') // update
  it.todo('Deletes shapes') // delete
  it.todo('Deselects shapes') // deselect
  it.todo('Selects all shapes') // selectAll
  it.todo('Deselects all shapes') // deselectAll
  it.todo('Zooms in') // zoomIn
  it.todo('Zooms out') // zoomOut
  it.todo('Resets zoom') // resetZoom
  it.todo('Zooms to fit') // zoomToFit
  it.todo('Zooms to selection') // zoomToSelection
  it.todo('Toggles the grid') // toggleGrid
  it.todo('Saves (triggers onSave prop)') // save
  it.todo('Saves as (triggers onSaveAs prop)') // saveAs
})

/* ---------------------- Pages --------------------- */

describe('app.getPageById', () => {
  it.todo('Returns a page when passed an id')
})

describe('app.setCurrentPage', () => {
  it.todo('Sets the current page when passed an id')
  it.todo('Sets the current page when passed a page instance')
})

describe('app.addPages', () => {
  it.todo('adds pages when passed an array of page instances')
})

describe('app.removePages', () => {
  it.todo('removes pages when passed an array of page instances')
})

/* ---------------------- Tools --------------------- */

describe('app.selectTool', () => {
  it.todo('Selects a tool when passed a tool id')
})

/* ------------------ Shape Classes ----------------- */

describe('app.registerShapes', () => {
  it.todo('Registers a shape class when passed an array of shape classes')
})

describe('app.deregisterShapes', () => {
  it.todo('Deregisters a shape class when passed an array of shape classes')
})

describe('app.getShapeClass', () => {
  it.todo('Accesses a tool class when passed an id')
})

/* ------------------ Tool Classes ----------------- */

describe('app.registerTools', () => {
  it.todo('Registers a tool class when passed an array of tool classes')
})

describe('app.deregisterTools', () => {
  it.todo('Deregisters a tool class when passed an array of tool classes')
})

/* ------------------ Subscriptions ----------------- */

describe('app.subscribe', () => {
  it.todo('Subscribes to an event and calls the callback')
})

describe('app.unsubscribe', () => {
  it.todo('Unsubscribes to an event and no longer calls the callback')
})

describe('app.notify', () => {
  it.todo('Calls all subscribed callbacks')
})

/* --------------------- Events --------------------- */

describe('When receiving an onTransition event', () => {
  it.todo('Sets `isToolLocked` to false')
})

describe('When receiving an onWheel event', () => {
  it.todo('Updates the viewport')
})

describe('Updates the inputs when receiving events', () => {
  it.todo('Updates the inputs onTransition')
  it.todo('Updates the inputs onWheel')
  it.todo('Updates the inputs onPointerDown')
  it.todo('Updates the inputs onPointerUp')
  it.todo('Updates the inputs onPointerMove')
  it.todo('Updates the inputs onKeyDown')
  it.todo('Updates the inputs onKeyUp')
  it.todo('Updates the inputs onPinchStart')
  it.todo('Updates the inputs onPinch')
  it.todo('Updates the inputs onPinchEnd')
})

/* --------------------- Shapes --------------------- */

describe('app.getShapeById', () => {
  it.todo('Returns a shape instance when passed an id')
})

describe('app.createShapes', () => {
  it('Creates shapes when passed a serialized shape', () => {
    const app = new TLTestApp()
    app
      .createShapes([
        {
          id: 'newbox1',
          parentId: app.currentPageId,
          type: 'box',
          point: [120, 120],
        },
      ])
      .expectShapesToBeDefined(['newbox1'])
      .expectShapesToHaveProps({
        newbox1: {
          id: 'newbox1',
          point: [120, 120],
        },
      })
  })

  it('Creates shapes when passed a shape instance', () => {
    const app = new TLTestApp()
    app
      .createShapes([
        new TLTestBox({
          id: 'newbox2',
          parentId: app.currentPageId,
          type: 'box',
          point: [220, 220],
        }),
      ])
      .expectShapesToBeDefined(['newbox2'])
      .expectShapesToHaveProps({
        newbox2: {
          id: 'newbox2',
          point: [220, 220],
        },
      })
  })
})

describe('app.updateShapes', () => {
  it('Updates shapes when passed an array of new props', () => {
    const app = new TLTestApp()
    app
      .updateShapes([{ id: 'box1', point: [200, 200] }])
      .expectShapesToHaveProps({ box1: { point: [200, 200] } })
      .updateShapes([
        { id: 'box1', point: [300, 300] },
        { id: 'box2', point: [300, 300] },
      ])
      .expectShapesToHaveProps({ box1: { point: [300, 300] } })
  })
})

describe('app.deleteShapes', () => {
  it('Deletes shapes when passed an array of ids', () => {
    const app = new TLTestApp()
    app.deleteShapes(['box1', 'box2']).expectShapesToBeUndefined(['box1', 'box2'])
  })

  it('Deletes shapes when passed an array of shape instances', () => {
    const app = new TLTestApp()
    app
      .deleteShapes(app.getShapesById(['box1', 'box2']))
      .expectShapesToBeUndefined(['box1', 'box2'])
  })
})

describe('app.setSelectedShapes', () => {
  it('Sets selected shapes when passed an array of ids', () => {
    const app = new TLTestApp()
      .setSelectedShapes(['box1', 'box2'])
      .expectSelectedIdsToBe(['box1', 'box2'])
      .expectSelectedShapesToBe(['box1', 'box2'])
    expect(app.selectedShapesArray.length).toBe(2)
    expect(
      ['box1', 'box2'].every(id => app.selectedShapesArray.includes(app.getShapeById(id)))
    ).toBe(true)
  })

  it('Sets selected shapes when passed an array of shape instances', () => {
    const app = new TLTestApp()
    app
      .setSelectedShapes(app.getShapesById(['box1', 'box2']))
      .expectSelectedIdsToBe(['box1', 'box2'])
      .expectSelectedShapesToBe(['box1', 'box2'])
    expect(app.selectedShapesArray.length).toBe(2)
    expect(
      ['box1', 'box2'].every(id => app.selectedShapesArray.includes(app.getShapeById(id)))
    ).toBe(true)
  })

  it('Clears selected shapes when passed an empty array', () => {
    const app = new TLTestApp()
      .setSelectedShapes([])
      .expectSelectedIdsToBe([])
      .expectSelectedShapesToBe([])
    expect(app.selectedShapesArray.length).toBe(0)
  })
})

describe('app.setSelectionRotation', () => {
  it.todo('Sets the bounds rotation')
})

describe('app.setHoveredShape', () => {
  it('Sets hovered shape when passed a shape id', () => {
    const app = new TLTestApp().setHoveredShape('box1')
    expect(app.hoveredId).toBe('box1')
    expect(app.hoveredShape).toBe(app.getShapeById('box1'))
  })

  it('Sets hovered shape when passed a shape instance', () => {
    const app = new TLTestApp()
    app.setHoveredShape(app.getShapeById('box1'))
    expect(app.hoveredId).toBe('box1')
    expect(app.hoveredShape).toBe(app.getShapeById('box1'))
  })

  it('Clears hovered shape when passed undefined', () => {
    const app = new TLTestApp().setHoveredShape('box1').setHoveredShape(undefined)
    expect(app.hoveredId).toBeUndefined()
    expect(app.hoveredShape).toBeUndefined()
  })
})

describe('app.setEditingShape', () => {
  it('Sets editing shape when passed a shape id', () => {
    const app = new TLTestApp().setEditingShape('box3')
    expect(app.editingId).toBe('box3')
    expect(app.editingShape).toBe(app.getShapeById('box3'))
  })

  it('Sets editing shape when passed a shape instance', () => {
    const app = new TLTestApp()
    app.setEditingShape(app.getShapeById('box3'))
    expect(app.editingId).toBe('box3')
    expect(app.editingShape).toBe(app.getShapeById('box3'))
  })

  it('Clears editing shape when passed undefined', () => {
    const app = new TLTestApp().setEditingShape('box3').setEditingShape(undefined)
    expect(app.editingId).toBeUndefined()
    expect(app.editingShape).toBeUndefined()
  })
})

/* --------------------- Display -------------------- */

describe('app.selectionBounds', () => {
  it.todo('Updates selected bounds when selected shapes change')
  it.todo('Clears selected bounds when selected shapes is empty')
})

describe('app.shapesInViewport', () => {
  it.todo('Updates shapes in viewport when shapes change')
  it.todo('Updates shapes in viewport when viewport bounds change')
})

describe('app.showSelection', () => {
  it('Shows bounds only if the select tool is active and there are selected shapes', () => {
    const app = new TLTestApp()
    app.setSelectedShapes(['box1'])
    expect(app.showSelection).toBe(true)
  })
  it.todo('Hides bounds if the only selected shape has hideBounds=true')
  it.todo('Shows when more than one shape is selected, even if some/all have hideBounds=true')
})

describe('app.showSelectionDetail', () => {
  it.todo('Shows bounds only if the select tool is active and there are selected shapes')
  it.todo('Hides bounds if all selected shapes have hideBounds=true')
  it.todo('Shows when more than one shape is selected, even if some/all have hideBounds=true')
})

describe('app.showSelectionRotation', () => {
  it.todo('Shows bounds only if showing selection detail')
  it.todo('Shows bounds only if select tool is in rotating or pointingRotateHandle state')
})

describe('app.showContextBar', () => {
  it.todo(
    'Shows context bar if there are selected shapes and the tool state is select/idle or select/hoveringResizeHandle'
  )
  it.todo('Hides context bar if all selected shapes have hideContextBar=true')
})

describe('app.showResizeHandles', () => {
  it('Hides resize handles when there are no shapes selected', () => {
    const app = new TLTestApp()
    app.setSelectedShapes([])
    expect(app.showResizeHandles).toBe(false)
  })

  it('Shows resize handles if any of the selected shapes has hideResizeHandles=false', () => {
    const app = new TLTestApp()
    app.setSelectedShapes(['box1'])
    expect(app.showResizeHandles).toBe(true)

    class TLNoHandlesBoxShape extends TLTestBox {
      static id = 'noresizehandlesbox'
      hideResizeHandles = true
    }
    app.registerShapes([TLNoHandlesBoxShape])
    app.createShapes([
      {
        id: 'noresizehandlesbox1',
        type: 'noresizehandlesbox',
        point: [0, 0],
        parentId: app.currentPageId,
      },
    ])
    app.setSelectedShapes(['box1', 'noresizehandlesbox1'])
    expect(app.showResizeHandles).toBe(true)
  })

  it('Hides resize handles if there is a selected shape with hideResizeHandles=true', () => {
    const app = new TLTestApp()
    class TLNoHandlesBoxShape extends TLTestBox {
      static id = 'noresizehandlesbox'
      hideResizeHandles = true
    }
    app.registerShapes([TLNoHandlesBoxShape])
    app.createShapes([
      {
        id: 'noresizehandlesbox1',
        type: 'noresizehandlesbox',
        point: [0, 0],
        parentId: app.currentPageId,
      },
    ])
    app.setSelectedShapes(['noresizehandlesbox1'])
    expect(app.showRotateHandle).toBe(false)
  })
})

describe('app.showRotateHandle', () => {
  it('Hides rotate handle when there are no shapes selected', () => {
    const app = new TLTestApp()
    app.setSelectedShapes([])
    expect(app.showRotateHandle).toBe(false)
  })

  it('Shows rotate handle if any of the selected shapes has hideRotateHandle=false', () => {
    const app = new TLTestApp()
    app.setSelectedShapes(['box1'])
    expect(app.showRotateHandle).toBe(true)

    class TLNoRotateHandleBoxShape extends TLTestBox {
      static id = 'norotatehandlesbox'
      hideRotateHandle = true
    }
    app.registerShapes([TLNoRotateHandleBoxShape])
    app.createShapes([
      {
        id: 'norotatehandlesbox1',
        type: 'norotatehandlesbox',
        point: [0, 0],
        parentId: app.currentPageId,
      },
    ])
    app.setSelectedShapes(['box1', 'norotatehandlesbox1'])
    expect(app.showRotateHandle).toBe(true)
  })

  it('Hides rotate handle if there is a selected shape with hideRotateHandles=true', () => {
    const app = new TLTestApp()
    class TLNoRotateHandleBoxShape extends TLTestBox {
      static id = 'norotatehandlesbox'
      hideRotateHandle = true
    }
    app.registerShapes([TLNoRotateHandleBoxShape])
    app.createShapes([
      {
        id: 'norotatehandlesbox1',
        type: 'norotatehandlesbox',
        point: [0, 0],
        parentId: app.currentPageId,
      },
    ])
    app.setSelectedShapes(['norotatehandlesbox1'])
    expect(app.showRotateHandle).toBe(false)
  })
})

/* ---------------------- Brush --------------------- */

describe('app.setBrush', () => {
  it.todo('Sets brush when passed a bounding box')
  it.todo('Clears brush when passed undefined')
})
