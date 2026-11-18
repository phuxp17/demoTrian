import React, { useState } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { PageHeader } from '../shared/components/PageHeader'
import { ArchImage } from '../shared/components/Ornaments'
import { Button, Container, Tag } from '../shared/components/ui'
import { RED_ADDRESSES } from '../shared/data'
import type { Navigate } from '../shared/nav'

export const args = {
  kind: 'Tất cả',
}

export const argTypes = {
  kind: { control: 'select', options: ['Tất cả', 'Đài tưởng niệm', 'Đình, đền', 'Nhà truyền thống', 'Di tích cách mạng', 'Nhà lưu niệm', 'Bia tưởng niệm'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

const KINDS = ['Tất cả', 'Đài tưởng niệm', 'Đình, đền', 'Nhà truyền thống', 'Di tích cách mạng', 'Nhà lưu niệm', 'Bia tưởng niệm']

export default function RedAddresses(props: Props) {
  const { kind: initialKind, onNavigate } = { ...args, ...props }
  const [kind, setKind] = useState(initialKind)
  const list = RED_ADDRESSES.filter((r) => kind === 'Tất cả' || r.kind === kind)
  const [first, ...rest] = list

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="redAddresses" onNavigate={onNavigate} />
      <PageHeader
        crumbs={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Địa chỉ đỏ' }]}
        title="Địa chỉ đỏ — nơi lưu giữ ký ức"
        lead="Đài tưởng niệm, đình làng, nhà truyền thống và những điểm di tích gắn với truyền thống cách mạng của quê hương — điểm đến cho các hoạt động giáo dục truyền thống."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary" onClick={() => onNavigate?.('memorialMap')}><MapPin className="h-4 w-4" /> Xem trên bản đồ tri ân</Button>
        </div>
      </PageHeader>

      <Container className="py-12">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Loại địa điểm">
          {KINDS.map((k) => (
            <button key={k} role="tab" aria-selected={kind === k} onClick={() => setKind(k)} className={`h-11 shrink-0 rounded-md border px-4 text-[0.92rem] whitespace-nowrap transition-colors duration-150 ${kind === k ? 'border-heritage bg-heritage text-white' : 'border-line-strong text-ink-soft hover:border-heritage hover:text-heritage'}`}>{k}</button>
          ))}
        </div>

        {first ? (
          <>
            <article className="mt-12 grid items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
              <ArchImage src={first.image} alt={first.name} className="aspect-[4/5] w-full" />
              <div>
                <Tag tone="red">{first.kind}</Tag>
                <h2 className="mt-4 font-serif text-[2.2rem] leading-tight text-heritage-ink md:text-[2.8rem]">{first.name}</h2>
                <p className="mt-3 flex items-center gap-2 text-ink-soft"><MapPin className="h-4 w-4 text-gold" />{first.address}</p>
                <p className="mt-6 max-w-[55ch] text-[1.05rem] leading-relaxed text-ink-soft">Nơi diễn ra các nghi lễ tưởng niệm của địa phương. Thông tin lịch sử chi tiết đang được Ban biên tập đối chiếu với tư liệu lưu trữ.</p>
                <p className="mt-4 text-[0.95rem] text-ink-mute">Xếp hạng: {first.rank}</p>
                <Button size="lg" className="mt-8" onClick={() => onNavigate?.('redAddress', { id: first.id })}>Tìm hiểu địa điểm <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </article>

            {rest.length > 0 && (
              <div className="mt-16 grid gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((r) => (
                  <article key={r.id} className="flex flex-col">
                    <button onClick={() => onNavigate?.('redAddress', { id: r.id })} className="group text-left">
                      <div className="overflow-hidden rounded-sm">
                        <img src={r.image} alt="" className="aspect-[3/2] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                      </div>
                      <p className="mt-4 text-[0.88rem] font-medium text-gold">{r.kind}</p>
                      <h3 className="mt-1 font-serif text-[1.45rem] leading-snug group-hover:text-heritage">{r.name}</h3>
                    </button>
                    <p className="mt-2 flex items-center gap-1.5 text-[0.92rem] text-ink-soft"><MapPin className="h-4 w-4 shrink-0 text-gold" />{r.address}</p>
                    <p className="mt-auto pt-3 text-[0.88rem] text-ink-mute">{r.rank}</p>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="py-16 text-center text-ink-soft">Chưa có địa điểm thuộc loại này.</p>
        )}
      </Container>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
