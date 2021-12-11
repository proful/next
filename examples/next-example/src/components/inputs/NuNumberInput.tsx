import * as React from 'react'

interface NuNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function NuNumberInput({ label, ...rest }: NuNumberInputProps) {
  return (
    <div className="tl-input">
      <label htmlFor={`#number-${label}`}>{label}</label>
      <input className="tl-input" name={`#number-${label}`} type="number" {...rest} />
    </div>
  )
}
