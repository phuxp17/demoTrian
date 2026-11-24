import React from 'react'
import { twMerge } from 'tailwind-merge'

export function Tag({ children, tone = 'gold', className }: { children: React.ReactNode; tone?: 'gold' | 'red' | 'jade' | 'plain'; className?: string }) {
  const tones = {
    gold: 'portal-gold-badge',
    red: 'bg-heritage-tint text-heritage-ink border border-heritage/15',
    jade: 'bg-jade-tint text-jade-deep border border-jade/20',
    plain: 'border border-line text-ink-soft',
  }
  return <span className={twMerge('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.8rem] font-medium', tones[tone], className)}>{children}</span>
}
