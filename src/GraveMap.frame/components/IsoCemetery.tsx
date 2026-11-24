import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import type { Soldier } from '../../shared/data'

export type Layout = { rows: number; perRow: number }
export type Site = ReturnType<typeof buildSite>

type Props = {
  layout: Layout
  byPlot: Map<string, Soldier>
  selected: string | null
  /** Bump to scroll the selected grave into the middle of the view. */
  focusKey: number
  onSelect: (plot: string) => void
}

/**
 * Sơ đồ 2.5D: mặt bằng nghĩa trang chiếu isometric. Đài Tổ quốc ghi công ở phía sau,
 * cổng chính phía trước, lối giữa chia khu trái (A, C) và phải (B, D), lối ngang chia
 * khu sau (A, B) và khu trước (C, D). Bia mộ quay về phía cổng. Nắng chiếu từ bên trái
 * màn hình, nên bóng đổ sang phải dù xoay hướng nào.
 */
export function IsoCemetery({ layout, byPlot, selected, focusKey, onSelect }: Props) {
  const site = useMemo(() => buildSite(layout), [layout.rows, layout.perRow])
  const [zoom, setZoom] = useState(1)
  const proj = useMemo(() => makeProj(0, site.W, site.D), [site.W, site.D])
  const { P, pts, depth } = proj
  const vb = useMemo(() => viewBox(proj, site), [proj, site])
  const [hover, setHover] = useState<string | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  /** Điểm trên khung nhìn cần giữ nguyên chỗ khi đổi mức phóng. */
  const anchor = useRef<{ mx: number; my: number; fx: number; fy: number } | null>(null)
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const reduce = useReducedMotion()
  const sel = selected ? site.graves.find((g) => g.plot === selected) : undefined
  const hov = hover ? site.graves.find((g) => g.plot === hover) : undefined
  const cx = site.W / 2

  useEffect(() => {
    const el = scroller.current
    const inner = el?.firstElementChild as HTMLElement | null
    if (!el || !inner) return
    const [tx, ty] = sel ? P(sel.x, sel.y, 0) : P(site.W / 2, site.D / 2, 0)
    el.scrollTo({
      left: ((tx - vb.x) / vb.w) * inner.clientWidth - el.clientWidth / 2,
      top: ((ty - vb.y) / vb.h) * inner.clientHeight - el.clientHeight / 2,
      behavior: reduce ? 'auto' : 'smooth',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey, site])

  /** Đổi mức phóng, giữ điểm (mx, my) trong khung nhìn đứng yên. Mặc định là giữa khung. */
  const zoomTo = (next: (z: number) => number, mx?: number, my?: number) => {
    const el = scroller.current
    const inner = el?.firstElementChild as HTMLElement | null
    if (!el || !inner) return
    const ax = mx ?? el.clientWidth / 2
    const ay = my ?? el.clientHeight / 2
    anchor.current = { mx: ax, my: ay, fx: (el.scrollLeft + ax) / inner.offsetWidth, fy: (el.scrollTop + ay) / inner.offsetHeight }
    setZoom((z) => clampZoom(next(z)))
  }

  useLayoutEffect(() => {
    const el = scroller.current
    const inner = el?.firstElementChild as HTMLElement | null
    const a = anchor.current
    if (!el || !inner || !a) return
    el.scrollLeft = a.fx * inner.offsetWidth - a.mx
    el.scrollTop = a.fy * inner.offsetHeight - a.my
    anchor.current = null
  }, [zoom])

  // Cuộn chuột để phóng to/thu nhỏ quanh con trỏ. Cần listener không thụ động để chặn cuộn trang.
  const zoomToRef = useRef(zoomTo)
  zoomToRef.current = zoomTo
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      zoomToRef.current((z) => z * Math.exp(-dy * 0.0015), e.clientX - r.left, e.clientY - r.top)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Giữ chuột phải rồi kéo để di chuyển
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 2) return
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }
    setDragging(true)
    setHover(null)
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

  const objects: { depth: number; node: React.ReactNode }[] = []
  site.graves.forEach((g) => {
    const s = byPlot.get(g.plot)
    objects.push({
      depth: depth(g.x, g.y),
      node: (
        <Grave
          key={g.plot}
          g={g}
          tone={selected === g.plot ? 'on' : s ? 'profile' : g.unknown ? 'unknown' : 'known'}
          label={s ? `${g.plot} — Liệt sĩ ${s.name}` : g.unknown ? `${g.plot} — chưa xác định danh tính` : `${g.plot} — đã xác định`}
          onSelect={onSelect}
          onHover={setHover}
        />
      ),
    })
  })
  site.trees.forEach(([x, y], i) => objects.push({ depth: depth(x, y), node: <Tree key={`t${i}`} x={x} y={y} /> }))
  site.hedges.forEach((h, i) => objects.push({ depth: depth((h[0] + h[2]) / 2, (h[1] + h[3]) / 2), node: <Hedge key={`h${i}`} r={h} /> }))
  objects.push({ depth: depth(cx, MEM_Y), node: <Memorial key="mem" x={cx} y={MEM_Y} /> })
  objects.push({ depth: depth(cx, site.D - 1), node: <Gate key="gate" x={cx} y={site.D - 1} /> })
  objects.sort((a, b) => a.depth - b.depth)

  const pct = (x: number, y: number, z: number) => {
    const [sx, sy] = P(x, y, z)
    return { left: `${((sx - vb.x) / vb.w) * 100}%`, top: `${((sy - vb.y) / vb.h) * 100}%` }
  }

  return (
    <section className="relative flex min-w-0 flex-col overflow-hidden rounded-md border border-line-strong bg-parchment">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-strong bg-paper/80 px-4 py-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.85rem] text-ink-soft">
          <li className="flex items-center gap-2"><Swatch className="bg-gold" /> Có hồ sơ trực tuyến</li>
          <li className="flex items-center gap-2"><Swatch className="bg-gold-soft" /> Đã xác định</li>
          <li className="flex items-center gap-2"><Swatch className="border border-dashed border-ink-mute bg-paper" /> Chưa xác định danh tính</li>
          <li className="flex items-center gap-2"><Swatch className="bg-heritage" /> Đang chọn</li>
        </ul>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="hidden text-[0.82rem] whitespace-nowrap text-ink-mute md:block">Cuộn để phóng · Giữ chuột phải để kéo</p>
          <div className="flex items-center gap-1">
            <button onClick={() => zoomTo((z) => z - 0.4)} disabled={zoom <= MIN_ZOOM} className="flex h-10 w-10 items-center justify-center rounded-md border border-line-strong bg-paper transition-colors duration-150 hover:border-gold disabled:opacity-40" aria-label="Thu nhỏ"><Minus className="h-4 w-4" /></button>
            <span className="w-12 text-center text-[0.85rem] tabular-nums text-ink-soft">{Math.round(zoom * 100)}%</span>
            <button onClick={() => zoomTo((z) => z + 0.4)} disabled={zoom >= MAX_ZOOM} className="flex h-10 w-10 items-center justify-center rounded-md border border-line-strong bg-paper transition-colors duration-150 hover:border-gold disabled:opacity-40" aria-label="Phóng to"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onContextMenu={(e) => e.preventDefault()}
        className={`max-h-[640px] overflow-auto overscroll-contain ${dragging ? 'cursor-grabbing [&_*]:cursor-grabbing' : ''}`}
      >
        <div className="relative min-w-[760px]" style={{ width: `${zoom * 100}%` }}>
          <ProjCtx.Provider value={proj}>
            <svg
              viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
              className="block h-auto w-full select-none"
              role="group"
              aria-label="Sơ đồ phần mộ dạng 2.5D, nhìn từ cổng chính"
            >
              {/* Sa bàn: mặt cỏ, viền cỏ mỏng, rồi lớp đất bên dưới */}
              {(() => {
                const [w, d] = proj.size
                return (
                  <>
                    <polygon points={ptsQ([[w, 0, -LIP], [w, d, -LIP], [w, d, -SLAB], [w, 0, -SLAB]])} className="fill-gold/80" />
                    <polygon points={ptsQ([[0, d, -LIP], [w, d, -LIP], [w, d, -SLAB], [0, d, -SLAB]])} className="fill-gold/55" />
                    <polygon points={ptsQ([[w, 0, 0], [w, d, 0], [w, d, -LIP], [w, 0, -LIP]])} className="fill-jade/85" />
                    <polygon points={ptsQ([[0, d, 0], [w, d, 0], [w, d, -LIP], [0, d, -LIP]])} className="fill-jade/65" />
                    <polygon points={ptsQ([[0, 0, 0], [w, 0, 0], [w, d, 0], [0, d, 0]])} className="fill-jade/20" />
                  </>
                )
              })()}

              {/* Thảm cỏ từng khu, viền đá sáng như bó vỉa */}
              {site.zones.map((z) => (
                <polygon key={z.id} points={pts([[z.x0 - 0.3, z.y0 - 0.3, 0], [z.x0 + site.zoneW + 0.3, z.y0 - 0.3, 0], [z.x0 + site.zoneW + 0.3, z.y0 + site.zoneD + 0.3, 0], [z.x0 - 0.3, z.y0 + site.zoneD + 0.3, 0]])} className="fill-jade/15 stroke-paper" strokeWidth={2} strokeLinejoin="round" />
              ))}

              {/* Lối đi lát đá, có mạch ngang */}
              {site.paths.map((r, i) => (
                <polygon key={i} points={pts([[r[0], r[1], 0], [r[2], r[1], 0], [r[2], r[3], 0], [r[0], r[3], 0]])} className="fill-paper stroke-line-strong" strokeWidth={0.75} strokeLinejoin="round" />
              ))}
              <g className="stroke-line" strokeWidth={0.7}>
                {site.joints.map(([x0, y0, x1, y1], i) => {
                  const [a, b] = P(x0, y0, 0)
                  const [c, d] = P(x1, y1, 0)
                  return <line key={i} x1={a} y1={b} x2={c} y2={d} />
                })}
              </g>

              {/* Bóng đổ: vẽ trước mọi vật thể, nên luôn nằm dưới chúng */}
              <g className="pointer-events-none fill-ink/10">
                {site.graves.map((g) => (
                  <Shadow key={g.plot} x0={g.x - PW} y0={g.y - PL} x1={g.x + PW} y1={g.y + PL} h={PH + HH * 0.5} />
                ))}
                {site.hedges.map((h, i) => <Shadow key={`h${i}`} x0={h[0]} y0={h[1]} x1={h[2]} y1={h[3]} h={HEDGE} />)}
                <Shadow x0={cx - 0.55} y0={MEM_Y - 0.4} x1={cx + 0.55} y1={MEM_Y + 0.4} h={4.2} />
                <Shadow x0={cx - 2.0} y0={site.D - 1.3} x1={cx - 1.4} y1={site.D - 0.7} h={2.2} />
                <Shadow x0={cx + 1.4} y0={site.D - 1.3} x1={cx + 2.0} y1={site.D - 0.7} h={2.2} />
                {site.trees.map(([x, y], i) => <TreeShadow key={`t${i}`} x={x} y={y} />)}
              </g>

              <AnimatePresence>
                {sel && (
                  <motion.polyline
                    key={sel.plot}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    points={pts([[cx, site.D - 1.6, 0], [cx, sel.y + AISLE, 0], [sel.x, sel.y + AISLE, 0], [sel.x, sel.y + 0.7, 0]])}
                    className="fill-none stroke-heritage"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </AnimatePresence>

              {objects.map((o) => o.node)}

              {/* Nhãn */}
              <g className="pointer-events-none font-sans" style={{ paintOrder: 'stroke' }}>
                {site.zones.map((z) => {
                  const corners = [[z.x0, z.y0], [z.x0 + site.zoneW, z.y0], [z.x0, z.y0 + site.zoneD], [z.x0 + site.zoneW, z.y0 + site.zoneD]].map(([qx, qy]) => P(qx, qy, 0))
                  const [x, y0] = corners.reduce((a, b) => (b[1] < a[1] ? b : a))
                  return (
                    <text key={z.id} x={x} y={y0 - 12} textAnchor="middle" className="fill-heritage-ink stroke-paper font-serif" strokeWidth={4} fontSize={17} fontWeight={600}>Khu {z.id}</text>
                  )
                })}
                {site.zones.filter((z) => z.left).flatMap((z) =>
                  Array.from({ length: layout.rows }, (_, r) => {
                    const [x, y] = P(z.x0 - 0.75, z.y0 + (r + 0.5) * ROW, 0)
                    return <text key={`${z.id}${r}`} x={x} y={y + 4} textAnchor="middle" className="fill-ink-soft stroke-paper" strokeWidth={3} fontSize={11} fontWeight={500}>H{r + 1}</text>
                  }),
                )}
                {(() => {
                  const [mx, my] = P(cx, MEM_Y, 6.6)
                  const [gx, gy] = P(cx, site.D - 1, 3.3)
                  return (
                    <>
                      <text x={mx} y={my - 6} textAnchor="middle" className="fill-heritage-ink stroke-paper" strokeWidth={4} fontSize={13} fontWeight={600}>Đài Tổ quốc ghi công</text>
                      <text x={gx} y={gy - 8} textAnchor="middle" className="fill-heritage-ink stroke-paper" strokeWidth={4} fontSize={13} fontWeight={600}>Cổng chính</text>
                    </>
                  )
                })()}
              </g>

              <AnimatePresence>
                {sel && <Pin key={sel.plot} x={sel.x} y={sel.y - PL + 0.14} z={PH + HH + CAP + 0.25} />}
              </AnimatePresence>
            </svg>
          </ProjCtx.Provider>

          <AnimatePresence>
            {hov && !dragging && hov.plot !== selected && (
              <motion.div
                key={hov.plot}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-md bg-heritage-ink px-3 py-2 text-[0.82rem] whitespace-nowrap text-paper shadow-md"
                style={pct(hov.x, hov.y - PL, PH + HH)}
              >
                <span className="block text-gold-pale">{hov.plot}</span>
                {byPlot.get(hov.plot) ? `Liệt sĩ ${byPlot.get(hov.plot)!.name}` : hov.unknown ? 'Chưa xác định danh tính' : 'Đã xác định · chưa có hồ sơ'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/** Lời chỉ đường bằng chữ, đi từ cổng chính vào. */
export function wayfinding(plot: string, layout: Layout) {
  const m = plot.match(/Khu (\w) · Hàng (\d+) · Mộ (\d+)/)
  if (!m) return ''
  const [, zone, row, num] = m
  const left = zone === 'A' || zone === 'C'
  const back = zone === 'A' || zone === 'B'
  const k = left ? layout.perRow - Number(num) + 1 : Number(num)
  return `Vào cổng chính, đi thẳng theo lối giữa${back ? ', qua lối ngang' : ''}. Đến Hàng ${row}, rẽ ${left ? 'trái' : 'phải'} — phần mộ thứ ${k} tính từ lối giữa.`
}

function Swatch({ className }: { className: string }) {
  return <span className={`h-4 w-3 rounded-t-[3px] ${className}`} />
}

type Tone = 'on' | 'profile' | 'known' | 'unknown'

function Grave({ g, tone, label, onSelect, onHover }: { g: GraveCell; tone: Tone; label: string; onSelect: (p: string) => void; onHover: (p: string | null) => void }) {
  const { x, y } = g
  const { pts, P, rot } = useProj()
  const plinth = tone === 'on' ? ['fill-heritage-tint', 'fill-heritage/35', 'fill-heritage/55'] : ['fill-ivory', 'fill-line', 'fill-line-strong']
  const stone = {
    on: ['fill-heritage', 'fill-heritage', 'fill-heritage-deep'],
    profile: ['fill-gold-soft', 'fill-gold', 'fill-ink-mute'],
    known: ['fill-paper', 'fill-gold-soft', 'fill-gold'],
    unknown: ['fill-paper', 'fill-paper', 'fill-line'],
  }[tone]
  const cap = tone === 'on' ? ['fill-heritage-deep', 'fill-heritage-deep', 'fill-heritage-ink'] : ['fill-ivory', 'fill-line', 'fill-line-strong']
  const hy0 = y - PL + 0.06
  const hy1 = hy0 + 0.16
  // Mặt bia (hướng về cổng) chỉ thấy được khi nó quay về phía người xem
  const faceSeen = rot === 0 || rot === 3
  const [sx, sy] = P(x, hy1 + 0.005, PH + HH * 0.72)
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={tone === 'on'}
      onClick={() => onSelect(g.plot)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(g.plot) } }}
      onMouseEnter={() => onHover(g.plot)}
      onMouseLeave={() => onHover(null)}
      className="group cursor-pointer outline-none"
    >
      <polygon points={pts([[x - COL / 2, y - ROW / 2, 0], [x + COL / 2, y - ROW / 2, 0], [x + COL / 2, y + ROW / 2, 0], [x - COL / 2, y + ROW / 2, 0]])} className="fill-transparent group-focus-visible:fill-gold/30" />
      <g className="transition-transform duration-150 ease-out group-hover:-translate-y-[3px]">
        <Box x0={x - PW} y0={y - PL} x1={x + PW} y1={y + PL} z0={0} z1={PH} cls={plinth} />
        {/* Mặt nấm mộ: ô đá lát nhỏ hơn một chút cho thấy gờ viền */}
        <polygon points={pts([[x - PW + 0.08, hy1 + 0.08, PH], [x + PW - 0.08, hy1 + 0.08, PH], [x + PW - 0.08, y + PL - 0.08, PH], [x - PW + 0.08, y + PL - 0.08, PH]])} className={tone === 'on' ? 'fill-heritage/15' : 'fill-line/70'} />
        <Box x0={x - 0.3} y0={hy0} x1={x + 0.3} y1={hy1} z0={PH} z1={PH + HH} cls={stone} dashed={tone === 'unknown'} />
        <Box x0={x - 0.35} y0={hy0 - 0.03} x1={x + 0.35} y1={hy1 + 0.03} z0={PH + HH} z1={PH + HH + CAP} cls={cap} />
        {faceSeen && tone !== 'unknown' && (
          <path d={starPath(sx, sy, 2.4)} className={tone === 'on' ? 'fill-gold-pale' : 'fill-heritage'} />
        )}
      </g>
    </g>
  )
}

function Memorial({ x, y }: { x: number; y: number }) {
  const { pts, R, rot } = useProj()
  const step = ['fill-paper', 'fill-line', 'fill-line-strong']
  const stone = ['fill-ivory', 'fill-paper', 'fill-line-strong']
  const fy = y + 0.4
  const star = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const r = i % 2 === 0 ? 0.24 : 0.1
    return [x + Math.cos(a) * r, fy + 0.001, 3.6 - Math.sin(a) * r * 1.2] as V
  })
  return (
    <g>
      <Box x0={x - 3.2} y0={y - 2.4} x1={x + 3.2} y1={y + 2.4} z0={0} z1={0.25} cls={step} />
      <Box x0={x - 2.4} y0={y - 1.7} x1={x + 2.4} y1={y + 1.7} z0={0.25} z1={0.5} cls={step} />
      <Box x0={x - 1.6} y0={y - 1.1} x1={x + 1.6} y1={y + 1.1} z0={0.5} z1={0.75} cls={step} />
      <Box x0={x - 0.55} y0={y - 0.4} x1={x + 0.55} y1={y + 0.4} z0={0.75} z1={5.6} cls={stone} />
      {(() => {
        // Mái chóp: chỉ vẽ hai mặt hướng về người xem, tính trong hệ đã xoay
        const [a0, b0] = R(x - 0.55, y - 0.4)
        const [a1, b1] = R(x + 0.55, fy)
        const [ax0, ax1, by0, by1] = [Math.min(a0, a1), Math.max(a0, a1), Math.min(b0, b1), Math.max(b0, b1)]
        const [qx, qy] = R(x, y)
        return (
          <>
            <polygon points={ptsQ([[ax0, by1, 5.6], [ax1, by1, 5.6], [qx, qy, 6.4]])} className="fill-line stroke-ink/15" strokeWidth={0.5} />
            <polygon points={ptsQ([[ax1, by1, 5.6], [ax1, by0, 5.6], [qx, qy, 6.4]])} className="fill-line-strong stroke-ink/15" strokeWidth={0.5} />
          </>
        )
      })()}
      {/* Mặt trước của đài (quay về cổng) chỉ thấy khi nó hướng về người xem */}
      {(rot === 0 || rot === 3) && (
        <>
          <polygon points={pts([[x - 0.4, fy, 2.2], [x + 0.4, fy, 2.2], [x + 0.4, fy, 4.6], [x - 0.4, fy, 4.6]])} className="fill-heritage" />
          <polygon points={pts(star)} className="fill-gold-pale" />
        </>
      )}
      {/* Lư hương và hai bồn hoa trước đài */}
      <Box x0={x - 0.35} y0={y + 1.9} x1={x + 0.35} y1={y + 2.5} z0={0.25} z1={0.85} cls={['fill-gold-soft', 'fill-gold', 'fill-ink-mute']} />
      <Box x0={x - 2.7} y0={y + 1.75} x1={x - 1.7} y1={y + 2.25} z0={0.25} z1={0.5} cls={['fill-heritage/80', 'fill-line', 'fill-line-strong']} />
      <Box x0={x + 1.7} y0={y + 1.75} x1={x + 2.7} y1={y + 2.25} z0={0.25} z1={0.5} cls={['fill-heritage/80', 'fill-line', 'fill-line-strong']} />
    </g>
  )
}

function Gate({ x, y }: { x: number; y: number }) {
  const pillar = ['fill-ivory', 'fill-paper', 'fill-line-strong']
  const roof = ['fill-heritage', 'fill-heritage', 'fill-heritage-deep']
  return (
    <g>
      <Box x0={x - 2.1} y0={y - 0.4} x1={x - 1.3} y1={y + 0.4} z0={0} z1={0.2} cls={pillar} />
      <Box x0={x + 1.3} y0={y - 0.4} x1={x + 2.1} y1={y + 0.4} z0={0} z1={0.2} cls={pillar} />
      <Box x0={x - 2.0} y0={y - 0.3} x1={x - 1.4} y1={y + 0.3} z0={0.2} z1={2.6} cls={pillar} />
      <Box x0={x + 1.4} y0={y - 0.3} x1={x + 2.0} y1={y + 0.3} z0={0.2} z1={2.6} cls={pillar} />
      <Box x0={x - 2.3} y0={y - 0.45} x1={x + 2.3} y1={y + 0.45} z0={2.6} z1={2.95} cls={roof} />
      <Box x0={x - 1.9} y0={y - 0.3} x1={x + 1.9} y1={y + 0.3} z0={2.95} z1={3.15} cls={['fill-gold-soft', 'fill-gold', 'fill-ink-mute']} />
    </g>
  )
}

function Hedge({ r }: { r: [number, number, number, number] }) {
  return <Box x0={r[0]} y0={r[1]} x1={r[2]} y1={r[3]} z0={0} z1={HEDGE} cls={['fill-jade/60', 'fill-jade/80', 'fill-jade']} soft />
}

function Tree({ x, y }: { x: number; y: number }) {
  const { P } = useProj()
  const [bx, by] = P(x, y, 1.0)
  const [, ty] = P(x, y, 3.0)
  const my = (by + ty) / 2
  const ry = (by - ty) / 2
  return (
    <g className="pointer-events-none">
      <Box x0={x - 0.07} y0={y - 0.07} x1={x + 0.07} y1={y + 0.07} z0={0} z1={1.0} cls={['fill-ink-mute', 'fill-ink-mute', 'fill-ink-soft']} />
      {/* Tán cây: ba khối chồng nhau, sáng dần lên phía nắng */}
      <ellipse cx={bx + 2} cy={my + 3} rx={7.5} ry={ry * 0.8} className="fill-jade" />
      <ellipse cx={bx - 3} cy={my + 1} rx={6.5} ry={ry * 0.75} className="fill-jade" />
      <ellipse cx={bx} cy={my - 3} rx={6.5} ry={ry * 0.75} className="fill-jade" />
      <ellipse cx={bx - 2.5} cy={my - 4.5} rx={3} ry={ry * 0.35} className="fill-paper/20" />
    </g>
  )
}

function TreeShadow({ x, y }: { x: number; y: number }) {
  const { P } = useProj()
  const [sx, sy] = P(x, y, 0)
  return <ellipse cx={sx + 12} cy={sy + 1} rx={11} ry={5} />
}

/** Bóng của một khối hộp cao h, đổ sang phải màn hình. Toạ độ thế giới. */
function Shadow({ x0: wx0, y0: wy0, x1: wx1, y1: wy1, h }: { x0: number; y0: number; x1: number; y1: number; h: number }) {
  const { R } = useProj()
  const [a0, b0] = R(wx0, wy0)
  const [a1, b1] = R(wx1, wy1)
  const [x0, x1, y0, y1] = [Math.min(a0, a1), Math.max(a0, a1), Math.min(b0, b1), Math.max(b0, b1)]
  const dx = h * 0.45
  const dy = -h * 0.3
  return <polygon points={ptsQ([[x0, y0, 0], [x0 + dx, y0 + dy, 0], [x1 + dx, y0 + dy, 0], [x1 + dx, y1 + dy, 0], [x1, y1, 0], [x0, y1, 0]])} />
}

function Pin({ x, y, z }: { x: number; y: number; z: number }) {
  const { P } = useProj()
  const [px, py] = P(x, y, z)
  return (
    <motion.g
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="pointer-events-none"
    >
      <path d={`M ${px} ${py} l -7 -11 a 8 8 0 1 1 14 0 z`} className="fill-heritage stroke-paper" strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={px} cy={py - 16} r={3} className="fill-paper" />
    </motion.g>
  )
}

function Box({ x0: wx0, y0: wy0, x1: wx1, y1: wy1, z0, z1, cls, dashed, soft }: { x0: number; y0: number; x1: number; y1: number; z0: number; z1: number; cls: string[]; dashed?: boolean; soft?: boolean }) {
  // Hộp nằm thẳng theo trục, nên sau khi xoay vẫn thẳng trục: lấy lại khung trong hệ đã xoay
  const { R } = useProj()
  const [a0, b0] = R(wx0, wy0)
  const [a1, b1] = R(wx1, wy1)
  const [x0, x1, y0, y1] = [Math.min(a0, a1), Math.max(a0, a1), Math.min(b0, b1), Math.max(b0, b1)]
  const stroke = dashed ? 'stroke-ink-mute' : soft ? 'stroke-transparent' : 'stroke-ink/15'
  const dash = dashed ? '2 1.5' : undefined
  return (
    <>
      <polygon points={ptsQ([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} className={`${cls[1]} ${stroke} transition-colors duration-150`} strokeWidth={0.6} strokeDasharray={dash} strokeLinejoin="round" />
      <polygon points={ptsQ([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]])} className={`${cls[2]} ${stroke} transition-colors duration-150`} strokeWidth={0.6} strokeDasharray={dash} strokeLinejoin="round" />
      <polygon points={ptsQ([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} className={`${cls[0]} ${stroke} transition-colors duration-150`} strokeWidth={0.6} strokeDasharray={dash} strokeLinejoin="round" />
    </>
  )
}

function starPath(cx: number, cy: number, r: number) {
  return (
    Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5
      const k = i % 2 === 0 ? r : r * 0.42
      return `${i ? 'L' : 'M'} ${(cx + Math.cos(a) * k).toFixed(1)} ${(cy + Math.sin(a) * k).toFixed(1)}`
    }).join(' ') + ' Z'
  )
}

/* ——— Hình học ——— */

type V = [number, number, number]
type Zone = { id: string; x0: number; y0: number; left: boolean }
type GraveCell = { plot: string; x: number; y: number; unknown: boolean }

const TW = 26 // bề ngang một ô đất trên màn hình
const TH = 13
const ZH = 15 // một đơn vị chiều cao
export const COL = 1.1 // khoảng cách mộ trong hàng
export const ROW = 2.1 // khoảng cách giữa các hàng
const MARGIN = 1.6
const AXIS = 2.6
const PLAZA = 7.6
const CROSS = 2.4
const FRONT = 4.6
export const MEM_Y = 3.6
export const AISLE = 1.05
const SLAB = 0.7
const LIP = 0.14 // viền cỏ trên mép sa bàn
export const PW = 0.36 // nửa bề rộng nấm mộ
export const PL = 0.62 // nửa chiều dài nấm mộ
const PH = 0.2
const HH = 0.9 // chiều cao bia
const CAP = 0.08 // mũ bia
const HEDGE = 0.35

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +z.toFixed(2)))

