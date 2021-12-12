import { TLApp } from './TLApp'

describe('TLApp', () => {
  it('creates a new app', () => {
    new TLApp()
  })

  it.todo('Mounts (triggers onMount prop)') // create
  it.todo('Persists (triggers onPersist prop)') // create
  it.todo('Registers shape classes via shapeClasses prop')
  it.todo('Registers tools via tools prop')
  it.todo('Changes selected tool...')
  it.todo('Handles events...')
  it.todo('Changes pages') // changePage
  it.todo('Sets hovered shape') // hover
  it.todo('Creates shapes') // create
  it.todo('Updates shapes') // update
  it.todo('Deletes shapes') // delete
  it.todo('Selects shapes') // select
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
