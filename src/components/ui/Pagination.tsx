import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

/** Page buttons. Draws nothing when everything fits on one page. */
export function Pagination({ page = 1, total = 5, onChange }: { page?: number; total?: number; onChange?: (page: number) => void }) {
  if (total <= 1) return null
  const go = (p: number) => onChange?.(Math.min(Math.max(p, 1), total))
  return (
    <nav aria-label="Phân trang" className="flex flex-wrap items-center justify-center gap-1.5">
      <button onClick={() => go(page - 1)} disabled={page <= 1} className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line text-ink-soft hover:border-heritage hover:text-heritage disabled:pointer-events-none disabled:opacity-40" aria-label="Trang trước">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => go(i + 1)}
          aria-current={i + 1 === page ? 'page' : undefined}
          className={twMerge(
            'h-11 min-w-11 rounded-[10px] px-3 text-[0.95rem] font-medium',
            i + 1 === page ? 'portal-btn-primary' : 'text-ink-soft hover:bg-heritage-tint hover:text-heritage',
          )}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => go(page + 1)} disabled={page >= total} className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line text-ink-soft hover:border-heritage hover:text-heritage disabled:pointer-events-none disabled:opacity-40" aria-label="Trang sau">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