/** Chiếu isometric một điểm đã nằm trong hệ toạ độ đã xoay. */
function Q(x: number, y: number, z: number): [number, number] {
  return [((x - y) * TW) / 2, ((x + y) * TH) / 2 - z * ZH]
}

function ptsQ(vs: V[]) {
  return vs.map(([x, y, z]) => Q(x, y, z).map((n) => n.toFixed(1)).join(',')).join(' ')
}

type Proj = ReturnType<typeof makeProj>

/** Xoay mặt bằng (W × D) quanh tâm theo bước 90°, rồi chiếu. */
function makeProj(rot: number, W: number, D: number) {
  const R = (x: number, y: number): [number, number] => {
    switch (rot) {
      case 1: return [D - y, x]
      case 2: return [W - x, D - y]
      case 3: return [y, W - x]
      default: return [x, y]
    }
  }
  const P = (x: number, y: number, z: number) => {
    const [a, b] = R(x, y)
    return Q(a, b, z)
  }
  return {
    rot,
    R,
    P,
    pts: (vs: V[]) => vs.map(([x, y, z]) => P(x, y, z).map((n) => n.toFixed(1)).join(',')).join(' '),
    /** Thứ tự vẽ: xa trước, gần sau. */
    depth: (x: number, y: number) => R(x, y).reduce((a, b) => a + b, 0),
    size: (rot % 2 ? [D, W] : [W, D]) as [number, number],
  }
}

