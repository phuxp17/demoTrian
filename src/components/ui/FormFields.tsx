import React from 'react'
import { ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function SelectField({ label, options, value, onChange, className }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void; className?: string }) {
  return (
    <label className={twMerge('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="text-[0.85rem] font-medium text-ink-soft">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-12 w-full appearance-none rounded-[10px] border border-line-strong bg-paper pr-10 pl-3.5 text-[0.95rem] text-ink focus:border-heritage focus:outline-none"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-ink-mute" />
      </span>
    </label>
  )
}

export function TextField({ label, placeholder, value, onChange, className, icon }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void; className?: string; icon?: React.ReactNode }) {
  return (
    <label className={twMerge('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="text-[0.85rem] font-medium text-ink-soft">{label}</span>
      <span className="relative">
        {icon && <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-mute">{icon}</span>}
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={twMerge('h-12 w-full rounded-[10px] border border-line-strong bg-paper pr-3.5 text-[0.95rem] text-ink placeholder:text-ink-mute focus:border-heritage focus:outline-none', icon ? 'pl-11' : 'pl-3.5')}
        />
      </span>
    </label>
  )
}
