import React from 'react'
import { User } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

/** Portrait frame for records that have no verified photograph yet. */
export function Portrait({ name, className, arch = true }: { name: string; className?: string; arch?: boolean }) {
  return (
    <div
      className={twMerge(
        'portal-portrait-mat relative flex flex-col items-center justify-center overflow-hidden text-ink-mute',
        arch ? 'rounded-t-[999px]' : 'rounded-xl',
        className,
      )}
      role="img"
      aria-label={`Chân dung ${name} — chưa có ảnh`}
    >
      <div className={twMerge('pointer-events-none absolute inset-2 border border-gold-soft/75', arch ? 'rounded-t-[999px]' : 'rounded-lg')} />
      <User className="h-1/3 w-1/3 max-h-16 max-w-16 text-gold" strokeWidth={1} />
      <span className="mt-2 px-3 text-center text-[0.75rem] leading-snug">Ảnh đang cập nhật</span>
    </div>
  )
}
