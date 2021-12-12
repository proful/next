import * as React from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { TLBounds } from '~types'

/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface ContainerProps extends React.HTMLProps<HTMLDivElement> {
  id?: string
  bounds: TLBounds
  zIndex?: number
  rotation?: number
  className?: string
  children: React.ReactNode
}

export const Container = observer<ContainerProps>(function Container({
  id,
  bounds,
  rotation = 0,
  className = '',
  zIndex,
  children,
  ...props
}) {
  const rBounds = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const elm = rBounds.current!

    elm.style.setProperty(
      'transform',
      `translate(
          calc(${bounds.minX}px - var(--tl-padding)),
          calc(${bounds.minY}px - var(--tl-padding))
        )
        rotate(${rotation + (bounds.rotation || 0)}rad)`
    )
  }, [bounds.minX, bounds.minY, rotation, bounds.rotation])

  React.useLayoutEffect(() => {
    const elm = rBounds.current!

    elm.style.setProperty('width', `calc(${Math.floor(bounds.width)}px + (var(--tl-padding) * 2))`)

    elm.style.setProperty(
      'height',
      `calc(${Math.floor(bounds.height)}px + (var(--tl-padding) * 2))`
    )

    if (zIndex !== undefined) {
      elm.style.setProperty('z-index', zIndex?.toString())
    }
  }, [bounds.width, bounds.height, zIndex, rotation])

  return (
    <div
      id={id}
      ref={rBounds}
      className={`tl-positioned ${className}`}
      aria-label="container"
      {...props}
    >
      {children}
    </div>
  )
})
