import * as React from 'react'

export interface NuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function NuButton(props: NuButtonProps) {
  return <button className="nu-button" {...props} />
}
