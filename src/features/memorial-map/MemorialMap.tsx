import React from 'react'
import { Flag, Home, Landmark } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { MapPoint } from '@/data/portal.mock'

export const KIND_META: Record<MapPoint['kind'], { label: string; color: string; ring: string; Icon: typeof Flag }> = {
  cemetery: { label: 'Nghĩa trang liệt sĩ', color: 'bg-heritage', ring: 'ring-heritage', Icon: Landmark },
  red: { label: 'Địa chỉ đỏ', color: 'bg-gold', ring: 'ring-gold', Icon: Flag },
  family: { label: 'Gia đình có công', color: 'bg-jade', ring: 'ring-jade', Icon: Home },
}

/** Illustrated locality map (not to scale) with selectable memorial markers. */
export function MemorialMap({
  points,
  selectedId,
  onSelect,
  className,
}: {
  points: MapPoint[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  className?: string
}) {
  return (
    <div className={twMerge('relative overflow-hidden bg-parchment', className)}>
      <svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="field-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <path d="M0 0 V10" stroke="#c3b497" strokeWidth="1" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="1000" height="640" fill="var(--portal-map-paper, #efe6d3)" />
        {/* commune boundary */}
        <path d="M120 80 L420 40 L700 70 L900 160 L940 380 L860 560 L560 610 L260 590 L90 470 L60 250 Z" fill="var(--portal-map-land, #f9f4e8)" stroke="#a38246" strokeWidth="2" strokeDasharray="8 6" />
        {/* fields */}
        <path d="M150 130 L330 110 L350 230 L170 250 Z" fill="url(#field-hatch)" />
        <path d="M620 470 L800 440 L820 540 L640 570 Z" fill="url(#field-hatch)" />
        <path d="M700 130 L860 200 L840 300 L690 250 Z" fill="url(#field-hatch)" />
        <path d="M140 380 L280 360 L300 470 L170 490 Z" fill="url(#field-hatch)" />
        {/* water */}
        <path d="M0 330 C140 300 220 380 360 360 C520 340 560 420 700 400 C820 382 900 430 1000 410" fill="none" stroke="var(--portal-map-water, #b9cac3)" strokeWidth="18" strokeLinecap="round" opacity="0.82" />
        <ellipse cx="300" cy="520" rx="48" ry="26" fill="var(--portal-map-water, #b9cac3)" opacity="0.7" />
        <ellipse cx="760" cy="230" rx="36" ry="20" fill="var(--portal-map-water, #b9cac3)" opacity="0.7" />
        {/* roads */}
        <path d="M60 220 C300 260 600 230 940 300" fill="none" stroke="#fbf7ef" strokeWidth="9" />
        <path d="M60 220 C300 260 600 230 940 300" fill="none" stroke="#c3b497" strokeWidth="1.5" />
        <path d="M470 40 C480 220 500 400 520 610" fill="none" stroke="#fbf7ef" strokeWidth="9" />
        <path d="M470 40 C480 220 500 400 520 610" fill="none" stroke="#c3b497" strokeWidth="1.5" />
        <path d="M200 580 C320 470 600 470 860 520" fill="none" stroke="#fbf7ef" strokeWidth="6" />
        {/* compass */}
        <g transform="translate(930 580)" stroke="#9a773c" fill="none" strokeWidth="1.5">
          <circle r="22" />
          <path d="M0 -18 L5 0 L0 18 L-5 0 Z" fill="#9a773c" fillOpacity="0.28" />
          <text y="-28" textAnchor="middle" fill="#6b5d4e" stroke="none" fontSize="14" fontFamily="serif">B</text>
        </g>
      </svg>

      {points.map((p) => {
        const meta = KIND_META[p.kind]
        const on = selectedId === p.id
        return (
          <button
            key={p.id}
            onClick={() => onSelect?.(p.id)}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className={twMerge('group absolute -translate-x-1/2 -translate-y-full', on ? 'z-10' : 'z-[2]')}
            aria-label={`${p.name} — ${meta.label}`}
            aria-pressed={on}
          >
            <span
              className={twMerge(
                'flex h-10 w-10 items-center justify-center rounded-t-full rounded-b-lg border-2 border-[#fdf8ee] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_5px_12px_rgba(0,0,0,0.32)] transition-transform duration-150 ease-out group-hover:-translate-y-0.5',
                meta.color,
                on && 'scale-110 ring-4 ring-[#fff5d7]/75',
              )}
            >
              <meta.Icon className="h-4.5 w-4.5" />
            </span>
            {on && (
              <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-md border border-gold-soft/50 bg-[#201512] px-2.5 py-1 text-[0.8rem] whitespace-nowrap text-[#f8f0df] shadow-lg">
                {p.name}
              </span>
            )}
          </button>
        )
      })}

      <p className="absolute bottom-3 left-3 rounded-md bg-[#faf5ec]/92 px-2.5 py-1 text-[0.75rem] text-[#4f463b]">Sơ đồ minh hoạ — không theo tỷ lệ</p>
    </div>
  )
}

export function MapLegend({ className, active, onToggle }: { className?: string; active?: MapPoint['kind'][]; onToggle?: (k: MapPoint['kind']) => void }) {
  return (
    <div className={twMerge('flex flex-wrap gap-2', className)} role="group" aria-label="Lọc lớp bản đồ">
      {(Object.keys(KIND_META) as MapPoint['kind'][]).map((k) => {
        const m = KIND_META[k]
        const on = !active || active.includes(k)
        return (
          <button
            key={k}
            onClick={() => onToggle?.(k)}
            aria-pressed={on}
            className={twMerge(
              'flex h-10 items-center gap-2 rounded-[10px] border px-3 text-[0.9rem] transition-colors duration-150',
              on ? 'border-line-strong bg-paper text-ink' : 'border-line bg-transparent text-ink-mute line-through',
            )}
          >
            <span className={twMerge('h-3 w-3 rounded-t-full rounded-b-sm', m.color, !on && 'opacity-40')} />
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
