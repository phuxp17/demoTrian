import React from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Info, Search, XCircle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

/* ---------- Buttons ---------- */

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

/* ---------- Status ---------- */

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

/* ---------- Surfaces ---------- */

export function Panel({
  title, description, action, children, className, bodyClass, flush,
}: { title?: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; bodyClass?: string; flush?: boolean }) {
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

export function Callout({ tone = 'info', title, children, className }: { tone?: 'info' | 'warn' | 'danger' | 'ok'; title?: string; children?: React.ReactNode; className?: string }) {
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

/* ---------- Form ---------- */

export function Field({ label, hint, error, required, children, className }: { label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={twMerge('block min-w-0', className)}>
      <span className="mb-1 block text-[13px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-heritage">*</span>}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-heritage">{error}</span> : hint ? <span className="mt-1 block text-xs text-ink-mute">{hint}</span> : null}
    </label>
  )
}

const inputCls =
  'h-9 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-mute/80 transition-[border-color,box-shadow] duration-150 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

export function Input({ className, invalid, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={twMerge(inputCls, invalid && 'border-heritage focus:border-heritage focus:ring-heritage/15', className)} {...rest} />
}

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={twMerge(inputCls, 'h-auto min-h-24 py-2 leading-relaxed', className)} {...rest} />
}

export function Select({ options, value, className, onChange }: { options: string[]; value?: string; className?: string; onChange?: (v: string) => void }) {
  return (
    <span className={twMerge('relative block', className)}>
      <select value={value} onChange={(e) => onChange?.(e.target.value)} className={twMerge(inputCls, 'appearance-none pr-8')}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
    </span>
  )
}

export function Toggle({ on, onChange, label, description }: { on: boolean; onChange?: (v: boolean) => void; label?: string; description?: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange?.(!on)} className="flex w-full items-start gap-3 text-left">
      <span className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ${on ? 'bg-jade' : 'bg-line-strong'}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </span>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-medium">{label}</span>}
          {description && <span className="block text-xs text-ink-mute">{description}</span>}
        </span>
      )}
    </button>
  )
}

export function Check({ checked, onChange, label, className }: { checked?: boolean; onChange?: (v: boolean) => void; label?: React.ReactNode; className?: string }) {
  return (
    <label className={twMerge('inline-flex cursor-pointer items-center gap-2 text-sm', className)}>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} className="size-4 rounded border-line-strong accent-heritage" />
      {label}
    </label>
  )
}

/* ---------- List toolbars & tables ---------- */

export function SearchBox({ value, placeholder, onChange, className }: { value?: string; placeholder?: string; onChange?: (v: string) => void; className?: string }) {
  return (
    <span className={twMerge('relative block min-w-0', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
      <input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className={twMerge(inputCls, 'pl-9')} />
    </span>
  )
}

/** A compact filter that reads "Label: value". */
export function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange?: (v: string) => void }) {
  return (
    <span className="relative inline-flex">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={label}
        className="h-9 appearance-none rounded-md border border-line-strong bg-surface pl-3 pr-8 text-sm text-ink focus:border-gold focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {label}: {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
    </span>
  )
}

/**
 * A data table from `md` up. Below it, each row restacks as a compact record: the cells before
 * `primary` (a checkbox, a line number) and the primary cell share the first line with a trailing
 * action column; every other cell wraps underneath with its column name, so nothing scrolls sideways.
 */
