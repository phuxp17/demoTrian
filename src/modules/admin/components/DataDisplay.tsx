import React from 'react'
import { twMerge } from 'tailwind-merge'

export type StatusKey = 'draft' | 'pending' | 'returned' | 'published' | 'hidden' | 'active' | 'locked' | 'verifying' | 'scheduled'

const STATUS: Record<StatusKey, { label: string; cls: string; dot: string }> = {
  draft: { label: 'Nháp', cls: 'bg-ink/5 text-ink-soft', dot: 'bg-ink-mute' },
  pending: { label: 'Chờ duyệt', cls: 'bg-amber-tint text-amber-ink', dot: 'bg-amber' },
  verifying: { label: 'Đang xác minh', cls: 'bg-amber-tint text-amber-ink', dot: 'bg-amber' },
  returned: { label: 'Cần bổ sung', cls: 'bg-heritage-tint text-heritage-ink', dot: 'bg-heritage' },
  published: { label: 'Công khai', cls: 'bg-jade-tint text-jade-deep', dot: 'bg-jade' },
  scheduled: { label: 'Hẹn giờ', cls: 'bg-sky-tint text-sky-ink', dot: 'bg-sky' },
  hidden: { label: 'Đã ẩn', cls: 'bg-ink/5 text-ink-mute', dot: 'bg-line-strong' },
  active: { label: 'Hoạt động', cls: 'bg-jade-tint text-jade-deep', dot: 'bg-jade' },
  locked: { label: 'Đã khóa', cls: 'bg-heritage-tint text-heritage-ink', dot: 'bg-heritage' },
}

export function Status({ s, label }: { s: StatusKey; label?: string }) {
  const v = STATUS[s]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${v.cls}`}>
      <span className={`size-1.5 rounded-full ${v.dot}`} />
      {label ?? v.label}
    </span>
  )
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={twMerge('inline-flex items-center whitespace-nowrap rounded border border-line bg-canvas px-1.5 py-0.5 text-xs text-ink-soft', className)}>{children}</span>
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const parts = name.trim().split(/\s+/)
  const txt = ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
  return <span className={twMerge('grid size-8 shrink-0 place-items-center rounded-full bg-parchment text-xs font-semibold text-ink-soft', className)}>{txt}</span>
}

export function Thumb({ src, className, alt = '' }: { src: string; className?: string; alt?: string }) {
  return <img src={src} alt={alt} className={twMerge('size-10 shrink-0 rounded-md object-cover', className)} />
}
