import React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Info, User } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { OrnamentRule } from './Ornaments'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'light'
  size?: 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.98] disabled:opacity-50'
  const sizes = { md: 'h-11 px-5 text-[0.95rem]', lg: 'h-13 px-7 text-base' }
  const variants = {
    primary: 'bg-heritage text-white hover:bg-heritage-deep',
    secondary: 'border border-heritage/40 bg-paper text-heritage hover:border-heritage hover:bg-heritage-tint',
    ghost: 'text-heritage hover:bg-heritage-tint',
    light: 'bg-paper text-heritage-ink hover:bg-gold-pale',
  }
  return (
    <button className={twMerge(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}

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
        <h2 className={twMerge('font-serif text-[1.75rem] leading-tight font-medium text-balance sm:text-3xl md:text-[2.5rem]', tone === 'dark' ? 'text-ink' : 'text-paper')}>{title}</h2>
        {lead && <p className={twMerge('mt-3 text-[1.05rem] leading-relaxed', tone === 'dark' ? 'text-ink-soft' : 'text-gold-pale')}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function Breadcrumb({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav aria-label="Đường dẫn" className="text-[0.9rem] text-ink-mute">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gold" aria-hidden />}
            {it.onClick ? (
              <button onClick={it.onClick} className="underline-offset-4 hover:text-heritage hover:underline">
                {it.label}
              </button>
            ) : (
              <span aria-current="page" className="text-ink-soft">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Tag({ children, tone = 'gold', className }: { children: React.ReactNode; tone?: 'gold' | 'red' | 'jade' | 'plain'; className?: string }) {
  const tones = {
    gold: 'bg-gold-pale text-heritage-ink',
    red: 'bg-heritage-tint text-heritage-deep',
    jade: 'bg-[#e1e8e1] text-jade',
    plain: 'border border-line text-ink-soft',
  }
  return <span className={twMerge('inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-2 py-0.5 text-[0.8rem] font-medium', tones[tone], className)}>{children}</span>
}

/** Portrait frame for records that have no verified photograph yet. */
export function Portrait({ name, className, arch = true }: { name: string; className?: string; arch?: boolean }) {
  return (
    <div
      className={twMerge(
        'relative flex flex-col items-center justify-center overflow-hidden border border-gold-soft bg-parchment text-ink-mute',
        arch ? 'rounded-t-[999px]' : 'rounded-md',
        className,
      )}
      role="img"
      aria-label={`Chân dung ${name} — chưa có ảnh`}
    >
      <div className={twMerge('pointer-events-none absolute inset-2 border border-gold-soft/70', arch ? 'rounded-t-[999px]' : 'rounded-sm')} />
      <User className="h-1/3 w-1/3 max-h-16 max-w-16 text-gold" strokeWidth={1} />
      <span className="mt-2 px-3 text-center text-[0.75rem] leading-snug">Ảnh đang cập nhật</span>
    </div>
  )
}

export function SelectField({ label, options, value, onChange, className }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void; className?: string }) {
  return (
    <label className={twMerge('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="text-[0.85rem] font-medium text-ink-soft">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-12 w-full appearance-none rounded-md border border-line-strong bg-paper pr-10 pl-3.5 text-[0.95rem] text-ink focus:border-heritage focus:outline-none"
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
          className={twMerge('h-12 w-full rounded-md border border-line-strong bg-paper pr-3.5 text-[0.95rem] text-ink placeholder:text-ink-mute focus:border-heritage focus:outline-none', icon ? 'pl-11' : 'pl-3.5')}
        />
      </span>
    </label>
  )
}

/** Page buttons. Draws nothing when everything fits on one page. */
export function Pagination({ page = 1, total = 5, onChange }: { page?: number; total?: number; onChange?: (page: number) => void }) {
  if (total <= 1) return null
  const go = (p: number) => onChange?.(Math.min(Math.max(p, 1), total))
  return (
    <nav aria-label="Phân trang" className="flex flex-wrap items-center justify-center gap-1.5">
      <button onClick={() => go(page - 1)} disabled={page <= 1} className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink-soft hover:border-heritage hover:text-heritage disabled:pointer-events-none disabled:opacity-40" aria-label="Trang trước">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => go(i + 1)}
          aria-current={i + 1 === page ? 'page' : undefined}
          className={twMerge(
            'h-11 min-w-11 rounded-md px-3 text-[0.95rem] font-medium',
            i + 1 === page ? 'bg-heritage text-white' : 'text-ink-soft hover:bg-heritage-tint hover:text-heritage',
          )}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => go(page + 1)} disabled={page >= total} className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink-soft hover:border-heritage hover:text-heritage disabled:pointer-events-none disabled:opacity-40" aria-label="Trang sau">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

export function SampleNotice({ className }: { className?: string }) {
  return (
    <p className={twMerge('flex items-start gap-2 rounded-md border border-gold-soft bg-gold-pale/50 px-4 py-3 text-[0.88rem] leading-relaxed text-ink-soft', className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <span>Thông tin hiển thị là dữ liệu minh hoạ, đang chờ đối chiếu với hồ sơ chính thức của cơ quan chức năng. Thân nhân có thể gửi đính chính qua mục Góp tư liệu.</span>
    </p>
  )
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={twMerge('mx-auto w-full max-w-7xl px-5 md:px-8', className)}>{children}</div>
}