const ProjCtx = createContext<Proj | null>(null)

function useProj() {
  const p = useContext(ProjCtx)
  if (!p) throw new Error('IsoCemetery parts must render inside ProjCtx')
  return p
}

function viewBox(proj: Proj, site: { W: number; D: number }) {
  const [w, d] = proj.size
  const left = Q(0, d, 0)[0]
  const right = Q(w, 0, 0)[0]
  const top = Math.min(Q(0, 0, 0)[1], proj.P(site.W / 2, MEM_Y, 6.6)[1] - 26, proj.P(site.W / 2, site.D - 1, 3.3)[1] - 30)
  const bottom = Q(w, d, -SLAB)[1] + 34
  const pad = 30
  return { x: left - pad, y: top - pad, w: right - left + pad * 2, h: bottom - top + pad }
}

export function buildSite({ rows, perRow }: Layout) {
  const zoneW = perRow * COL
  const zoneD = rows * ROW
  const W = MARGIN * 2 + zoneW * 2 + AXIS
  const yBack = PLAZA
  const yFront = PLAZA + zoneD + CROSS
  const D = yFront + zoneD + FRONT
  const right = MARGIN + zoneW + AXIS
  const zones: Zone[] = [
    { id: 'A', x0: MARGIN, y0: yBack, left: true },
    { id: 'B', x0: right, y0: yBack, left: false },
    { id: 'C', x0: MARGIN, y0: yFront, left: true },
    { id: 'D', x0: right, y0: yFront, left: false },
  ]
  const graves: GraveCell[] = zones.flatMap((z, zi) =>
    Array.from({ length: rows }, (_, r) =>
      Array.from({ length: perRow }, (_, g) => ({
        plot: `Khu ${z.id} · Hàng ${r + 1} · Mộ ${String(g + 1).padStart(2, '0')}`,
        x: z.x0 + (g + 0.5) * COL,
        y: z.y0 + (r + 0.5) * ROW,
        unknown: (g * 7 + r * 3 + zi * 5 + perRow) % 11 === 0,
      })),
    ).flat(),
  )
  const cx = W / 2
  const axis: [number, number] = [cx - AXIS / 2 + 0.25, cx + AXIS / 2 - 0.25]
  const paths: [number, number, number, number][] = [
    [MARGIN, 0.8, W - MARGIN, PLAZA - 0.6],
    [axis[0], PLAZA - 0.6, axis[1], D - 0.2],
    [MARGIN - 0.4, yBack + zoneD + 0.5, W - MARGIN + 0.4, yFront - 0.5],
    [cx - 4, D - FRONT + 1.2, cx + 4, D - 0.2],
  ]
  // Mạch lát ngang trên lối giữa
  const joints: [number, number, number, number][] = []
  for (let y = PLAZA + 0.4; y < D - FRONT + 1.2; y += 1.2) joints.push([axis[0], y, axis[1], y])

  // Hàng rào cây thấp hai bên sân Đài, chia thành đoạn ngắn để xếp lớp đúng
  const hedges: [number, number, number, number][] = []
  for (let y = 1.4; y < PLAZA - 1.4; y += 1.3) {
    hedges.push([cx - 4.4, y, cx - 3.9, y + 1.1], [cx + 3.9, y, cx + 4.4, y + 1.1])
  }

  const trees: [number, number][] = [
    [MARGIN + 0.6, 1.6], [MARGIN + 0.6, 5.6], [W - MARGIN - 0.6, 1.6], [W - MARGIN - 0.6, 5.6],
    [cx - 5.4, D - 2.4], [cx + 5.4, D - 2.4],
  ]
  for (let ty = yBack + 1; ty < D - FRONT; ty += 4.2) trees.push([0.7, ty], [W - 0.7, ty])

  return { W, D, zoneW, zoneD, zones, graves, paths, joints, hedges, trees }
}
