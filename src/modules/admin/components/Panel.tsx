import React from 'react'
import { twMerge } from 'tailwind-merge'

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClass,
  flush,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClass?: string
  flush?: boolean
}) {
  return (
    <section className={twMerge('min-w-0 rounded-lg border border-line bg-surface', className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-2 border-b border-line px-3 py-2">
          <div className="min-w-0">
            {title && <h2 className="text-[14.5px] font-semibold leading-snug">{title}</h2>}
            {description && <p className="mt-0.5 text-[12.5px] text-ink-mute">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={twMerge(flush ? '' : 'p-3', bodyClass)}>{children}</div>
    </section>
  )
}
