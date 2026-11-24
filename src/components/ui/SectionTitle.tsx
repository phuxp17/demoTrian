import React from 'react'
import { twMerge } from 'tailwind-merge'
import { OrnamentRule } from '@/components/ornaments'

export function SectionTitle({
  title,
  lead,
  align = 'left',
  action,
  tone = 'dark',
}: {
  title: string
  lead?: string
  align?: 'left' | 'center'
  action?: React.ReactNode
  tone?: 'dark' | 'light'
}) {
  const center = align === 'center'
  return (
    <div className={twMerge('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', center && 'items-center text-center md:flex-col md:items-center')}>
      <div className={twMerge('max-w-2xl', center && 'mx-auto')}>
        <OrnamentRule className={twMerge('mb-4 text-gold', center && 'justify-center')} />
        <h2
          className={twMerge(
            'font-serif text-[1.75rem] leading-tight font-semibold text-balance sm:text-3xl md:text-[2.5rem]',
            tone === 'dark' ? 'text-heritage-ink' : 'text-[var(--portal-on-dark)]',
          )}
        >
          {title}
        </h2>
        {lead && <p className={twMerge('mt-3 text-[1.05rem] leading-relaxed', tone === 'dark' ? 'text-ink-soft' : 'text-[var(--portal-on-dark-soft)]')}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
