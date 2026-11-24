import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Maximize2, Minus, Plus } from 'lucide-react'
import { AISLE, MEM_Y, PL, PW, ROW, type Layout, type Site } from '../../GraveMap.frame/components/IsoCemetery'

export type PlotState = 'profile' | 'known' | 'unknown' | 'conflict'

type Props = {
  site: Site
  layout: Layout
  stateOf: (plot: string) => PlotState
  nameOf: (plot: string) => string | undefined
  selected: string | null
  onSelect: (plot: string) => void
  tool: string
  /** Bump to scroll the selected grave into view. */
  focusKey: number
}

/**
 * Mặt bằng 2D cho người quản lý: cùng hình học với sơ đồ 2.5D công khai (buildSite), nhìn
 * thẳng từ trên xuống. Đài ở trên, cổng ở dưới, bia mộ là vạch đậm ở cạnh trên mỗi ô.
 */
export function PlanEditor({ site, layout, stateOf, nameOf, selected, onSelect, tool, focusKey }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const cx = site.W / 2
  const sel = selected ? site.graves.find((g) => g.plot === selected) : undefined
  const w = site.W * S + PAD * 2
  const h = site.D * S + PAD * 2

  const fitZoom = () => {
    const el = scroller.current
    return el ? clamp((el.clientWidth - 32) / w) : 1
  }
  const fit = () => setZoom(fitZoom())
  // Mở ra vừa bề ngang, nhưng không nhỏ tới mức số mộ khó đọc; nút "Vừa khung" thì vừa hẳn
  useLayoutEffect(() => setZoom(Math.max(0.85, fitZoom())), [site.W])

  useEffect(() => {
    const el = scroller.current
    if (!el || !sel) return
    el.scrollTo({ left: (sel.x * S + PAD) * zoom - el.clientWidth / 2 + 16, top: (sel.y * S + PAD) * zoom - el.clientHeight / 2 + 16, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey])

  // Công cụ "Kéo", hoặc giữ chuột phải với bất kỳ công cụ nào, để di chuyển
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!(tool === 'pan' && e.button === 0) && e.button !== 2) return
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    e.currentTarget.scrollLeft = d.left - (e.clientX - d.x)
    e.currentTarget.scrollTop = d.top - (e.clientY - d.y)
  }
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return
    drag.current = null
    setDragging(false)
  }

  const r = (x0: number, y0: number, x1: number, y1: number) => ({ x: x0 * S, y: y0 * S, width: (x1 - x0) * S, height: (y1 - y0) * S })
  const editing = (t: string) => tool === t
  const gold = { stroke: 'var(--color-gold)', strokeWidth: 2, strokeDasharray: '6 4' }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scroller}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onContextMenu={(e) => e.preventDefault()}
        className={`grid-paper min-h-0 flex-1 overflow-auto p-4 pb-20 ${dragging ? 'cursor-grabbing [&_*]:cursor-grabbing' : tool === 'pan' ? 'cursor-grab [&_*]:cursor-grab' : ''}`}
      >
        <svg
          width={w * zoom}
          height={h * zoom}
          viewBox={`${-PAD} ${-PAD} ${w} ${h}`}
          className="mx-auto block select-none"
          role="group"
          aria-label="Mặt bằng nghĩa trang dạng 2D, đài ở trên, cổng chính ở dưới"
        >
          {/* Khuôn viên */}
          <rect {...r(0, 0, site.W, site.D)} rx={6} className="fill-ivory stroke-line-strong" strokeWidth={1.5} />

          {/* Cây xanh */}
          {site.trees.map(([x, y], i) => (
            <circle key={i} cx={x * S} cy={y * S} r={0.55 * S} className="fill-jade/20 stroke-jade/30" />
          ))}
          {site.hedges.map((hd, i) => (
            <rect key={`h${i}`} {...r(hd[0], hd[1], hd[2], hd[3])} rx={3} className="fill-jade/30" />
          ))}

          {/* Lối đi */}
          {site.paths.map((p, i) => (
            <rect key={i} {...r(p[0], p[1], p[2], p[3])} rx={3} className="fill-paper stroke-line-strong" strokeWidth={1} {...(editing('path') ? gold : {})} />
          ))}

          {/* Khu */}
          {site.zones.map((z) => (
            <g key={z.id}>
              <rect
                {...r(z.x0 - 0.3, z.y0 - 0.3, z.x0 + site.zoneW + 0.3, z.y0 + site.zoneD + 0.3)}
                rx={4}
                className={`fill-jade/10 stroke-jade/30 ${editing('zone') ? 'cursor-pointer hover:fill-gold/10' : ''}`}
                strokeWidth={1}
                {...(editing('zone') ? gold : {})}
              />
              <text x={(z.left ? z.x0 : z.x0 + site.zoneW) * S} y={(z.y0 - 0.55) * S} textAnchor={z.left ? 'start' : 'end'} className="fill-ink font-sans" fontSize={15} fontWeight={600}>Khu {z.id}</text>
              {Array.from({ length: layout.rows }, (_, i) => {
                const y = z.y0 + (i + 0.5) * ROW
                return (
                  <g key={i}>
                    {editing('row') && (
                      <rect {...r(z.x0 - 0.15, y - ROW / 2 + 0.12, z.x0 + site.zoneW + 0.15, y + ROW / 2 - 0.12)} rx={3} className="cursor-pointer fill-transparent stroke-gold hover:fill-gold/10" strokeWidth={1} strokeDasharray="4 3" />
                    )}
                    <text x={(z.left ? z.x0 - 0.75 : z.x0 + site.zoneW + 0.75) * S} y={y * S + 4} textAnchor="middle" className="pointer-events-none fill-ink-mute font-sans" fontSize={11} fontWeight={500}>H{i + 1}</text>
                  </g>
                )
              })}
            </g>
          ))}

          {/* Đài và cổng (mốc) */}
          <g {...(editing('landmark') ? { className: 'cursor-pointer' } : {})}>
            <rect {...r(cx - 3.2, MEM_Y - 2.4, cx + 3.2, MEM_Y + 2.4)} rx={4} className="fill-paper stroke-line-strong" strokeWidth={1} {...(editing('landmark') ? gold : {})} />
            <rect {...r(cx - 1.6, MEM_Y - 1.1, cx + 1.6, MEM_Y + 1.1)} rx={2} className="fill-line stroke-line-strong" strokeWidth={1} />
            <rect {...r(cx - 0.55, MEM_Y - 0.4, cx + 0.55, MEM_Y + 0.4)} className="fill-heritage" />
            <text x={cx * S} y={(MEM_Y - 2.4) * S - 8} textAnchor="middle" className="fill-heritage-ink font-sans" fontSize={13} fontWeight={600}>Đài Tổ quốc ghi công</text>
          </g>
          <g>
            <rect {...r(cx - 2.1, site.D - 1.4, cx - 1.3, site.D - 0.6)} className="fill-paper stroke-line-strong" {...(editing('landmark') ? gold : {})} />
            <rect {...r(cx + 1.3, site.D - 1.4, cx + 2.1, site.D - 0.6)} className="fill-paper stroke-line-strong" {...(editing('landmark') ? gold : {})} />
            <rect {...r(cx - 2.3, site.D - 1.1, cx + 2.3, site.D - 0.9)} className="fill-heritage" />
            <text x={cx * S} y={(site.D - 1.4) * S - 8} textAnchor="middle" className="fill-heritage-ink font-sans" fontSize={13} fontWeight={600}>Cổng chính</text>
          </g>

          {/* Lối đi tới mộ đang chọn — trùng với lời chỉ đường công khai */}
          {sel && (
            <polyline
              points={[[cx, site.D - 1.6], [cx, sel.y + AISLE], [sel.x, sel.y + AISLE], [sel.x, sel.y + PL]].map(([x, y]) => `${x * S},${y * S}`).join(' ')}
              className="pointer-events-none fill-none stroke-heritage"
              strokeWidth={2.5}
              strokeDasharray="6 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Ô mộ */}
          {site.graves.map((g) => {
            const st = stateOf(g.plot)
            const on = g.plot === selected
            const c = on ? TONE.on : TONE[st]
            const num = g.plot.slice(-2)
            const name = nameOf(g.plot)
            return (
              <g
                key={g.plot}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${g.plot}${name ? ` — Liệt sĩ ${name}` : ''}`}
                onClick={() => tool !== 'pan' && onSelect(g.plot)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(g.plot) } }}
                className="group cursor-pointer outline-none"
              >
                <title>{`${g.plot}\n${name ? `Liệt sĩ ${name}` : st === 'unknown' ? 'Chưa xác định danh tính' : 'Đã xác định · chưa có hồ sơ'}`}</title>
                <rect
                  {...r(g.x - PW, g.y - PL, g.x + PW, g.y + PL)}
                  rx={3}
                  className={`${c.body} transition-[stroke-width] duration-150 group-hover:stroke-[2.5] group-focus-visible:stroke-gold group-focus-visible:stroke-[3]`}
                  strokeWidth={st === 'conflict' || on ? 2 : 1.25}
                  strokeDasharray={st === 'unknown' && !on ? '3 2' : undefined}
                />
                <rect {...r(g.x - PW + 0.06, g.y - PL + 0.06, g.x + PW - 0.06, g.y - PL + 0.24)} rx={1.5} className={c.stone} />
                <text x={g.x * S} y={(g.y + 0.18) * S} textAnchor="middle" className={`pointer-events-none font-sans tabular-nums ${c.text}`} fontSize={9} fontWeight={on ? 700 : 500}>{num}</text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="absolute bottom-3 left-3 z-10 flex items-center rounded-lg border border-line bg-surface shadow-sm">
        <button aria-label="Thu nhỏ" onClick={() => setZoom((z) => clamp(z - 0.2))} className="grid size-8 place-items-center text-ink-soft hover:bg-canvas"><Minus className="size-4" /></button>
        <span className="w-12 text-center text-xs tabular-nums text-ink-soft">{Math.round(zoom * 100)}%</span>
        <button aria-label="Phóng to" onClick={() => setZoom((z) => clamp(z + 0.2))} className="grid size-8 place-items-center text-ink-soft hover:bg-canvas"><Plus className="size-4" /></button>
        <span className="h-5 w-px bg-line" />
        <button aria-label="Vừa khung" title="Vừa khung" onClick={fit} className="grid size-8 place-items-center text-ink-soft hover:bg-canvas"><Maximize2 className="size-3.5" /></button>
      </div>
      <ul className="absolute bottom-3 right-3 z-10 hidden flex-wrap gap-x-3 gap-y-1 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink-soft shadow-sm sm:flex">
        <Legend cls="border border-gold bg-gold-soft" label="Có hồ sơ" />
        <Legend cls="border border-line-strong bg-paper" label="Đã xác định" />
        <Legend cls="border border-dashed border-ink-mute bg-paper" label="Chưa xác định" />
        <Legend cls="border-2 border-heritage bg-heritage-tint" label="Xung đột" />
        <Legend cls="bg-heritage" label="Đang chọn" />
      </ul>
    </div>
  )
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return <li className="flex items-center gap-1.5 whitespace-nowrap"><span className={`h-3.5 w-2.5 rounded-[2px] ${cls}`} />{label}</li>
}

/** Màu ô mộ, cùng bảng màu với sơ đồ 2.5D công khai. */
const TONE: Record<PlotState | 'on', { body: string; stone: string; text: string }> = {
  profile: { body: 'fill-gold-soft stroke-gold', stone: 'fill-gold', text: 'fill-ink' },
  known: { body: 'fill-paper stroke-line-strong', stone: 'fill-gold-soft', text: 'fill-ink-soft' },
  unknown: { body: 'fill-paper stroke-ink-mute', stone: 'fill-line', text: 'fill-ink-mute' },
  conflict: { body: 'fill-heritage-tint stroke-heritage', stone: 'fill-heritage', text: 'fill-heritage-ink' },
  on: { body: 'fill-heritage stroke-heritage-deep', stone: 'fill-heritage-deep', text: 'fill-white' },
}

const S = 30 // px cho một đơn vị mặt bằng ở mức 100%
const PAD = 24
const clamp = (z: number) => Math.min(2, Math.max(0.35, +z.toFixed(2)))
