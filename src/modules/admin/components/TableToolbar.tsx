import React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { adminInputCls } from './FormControls'

export function SearchBox({ value, placeholder, onChange, className }: { value?: string; placeholder?: string; onChange?: (v: string) => void; className?: string }) {
  return (
    <span className={twMerge('relative block min-w-0', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
      <input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className={twMerge(adminInputCls, 'pl-9')} />
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
  head,
  children,
  className,
  primary,
}: {
  head: (string | { label: string; className?: string })[]
  children: React.ReactNode
  className?: string
  primary?: number
}) {
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

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: T; label: string; count?: number }[]
  value: T
  onChange?: (v: T) => void
  className?: string
}) {
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
