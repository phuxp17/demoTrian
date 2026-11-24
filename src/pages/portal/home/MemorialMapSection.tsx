import React, { useState } from 'react'
import { ArrowRight, Flag, House, Landmark, MapPin } from 'lucide-react'
import { LineArt } from '@/components/ornaments'
import { Button, Container } from '@/components/ui'
import type { Navigate } from '@/config/portalNav'
import { LINE_ART, MAP_POINTS } from '@/data/portal.mock'
import { MemorialMap } from '@/features/memorial-map'

const MAP_LAYERS = [
  { l: 'Nghĩa trang liệt sĩ', i: <Landmark className="h-4 w-4" />, p: 'cemeteries' as const },
  { l: 'Địa chỉ đỏ', i: <MapPin className="h-4 w-4" />, p: 'redAddresses' as const },
  { l: 'Di tích lịch sử', i: <Flag className="h-4 w-4" />, p: 'redAddresses' as const },
  { l: 'Gia đình có công', i: <House className="h-4 w-4" />, p: 'merit' as const },
]

export function MemorialMapSection({ soft, onNavigate }: { soft: boolean; onNavigate?: Navigate }) {
  const [selectedId, setSelectedId] = useState<string | null>('c1')

  return (
    <section className="portal-map-band relative overflow-hidden border-y border-[var(--portal-nav-border)] py-16 md:py-20">
      <LineArt src={LINE_ART.gateLight} light className="absolute -bottom-10 -left-20 w-[520px] opacity-14" />
      <Container className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h2 className="flex items-center gap-3 font-serif text-[2rem] leading-tight font-semibold text-[var(--portal-on-dark)] sm:text-[2.5rem]">
            <MapPin className="h-9 w-9 shrink-0 text-[var(--portal-nav-accent)]" strokeWidth={1.4} /> Bản đồ tri ân
          </h2>
          <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-[var(--portal-on-dark-soft)]">
            Khám phá các nghĩa trang, địa chỉ đỏ và di tích lịch sử trên địa bàn Thư Lâm — những dấu ấn thiêng liêng của truyền thống cách mạng.
          </p>
          <div className="mt-7 grid max-w-md grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            {MAP_LAYERS.map((c) => (
              <button
                key={c.l}
                onClick={() => onNavigate?.(c.p)}
                className="flex h-11 min-w-0 items-center gap-2 rounded-[10px] border border-[rgba(240,212,145,0.28)] bg-[linear-gradient(180deg,rgba(255,245,215,0.08)_0%,rgba(255,245,215,0.02)_100%)] px-3 text-left text-[0.88rem] whitespace-nowrap transition-[background-color,border-color] duration-150 hover:border-[var(--portal-nav-accent)] hover:bg-white/12"
              >
                <span className="shrink-0 text-[var(--portal-nav-accent)]">{c.i}</span>
                <span className="truncate">{c.l}</span>
              </button>
            ))}
          </div>
          <Button variant="light" onClick={() => onNavigate?.('memorialMap')} className="mt-7">
            Mở bản đồ đầy đủ <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className={`p-[3px] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.65)] lg:col-span-7 ${soft ? 'rounded-[16px]' : 'rounded-xl'}`} style={{ background: 'var(--portal-gold-foil)' }}>
          <div className={`bg-paper p-2 ${soft ? 'rounded-[13px]' : 'rounded-[10px]'}`}>
            <MemorialMap points={MAP_POINTS} selectedId={selectedId} onSelect={setSelectedId} className="aspect-square rounded-lg sm:aspect-[4/3] lg:aspect-[16/11]" />
          </div>
        </div>
      </Container>
    </section>
  )
}
