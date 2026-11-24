import React, { useState } from 'react'
import { List, Map as MapIcon, MapPin, Rotate3d } from 'lucide-react'
import { PageHeader, SiteFooter, SiteHeader } from '@/components/layout'
import { ArchImage } from '@/components/ornaments'
import { MemorialMap } from '@/features/memorial-map'
import { Button, Container, Tag } from '@/components/ui'
import { CEMETERIES, MAP_POINTS } from '@/data/portal.mock'
import type { Navigate } from '@/config/portalNav'

export const args = {
  view: 'list',
}

export const argTypes = {
  view: { control: 'radio', options: ['list', 'map'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

export default function Cemeteries(props: Props) {
  const { view: initialView, onNavigate } = { ...args, ...props }
  const [view, setView] = useState(initialView)
  const [sel, setSel] = useState<string | null>('c1')
  const total = CEMETERIES.reduce((n, c) => n + c.graves, 0)
  const [lead, ...rest] = CEMETERIES

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="cemeteries" onNavigate={onNavigate} />
      <PageHeader
        crumbs={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Nghĩa trang' }]}
        title="Các nghĩa trang liệt sĩ trên địa bàn"
        lead={`${CEMETERIES.length} nghĩa trang đang được số hoá, nơi an nghỉ của ${total.toLocaleString('vi-VN')} anh hùng liệt sĩ. Chọn một nghĩa trang để xem sơ đồ phần mộ, giờ mở cửa và đường đi.`}
      >
        <div className="inline-flex rounded-md border border-line-strong bg-paper p-1" role="tablist" aria-label="Cách hiển thị">
          {[
            { k: 'list', label: 'Danh sách', Icon: List },
            { k: 'map', label: 'Bản đồ', Icon: MapIcon },
          ].map(({ k, label, Icon }) => (
            <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)} className={`flex h-10 items-center gap-2 rounded-sm px-4 text-[0.95rem] font-medium transition-colors duration-150 ${view === k ? 'bg-heritage text-white' : 'text-ink-soft hover:text-heritage'}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </PageHeader>

      {view === 'list' ? (
        <Container className="py-14">
          <article className="grid items-center gap-8 border-b border-line pb-14 md:grid-cols-2 lg:gap-16">
            <ArchImage src={lead.image} alt={lead.name} className="aspect-[4/5] w-full max-w-md md:justify-self-start" />
            <div>
              <div className="flex flex-wrap gap-2"><Tag tone="red">Nghĩa trang lớn nhất</Tag>{lead.has360 && <Tag>Có tham quan 360°</Tag>}</div>
              <h2 className="mt-4 font-serif text-[2.2rem] leading-tight text-heritage-ink md:text-[2.7rem]">{lead.name}</h2>
              <p className="mt-3 flex items-center gap-2 text-ink-soft"><MapPin className="h-4 w-4 text-gold" />{lead.address}</p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-line py-6">
                <div><dt className="text-[0.88rem] text-ink-mute">Phần mộ</dt><dd className="font-serif text-[2.2rem] text-ink">{lead.graves}</dd></div>
                <div><dt className="text-[0.88rem] text-ink-mute">Đã xác định danh tính</dt><dd className="font-serif text-[2.2rem] text-ink">{lead.identified}</dd></div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => onNavigate?.('cemetery', { id: lead.id })}>Xem chi tiết</Button>
                <Button size="lg" variant="secondary" onClick={() => onNavigate?.('graveMap', { id: lead.id })}>Sơ đồ phần mộ</Button>
              </div>
            </div>
          </article>

          <ul className="mt-4 divide-y divide-line">
            {rest.map((c) => (
              <li key={c.id} className="grid gap-5 py-8 sm:grid-cols-[200px_1fr] md:grid-cols-[240px_1fr_auto] md:items-center md:gap-8">
                <img src={c.image} alt="" className="aspect-[4/3] w-full rounded-sm object-cover" />
                <div className="min-w-0">
                  <button onClick={() => onNavigate?.('cemetery', { id: c.id })} className="text-left font-serif text-[1.6rem] leading-snug hover:text-heritage">{c.name}</button>
                  <p className="mt-1 flex items-center gap-2 text-ink-soft"><MapPin className="h-4 w-4 shrink-0 text-gold" />{c.address}</p>
                  <p className="mt-3 text-[0.95rem] text-ink-soft"><strong className="font-semibold text-ink">{c.graves}</strong> phần mộ · <strong className="font-semibold text-ink">{c.identified}</strong> đã xác định danh tính</p>
                  {c.has360 && <p className="mt-2 flex items-center gap-1.5 text-[0.9rem] text-gold"><Rotate3d className="h-4 w-4" /> Có tham quan 360°</p>}
                </div>
                <div className="flex gap-2 sm:col-span-2 md:col-span-1 md:flex-col">
                  <Button onClick={() => onNavigate?.('cemetery', { id: c.id })}>Xem chi tiết</Button>
                  <Button variant="secondary" onClick={() => onNavigate?.('graveMap', { id: c.id })}>Sơ đồ mộ</Button>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      ) : (
        <Container className="grid gap-6 py-10 lg:grid-cols-[1fr_360px]">
          <MemorialMap points={MAP_POINTS.filter((p) => p.kind === 'cemetery')} selectedId={sel} onSelect={setSel} className="aspect-[4/3] rounded-md border border-line-strong lg:aspect-auto lg:min-h-[560px]" />
          <ul className="flex flex-col gap-2">
            {CEMETERIES.map((c) => (
              <li key={c.id} className={`rounded-md border transition-colors duration-150 ${sel === c.id ? 'border-heritage bg-heritage-tint' : 'border-line hover:border-line-strong'}`}>
                <button onClick={() => setSel(c.id)} aria-pressed={sel === c.id} className="w-full p-4 text-left">
                  <span className="block font-serif text-lg">{c.name}</span>
                  <span className="block text-[0.9rem] text-ink-soft">{c.graves} phần mộ · {c.area}</span>
                </button>
                {sel === c.id && (
                  <button onClick={() => onNavigate?.('cemetery', { id: c.id })} className="-mt-2 mb-2 ml-4 min-h-11 font-medium text-heritage underline underline-offset-4">
                    Xem chi tiết nghĩa trang
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Container>
      )}
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
