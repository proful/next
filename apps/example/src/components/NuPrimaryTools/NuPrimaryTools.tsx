import * as React from 'react'
import { useApp } from '@tldraw/react'
import {
  CursorArrowIcon,
  CircleIcon,
  Pencil1Icon,
  VercelLogoIcon,
  StarIcon,
  ShadowIcon,
  BoxIcon,
} from '@radix-ui/react-icons'
import { observer } from 'mobx-react-lite'
import { NuButton } from '~components/NuButton'
import { EraserIcon, LineIcon } from '~components/icons'

export const NuPrimaryTools = observer(function NuPrimaryTools() {
  const app = useApp()

  const handleToolClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const tool = e.currentTarget.dataset.tool
      if (tool) app.selectTool(tool)
    },
    [app]
  )

  const handleToolDoubleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const tool = e.currentTarget.dataset.tool
      if (tool) app.selectTool(tool)
      app.settings.update({ isToolLocked: true })
    },
    [app]
  )

  const selectedToolId = app.selectedTool.id

  return (
    <div className="nu-primary-tools">
      <button className="nu-floating-button"></button>
      <div className="nu-panel nu-floating-panel" data-tool-locked={app.settings.isToolLocked}>
        <NuButton
          data-tool="select"
          data-selected={selectedToolId === 'select'}
          onClick={handleToolClick}
        >
          <CursorArrowIcon />
        </NuButton>
        <NuButton
          data-tool="pen"
          data-selected={selectedToolId === 'pen'}
          onClick={handleToolClick}
        >
          <Pencil1Icon />
        </NuButton>
        <NuButton
          data-tool="highlighter"
          data-selected={selectedToolId === 'highlighter'}
          onClick={handleToolClick}
        >
          <ShadowIcon />
        </NuButton>
        <NuButton
          data-tool="erase"
          data-selected={selectedToolId === 'erase'}
          onClick={handleToolClick}
        >
          <EraserIcon />
        </NuButton>
        <NuButton
          data-tool="box"
          data-selected={selectedToolId === 'box'}
          onClick={handleToolClick}
          onDoubleClick={handleToolDoubleClick}
        >
          <BoxIcon />
        </NuButton>
        <NuButton
          data-tool="ellipse"
          data-selected={selectedToolId === 'ellipse'}
          onClick={handleToolClick}
          onDoubleClick={handleToolDoubleClick}
        >
          <CircleIcon />
        </NuButton>
        <NuButton
          data-tool="polygon"
          data-selected={selectedToolId === 'polygon'}
          onClick={handleToolClick}
          onDoubleClick={handleToolDoubleClick}
        >
          <VercelLogoIcon />
        </NuButton>
        <NuButton
          data-tool="star"
          data-selected={selectedToolId === 'star'}
          onClick={handleToolClick}
          onDoubleClick={handleToolDoubleClick}
        >
          <StarIcon />
        </NuButton>
        <NuButton
          data-tool="line"
          data-selected={selectedToolId === 'line'}
          onClick={handleToolClick}
          onDoubleClick={handleToolDoubleClick}
        >
          <LineIcon />
        </NuButton>
      </div>
      <button className="nu-floating-button"></button>
    </div>
  )
})
