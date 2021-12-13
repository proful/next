import { Observer } from 'mobx-react-lite'
import * as React from 'react'

interface HTMLContainerProps extends React.HTMLProps<HTMLDivElement> {
  centered?: boolean
  children: React.ReactNode
}

export const HTMLContainer = React.forwardRef<HTMLDivElement, HTMLContainerProps>(
  function HTMLContainer({ children, centered, className = '', ...rest }, ref) {
    return (
      <Observer>
        {() => (
          <div ref={ref} className={`tl-positioned-div ${className}`} {...rest}>
            <div className={`tl-positioned-inner ${centered ? 'tl-centered' : ''}`}>{children}</div>
          </div>
        )}
      </Observer>
    )
  }
)
