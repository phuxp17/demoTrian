import React from 'react'
import { ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export const adminInputCls =
  'h-9 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-mute/80 transition-[border-color,box-shadow] duration-150 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
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

export function Input({ className, invalid, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={twMerge(adminInputCls, invalid && 'border-heritage focus:border-heritage focus:ring-heritage/15', className)} {...rest} />
}

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={twMerge(adminInputCls, 'h-auto min-h-24 py-2 leading-relaxed', className)} {...rest} />
}

export function Select({ options, value, className, onChange }: { options: string[]; value?: string; className?: string; onChange?: (v: string) => void }) {
  return (
    <span className={twMerge('relative block', className)}>
      <select value={value} onChange={(e) => onChange?.(e.target.value)} className={twMerge(adminInputCls, 'appearance-none pr-8')}>
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

/** Sticky footer bar for long forms: always sits flush at the bottom of the viewport or scroll end. */
export function FormFooter({ note, children }: { note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-2.5 -mb-2.5 mt-auto flex flex-wrap items-center justify-between gap-2.5 border-t border-line bg-surface/95 px-3 py-2.5 backdrop-blur sm:-mx-3 sm:px-4">
      <span className="text-[13px] text-ink-mute">{note}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