export function Table({
  head, children, className, primary,
}: { head: (string | { label: string; className?: string })[]; children: React.ReactNode; className?: string; primary?: number }) {
  const labels = head.map((h) => (typeof h === 'string' ? h : h.label))
  const main = primary ?? Math.max(0, labels.findIndex((l) => l !== ''))
  const last = labels.length - 1
  const action = labels[last] === '' && last > main ? last : -1

  const rows = React.Children.map(children, (row) => {
    if (!React.isValidElement<{ className?: string; children?: React.ReactNode }>(row) || row.type !== 'tr') return row
    const cells = React.Children.map(row.props.children, (cell, i) => {
      if (!React.isValidElement<{ className?: string; children?: React.ReactNode }>(cell)) return cell
      const empty = cell.props.children === undefined || cell.props.children === null || cell.props.children === false || cell.props.children === ''
      const label = labels[i] ?? ''
      const role = i < main ? 'lead' : i === main ? 'main' : i === action ? 'action' : 'meta'
      const stack = {
        lead: 'max-md:shrink-0',
        main: 'max-md:min-w-0 max-md:flex-1',
        action: 'max-md:order-1 max-md:shrink-0',
        meta: `max-md:order-2 max-md:inline-flex max-md:items-baseline max-md:gap-1 max-md:whitespace-normal max-md:text-[13px] ${label && label !== 'Trạng thái' ? "max-md:before:shrink-0 max-md:before:text-ink-mute max-md:before:content-[attr(data-label)_':']" : ''}`,
      }[role]
      return React.cloneElement(cell as React.ReactElement<Record<string, unknown>>, {
        'data-label': label || undefined,
        className: twMerge(cell.props.className, 'max-md:p-0 max-md:text-left', stack, empty && 'max-md:hidden'),
      })
    })
    return React.cloneElement(row, {
      className: twMerge(
        row.props.className,
        "max-md:flex max-md:flex-wrap max-md:items-center max-md:gap-x-4 max-md:gap-y-1 max-md:px-4 max-md:py-3 max-md:after:order-1 max-md:after:basis-full max-md:after:content-['']",
      ),
      children: cells,
    })
  })

  return (
    <div className={twMerge('min-w-0 md:overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm max-md:block md:min-w-[720px]">
        <thead className="max-md:hidden">
          <tr className="border-b border-line bg-canvas/60 text-left text-xs font-medium text-ink-mute">
            {head.map((h, i) => {
              const c = typeof h === 'string' ? { label: h } : h
              return (
                <th key={i} className={twMerge('whitespace-nowrap px-3.5 py-2 font-medium', c.className)}>
                  {c.label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-line max-md:block">{rows}</tbody>
      </table>
    </div>
  )
}

export function Pager({ from, to, total, page = 1, pages = 1 }: { from: number; to: number; total: number; page?: number; pages?: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-3.5 py-2.5 text-[13px] text-ink-mute">
      <span>
        Hiển thị <b className="font-medium text-ink">{from}–{to}</b> trong <b className="font-medium text-ink">{total.toLocaleString('vi-VN')}</b>
      </span>
      <div className="flex items-center gap-1">
        <button aria-label="Trang trước" className="grid size-8 place-items-center rounded-md border border-line text-ink-soft hover:bg-canvas disabled:opacity-40" disabled={page <= 1}>
          <ChevronLeft className="size-4" />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
          <button key={p} className={`grid size-8 place-items-center rounded-md text-[13px] tabular-nums ${p === page ? 'bg-ink text-white' : 'text-ink-soft hover:bg-canvas'}`}>
            {p}
          </button>
        ))}
        {pages > 5 && <span className="px-1">… {pages}</span>}
        <button aria-label="Trang sau" className="grid size-8 place-items-center rounded-md border border-line text-ink-soft hover:bg-canvas">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange, className }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange?: (v: T) => void; className?: string }) {
  return (
    <div className={twMerge('no-scrollbar flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line', className)}>
      {tabs.map((t) => {
        const on = t.id === value
        return (
          <button
            key={t.id}
            onClick={() => onChange?.(t.id)}
            className={`relative flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 text-sm transition-colors duration-150 ${on ? 'border-heritage font-medium text-ink' : 'border-transparent text-ink-mute hover:text-ink'}`}
          >
            {t.label}
            {t.count !== undefined && <span className={`rounded px-1.5 text-[11px] tabular-nums ${on ? 'bg-heritage-tint text-heritage-ink' : 'bg-ink/5'}`}>{t.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const parts = name.trim().split(/\s+/)
  const txt = ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
  return <span className={twMerge('grid size-8 shrink-0 place-items-center rounded-full bg-parchment text-xs font-semibold text-ink-soft', className)}>{txt}</span>
}

/** Sticky footer bar for long forms: always sits flush at the bottom of the viewport or scroll end. */
export function FormFooter({ note, children }: { note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-2.5 -mb-2.5 mt-auto flex flex-wrap items-center justify-between gap-2.5 border-t border-line bg-surface/95 px-3 py-2.5 backdrop-blur sm:-mx-3 sm:px-4">
      <span className="text-[13px] text-ink-mute">{note}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export function Thumb({ src, className, alt = '' }: { src: string; className?: string; alt?: string }) {
  return <img src={src} alt={alt} className={twMerge('size-10 shrink-0 rounded-md object-cover', className)} />
}
