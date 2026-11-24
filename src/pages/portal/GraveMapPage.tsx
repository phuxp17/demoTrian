import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Footprints, Search, X } from 'lucide-react'
import { SiteHeader } from '@/components/layout'
import { IsoCemetery, wayfinding } from '@/features/cemetery'
import { ContributeButton } from '@/features/contribute'
import { DirectionsButton } from '@/features/actions'
import { Breadcrumb, Button, Portrait } from '@/components/ui'
import { CEMETERIES, SOLDIERS, type Soldier } from '@/data/portal.mock'
import type { Navigate } from '@/config/portalNav'

export const args = {
  cemeteryIndex: 0,
  selected: 'Khu A · Hàng 2 · Mộ 07',
}

export const argTypes = {
  cemeteryIndex: { control: 'select', options: [0, 1, 2, 3] },
  selected: { control: 'text' },
}

/** recordId is a soldier (opens their cemetery with their grave picked) or a cemetery. */
type Props = Partial<typeof args> & { onNavigate?: Navigate; recordId?: string }

export default function GraveMap(props: Props) {
  const { cemeteryIndex, selected, onNavigate, recordId } = { ...args, ...props }
  const fromSoldier = SOLDIERS.find((s) => s.id === recordId)
  const cem =
    (fromSoldier && CEMETERIES.find((c) => c.name === fromSoldier.cemetery)) ||
    CEMETERIES.find((c) => c.id === recordId) ||
    CEMETERIES[cemeteryIndex] ||
    CEMETERIES[0]
  const [sel, setSel] = useState<string | null>(fromSoldier ? fromSoldier.plot : recordId ? null : selected)
  const [missed, setMissed] = useState(false)
  const [focusKey, setFocusKey] = useState(0)
  const [q, setQ] = useState('')

  const byPlot = useMemo(() => {
    const m = new Map<string, Soldier>()
    SOLDIERS.filter((s) => s.cemetery === cem.name).forEach((s) => m.set(s.plot, s))
    return m
  }, [cem.name])
  const match = q.trim() ? Array.from(byPlot.values()).find((s) => s.name.toLowerCase().includes(q.trim().toLowerCase())) : undefined
  const selSoldier = sel ? byPlot.get(sel) : undefined

  return (
    <div className="flex min-h-full flex-col bg-paper font-sans text-ink">
      <SiteHeader active="graveMap" onNavigate={onNavigate} />

      <div className="border-b border-line bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Breadcrumb items={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Nghĩa trang', onClick: () => onNavigate?.('cemeteries') }, { label: cem.name, onClick: () => onNavigate?.('cemetery', { id: cem.id }) }, { label: 'Sơ đồ phần mộ' }]} />
            <h1 className="mt-2 font-serif text-[1.9rem] leading-tight text-heritage-ink md:text-[2.3rem]">Sơ đồ phần mộ · {cem.name}</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setMissed(!match && !!q.trim()); if (match) { setSel(match.plot); setFocusKey((k) => k + 1) } }} className="relative flex w-full gap-2 lg:w-[420px]">
            <label className="relative flex-1">
              <span className="sr-only">Tìm phần mộ theo tên</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-mute" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setMissed(false) }} placeholder="Tìm mộ theo tên liệt sĩ" className="h-12 w-full rounded-md border border-line-strong bg-paper pr-3 pl-11 focus:border-heritage focus:outline-none" />
            </label>
            <Button type="submit" className="h-12">Định vị</Button>
            {missed && (
              <p role="status" className="absolute top-full left-0 mt-1.5 text-[0.88rem] text-heritage">
                Không thấy tên này trong nghĩa trang. Thử <button type="button" onClick={() => onNavigate?.('soldiers', { query: q.trim() })} className="underline underline-offset-2">tra cứu toàn xã</button>.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-5 py-6 md:px-8 lg:grid-cols-[1fr_340px]">
        <div className="flex min-w-0 flex-col">
          <IsoCemetery layout={cem.layout} byPlot={byPlot} selected={sel} focusKey={focusKey} onSelect={setSel} />
        </div>
        <AnimatePresence mode="wait">
          <motion.aside
            key={sel ?? 'none'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="min-w-0 self-start rounded-md border border-line-strong bg-ivory p-6"
            aria-live="polite"
          >
            {sel ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[0.95rem] font-medium text-gold">{sel}</p>
                  <button onClick={() => setSel(null)} className="-mt-2 -mr-2 flex h-10 w-10 items-center justify-center text-ink-mute" aria-label="Bỏ chọn"><X className="h-4 w-4" /></button>
                </div>
                {wayfinding(sel, cem.layout) && (
                  <p className="mt-3 flex gap-2.5 border-l-2 border-heritage pl-3 text-[0.92rem] leading-relaxed text-ink-soft">
                    <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-heritage" aria-hidden />
                    {wayfinding(sel, cem.layout)}
                  </p>
                )}
                {selSoldier ? (
                  <>
                    <div className="mt-4 flex gap-4">
                      <Portrait name={selSoldier.name} className="h-28 w-22 shrink-0 [&_span]:hidden" />
                      <div>
                        <h2 className="font-serif text-[1.45rem] leading-snug text-heritage-ink">Liệt sĩ {selSoldier.name}</h2>
                        <p className="mt-1 text-ink-soft">{selSoldier.born} – {selSoldier.died}</p>
                        <p className="text-ink-soft">{selSoldier.rank}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                      <Button onClick={() => onNavigate?.('soldier', { id: selSoldier.id })}>Xem hồ sơ liệt sĩ</Button>
                      <DirectionsButton place={cem.name}>Chỉ đường đến nghĩa trang</DirectionsButton>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 font-serif text-[1.35rem] text-heritage-ink">Thông tin đang được cập nhật</h2>
                    <p className="mt-2 leading-relaxed text-ink-soft">Phần mộ này chưa có hồ sơ trực tuyến. Nếu gia đình có thông tin, xin vui lòng liên hệ Ban quản lý nghĩa trang.</p>
                    <ContributeButton variant="secondary" className="mt-5 w-full" topic="Bổ sung thông tin" subject={`${sel}, ${cem.name}`}>Gửi thông tin</ContributeButton>
                  </>
                )}
              </>
            ) : (
              <>
                <h2 className="font-serif text-[1.35rem] text-heritage-ink">Chọn một phần mộ</h2>
                <p className="mt-2 leading-relaxed text-ink-soft">Bấm vào một ô mộ trên sơ đồ, hoặc tìm theo tên liệt sĩ để định vị nhanh.</p>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
                  <div><dt className="text-[0.85rem] text-ink-mute">Tổng số mộ</dt><dd className="font-serif text-2xl">{cem.graves}</dd></div>
                  <div><dt className="text-[0.85rem] text-ink-mute">Đã xác định</dt><dd className="font-serif text-2xl">{cem.identified}</dd></div>
                </dl>
              </>
            )}
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  )
}
