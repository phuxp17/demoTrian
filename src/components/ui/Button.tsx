import React from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'light'
  size?: 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-semibold transition-[background-color,color,border-color,transform,filter,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:opacity-50'
  const sizes = { md: 'h-11 px-5 text-[0.95rem]', lg: 'h-13 px-7 text-base' }
  const variants = {
    primary: 'portal-btn-primary',
    secondary: 'portal-btn-secondary',
    ghost: 'text-heritage hover:bg-heritage-tint',
    light: 'portal-gold-badge hover:brightness-105',
  }
  return (
    <button className={twMerge(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}
