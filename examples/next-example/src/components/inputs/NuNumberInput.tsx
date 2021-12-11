import * as React from 'react'

interface NuNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function NuNumberInput({ label, ...rest }: NuNumberInputProps) {
  return (
    <div className="nu-input">
      <label htmlFor={`#number-${label}`}>{label}</label>
      <input className="nu-number-input" name={`#number-${label}`} type="number" {...rest} />
    </div>
  )
}
