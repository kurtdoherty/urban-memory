import type { ButtonHTMLAttributes } from 'react'

export namespace MyButton {
  export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Controls the visual style of the button. */
    variant?: 'primary' | 'secondary'
  }
}

/** A simple button. */
export function MyButton({ variant = 'primary', children, ...rest }: MyButton.Props) {
  return (
    <button data-variant={variant} {...rest}>
      {children}
    </button>
  )
}
