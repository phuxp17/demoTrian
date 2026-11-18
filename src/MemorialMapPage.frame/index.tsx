import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Navigation, Search, X } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { Breadcrumb, Button } from '../shared/components/ui'
import { KIND_META, MapLegend, MemorialMap } from '../shared/components/MemorialMap'
import { MAP_POINTS, type MapPoint } from '../shared/data'
import type { Navigate, PageKey } from '../shared/nav'
import { DirectionsButton } from '../shared/components/Actions'
import { matches } from '../shared/text'

export const args = {
  selected: 'c1',
}

export const argTypes = {
  selected: { control: 'select', options: ['', 'c1', 'c2', 'r1', 'r2', 'f1'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

const DETAIL: Record<MapPoint['kind'], PageKey> = { cemetery: 'cemetery', red: 'redAddress', family: 'family' }

export default function MemorialMapPage(props: Props) {
  const { selected, onNavigate } = { ...args, ...props }
  const [sel, setSel] = useState<string | null>(selected || null)
  const [layers, setLayers] = useState<MapPoint['kind'][]>(['cemetery', 'red', 'family'])
  const [q, setQ] = useState('')

  const visible = MAP_POINTS.filter((p) => layers.includes(p.kind) && matches(`${p.name} ${p.note}`, q))
  const point = MAP_POINTS.find((p) => p.id === sel)
  const toggle = (k: MapPoint['kind']) => setLayers((l) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]))

  return (
    <div className="flex h-screen min-h-[640px] flex-col bg-paper font-sans text-ink">
      <SiteHeader active="memorialMap" onNavigate={onNavigate} />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex max-h-[45%] min-h-0 flex-col border-b border-line md:max-h-none md:w-[320px] md:shrink-0 md:border-r md:border-b-0 lg:w-[380px]">
          <div className="border-b border-line p-5">
            <Breadcrumb items={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Bản đồ tri ân' }]} />
            <h1 className="mt-2 font-serif text-[1.8rem] leading-tight text-heritage-ink">Bản đồ tri ân</h1>
            <label className="relative mt-4 block">
              <span className="sr-only">Tìm địa điểm</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-mute" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm nghĩa trang, địa điểm, gia đình" className="h-12 w-full rounded-md border border-line-strong bg-paper pr-3 pl-11 focus:border-heritage focus:outline-none" />
            </label>
            <MapLegend className="mt-4" active={layers} onToggle={toggle} />
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {visible.map((p) => {
              const m = KIND_META[p.kind]
              return (
                <li key={p.id}>
                  <button onClick={() => setSel(p.id)} aria-pressed={sel === p.id} className={`flex w-full items-start gap-3 border-b border-line px-5 py-4 text-left transition-colors duration-150 ${sel === p.id ? 'bg-heritage-tint' : 'hover:bg-ivory'}`}>
                    <span className={`mt-1.5 h-3.5 w-3 shrink-0 rounded-t-full rounded-b-sm ${m.color}`} />
                    <span className="min-w-0">
                      <span className="block font-medium">{p.name}</span>
                      <span className="block text-[0.88rem] text-ink-mute">{p.note}</span>
                    </span>
                  </button>
                </li>
              )
            })}
            {visible.length === 0 && <li className="p-6 text-ink-soft">Không có địa điểm phù hợp.</li>}
          </ul>
        </aside>

        <section className="relative min-h-0 flex-1">
          <MemorialMap points={visible} selectedId={sel} onSelect={setSel} className="absolute inset-0" />
          <AnimatePresence>
            {point && (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="absolute right-4 bottom-4 left-4 max-w-sm rounded-md border border-line-strong bg-paper p-5 shadow-lg md:left-auto"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[0.85rem] font-medium text-gold">{KIND_META[point.kind].label}</p>
                    <h2 className="mt-1 font-serif text-[1.35rem] leading-snug">{point.name}</h2>
                    <p className="mt-1 text-ink-soft">{point.note}</p>
                  </div>
                  <button onClick={() => setSel(null)} className="-mt-2 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center text-ink-mute" aria-label="Đóng"><X className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" onClick={() => onNavigate?.(DETAIL[point.kind], { id: point.id })}>Xem chi tiết <ArrowRight className="h-4 w-4" /></Button>
                  <DirectionsButton place={point.name} variant="secondary" aria-label="Chỉ đường"><Navigation className="h-4 w-4" /></DirectionsButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  )
}
