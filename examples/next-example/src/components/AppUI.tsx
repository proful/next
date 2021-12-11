import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { NuToolBar } from './NuToolbar'
import { NuStatusBar } from './NuStatusBar'
import { NuPrimaryTools } from './NuPrimaryTools'

export const AppUI = observer(function AppUI() {
  return (
    <>
      <NuToolBar />
      <NuStatusBar />
      <NuPrimaryTools />
    </>
  )
})
