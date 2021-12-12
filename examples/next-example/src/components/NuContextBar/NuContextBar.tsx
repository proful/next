import * as React from 'react'
import { BoundsUtils, HTMLContainer, TLContextBarComponent, useApp } from '@tldraw/next'
import { observer } from 'mobx-react-lite'
import type { NuStarShape, NuPolygonShape, Shape } from 'stores'
import { NuNumberInput } from '../inputs/NuNumberInput'
import { NuColorInput } from '../inputs/NuColorInput'

const _NuContextBar: TLContextBarComponent<Shape> = ({
  shapes,
  offset,
  scaledBounds,
  // rotation,
}) => {
  const app = useApp()

  const rSize = React.useRef([0, 0])
  const rContextBar = React.useRef<HTMLDivElement>(null)

  const updateStroke = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    shapes.forEach((shape) => shape.update({ stroke: e.currentTarget.value }))
  }, [])

  const updateFill = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    shapes.forEach((shape) => shape.update({ fill: e.currentTarget.value }))
  }, [])

  const updateStrokeWidth = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    shapes.forEach((shape) => shape.update({ strokeWidth: +e.currentTarget.value }))
  }, [])

  const updateOpacity = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    shapes.forEach((shape) => shape.update({ opacity: +e.currentTarget.value }))
  }, [])

  const updateSides = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    shapes.forEach((shape) => shape.update({ sides: +e.currentTarget.value }))
  }, [])

  const updateRatio = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    shapes.forEach((shape) => shape.update({ ratio: +e.currentTarget.value }))
  }, [])

  React.useLayoutEffect(() => {
    const elm = rContextBar.current
    if (!elm) return
    const { offsetWidth, offsetHeight } = elm
    rSize.current = [offsetWidth, offsetHeight]
  }, [])

  React.useLayoutEffect(() => {
    const elm = rContextBar.current
    if (!elm) return
    const size = rSize.current
    const [x, y] = BoundsUtils.getContextBarTranslation(size, offset)
    elm.style.setProperty('transform', `translateX(${x}px) translateY(${y}px)`)
  }, [scaledBounds, offset])

  if (!app) return null

  const sidesShapes = shapes.filter((shape) => 'sides' in shape) as (NuPolygonShape | NuStarShape)[]

  return (
    <HTMLContainer centered>
      <div
        ref={rContextBar}
        className="contextbar"
        style={{
          pointerEvents: 'all',
          position: 'relative',
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          whiteSpace: 'nowrap',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          fontSize: 14,
          willChange: 'transform',
          boxShadow: 'var(--tl-shadow-elevation-medium)',
        }}
      >
        <NuColorInput label="Stroke" value={shapes[0].stroke} onChange={updateStroke} />
        <NuColorInput label="Fill" value={shapes[0].fill} onChange={updateFill} />
        <NuNumberInput
          label="Width"
          value={Math.max(...shapes.map((shape) => shape.strokeWidth))}
          onChange={updateStrokeWidth}
          style={{ width: 48 }}
        />
        {sidesShapes.length > 0 && (
          <NuNumberInput
            label="Sides"
            value={Math.max(...sidesShapes.map((shape) => shape.sides))}
            onChange={updateSides}
            style={{ width: 40 }}
          />
        )}
        {sidesShapes.length > 0 && (
          <NuNumberInput
            label="Ratio"
            value={Math.max(...sidesShapes.map((shape) => shape.ratio))}
            onChange={updateRatio}
            step={0.1}
            min={0}
            max={2}
            style={{ width: 40 }}
          />
        )}
        <NuNumberInput
          label="Opacity"
          value={Math.max(...shapes.map((shape) => shape.opacity))}
          onChange={updateOpacity}
          step={0.1}
          style={{ width: 48 }}
        />
      </div>
    </HTMLContainer>
  )
}

export const NuContextBar = observer(_NuContextBar)
