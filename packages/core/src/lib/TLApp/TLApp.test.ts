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
          parentId: 'page1',
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
          parentId: 'page1',
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

/* ---------------------- Brush --------------------- */

describe('app.setBrush', () => {
  it.todo('Sets brush when passed a bounding box')
  it.todo('Clears brush when passed undefined')
})

/* ---------------------- Tools --------------------- */

describe('app.selectTool', () => {
  it.todo('Selects a tool when passed a tool id')
})
