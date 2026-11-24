import React from 'react'
import { twMerge } from 'tailwind-merge'

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
}

export function Btn({ variant = 'secondary', size = 'md', icon, className, children, ...rest }: BtnProps) {
  const base =
    'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'
  const sizes = { sm: 'h-8 px-2.5 text-[13px]', md: 'h-9 px-3.5 text-sm' }
  const variants = {
    primary: 'bg-heritage text-white hover:bg-heritage-deep',
    secondary: 'border border-line-strong bg-surface text-ink hover:bg-canvas',
    ghost: 'text-ink-soft hover:bg-ink/5 hover:text-ink',
    danger: 'border border-heritage/30 bg-surface text-heritage hover:bg-heritage-tint',
    success: 'bg-jade text-white hover:bg-jade-deep',
  }
  return (
    <button className={twMerge(base, sizes[size], variants[variant], className)} {...rest}>
      {icon}
      {children}
    </button>
  )
}
