import React from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function Callout({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: 'info' | 'warn' | 'danger' | 'ok'
  title?: string
  children?: React.ReactNode
  className?: string
}) {
  const map = {
    info: { cls: 'border-sky/30 bg-sky-tint text-sky-ink', I: Info },
    warn: { cls: 'border-amber/40 bg-amber-tint text-amber-ink', I: AlertTriangle },
    danger: { cls: 'border-heritage/30 bg-heritage-tint text-heritage-ink', I: XCircle },
    ok: { cls: 'border-jade/30 bg-jade-tint text-jade-deep', I: CheckCircle2 },
  }[tone]
  const I = map.I
  return (
    <div className={twMerge(`flex gap-2.5 rounded-md border px-3.5 py-2.5 text-[13px] ${map.cls}`, className)}>
      <I className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
      </div>
    </div>
  )
}
