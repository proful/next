/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TLTestApp } from '~test/TLTestApp'
import { TLTargetType } from '~types'
import { TLApp } from './TLApp'

describe('TLApp', () => {
  it('creates a new app', () => {
    new TLApp()
  })

  it('creates a new test app', () => {
    new TLTestApp()
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

  it('Sets hovered shape', () => {
    const app = new TLTestApp()
    app.setHoveredShape('box1')
    expect(app.hoveredId).toBe('box1')
  })

  it('Sets editing shape', () => {
    const app = new TLTestApp()
    app.setEditingShape('box1')
    expect(app.editingId).toBe('box1')
  })

  it('Sets selected shapes', () => {
    const app = new TLTestApp()
    app.setSelectedShapes(['box1'])
    expect(app.selectedShapes.size).toBe(1)
    expect(app.selectedIds.size).toBe(1)
    expect(app.selectedIds.has('box1')).toBeTruthy()
    expect(app.selectedShapes.has(app.getShapeById('box1')!)).toBeTruthy()
    expect(app.selectedShapesArray.length).toBe(1)
    expect(app.selectedShapesArray[0]).toBe(app.getShapeById('box1'))
  })

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
