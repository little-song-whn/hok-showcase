import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function Button({ asChild, className = '', ...props }: ButtonProps) {
  const Comp: any = asChild ? Slot : 'button'
  return (
    <Comp
      className={
        'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-sm border ' +
        'bg-white hover:bg-gray-50 ' + className
      }
      {...props}
    />
  )
}
