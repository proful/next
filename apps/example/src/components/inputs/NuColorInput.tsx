import * as React from 'react'

interface NuColorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function NuColorInput({ label, ...rest }: NuColorInputProps) {
  return (
    <div className="nu-input">
      <label htmlFor={`#color-${label}`}>{label}</label>
      <input className="nu-color-input" name={`#color-${label}`} type="color" {...rest} />
    </div>
  )
}
