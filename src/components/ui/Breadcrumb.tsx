import React from 'react'
import { ChevronRight } from 'lucide-react'

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
