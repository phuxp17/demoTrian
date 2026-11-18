import React, { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { PageHeader } from '../shared/components/PageHeader'
import { Button, Container, Pagination, Portrait, Tag } from '../shared/components/ui'
import { MERIT } from '../shared/data'
import type { Navigate } from '../shared/nav'
import { matches } from '../shared/text'

const PAGE_SIZE = 8

export const args = {
  category: 'Tất cả',
}

export const argTypes = {
  category: { control: 'select', options: ['Tất cả', 'Bà mẹ Việt Nam Anh hùng', 'Thương binh', 'Bệnh binh', 'Người hoạt động kháng chiến', 'Người có công giúp đỡ cách mạng'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

const CATS = ['Tất cả', 'Bà mẹ Việt Nam Anh hùng', 'Thương binh', 'Bệnh binh', 'Người hoạt động kháng chiến', 'Người có công giúp đỡ cách mạng']

export default function Merit(props: Props) {
  const { category, onNavigate } = { ...args, ...props }
  const [cat, setCat] = useState(category)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const all = MERIT.filter((m) => (cat === 'Tất cả' || m.category === cat) && matches(`${m.name} ${m.hometown}`, q))
  const pages = Math.ceil(all.length / PAGE_SIZE)
  const current = Math.min(page, Math.max(pages, 1))
  const list = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const mothers = MERIT.filter((m) => m.category === 'Bà mẹ Việt Nam Anh hùng')

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="merit" onNavigate={onNavigate} />
      <PageHeader
        crumbs={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Người có công' }]}
        title="Người có công với cách mạng"
        lead="Ghi nhớ những Bà mẹ Việt Nam Anh hùng, thương binh, bệnh binh và những người đã góp sức cho độc lập, tự do của dân tộc."
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <button onClick={() => onNavigate?.('families')} className="flex items-center gap-2 font-medium text-heritage underline underline-offset-4">Địa chỉ gia đình chính sách <ArrowRight className="h-4 w-4" /></button>
        </div>
      </PageHeader>

      {cat === 'Tất cả' && !q && (
        <section className="border-b border-line">
          <Container className="py-12">
            <h2 className="font-serif text-[1.8rem] text-heritage-ink">Bà mẹ Việt Nam Anh hùng</h2>
            <div className="mt-8 grid gap-10 sm:grid-cols-2">
              {mothers.map((m) => (
                <article key={m.id} className="flex gap-6">
                  <Portrait name={m.name} className="aspect-[3/4] w-32 shrink-0 md:w-40" />
                  <div className="flex min-w-0 flex-col py-2">
                    <p className="font-serif text-gold italic">Mẹ</p>
                    <h3 className="font-serif text-[1.7rem] leading-tight">{m.name}</h3>
                    <p className="mt-1 text-ink-soft">{m.years} · {m.hometown}</p>
                    <Button variant="secondary" className="mt-auto self-start" onClick={() => onNavigate?.('biography', { id: m.id })}>Đọc tiểu sử</Button>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Container className="py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0" role="tablist" aria-label="Nhóm đối tượng">
            {CATS.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} onClick={() => { setCat(c); setPage(1) }} className={`h-11 shrink-0 rounded-md border px-4 text-[0.92rem] whitespace-nowrap transition-colors duration-150 ${cat === c ? 'border-heritage bg-heritage text-white' : 'border-line-strong text-ink-soft hover:border-heritage hover:text-heritage'}`}>
                {c}
              </button>
            ))}
          </div>
          <label className="relative w-full lg:w-72">
            <span className="sr-only">Tìm theo họ tên</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-mute" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Tìm theo họ tên" className="h-11 w-full rounded-md border border-line-strong bg-paper pr-3 pl-11 focus:border-heritage focus:outline-none" />
          </label>
        </div>

        <table className="mt-8 w-full text-left">
          <thead className="hidden border-b-2 border-heritage/30 text-[0.88rem] text-ink-mute md:table-header-group">
            <tr><th className="py-3 font-medium">Họ và tên</th><th className="py-3 font-medium">Diện</th><th className="py-3 font-medium">Năm sinh – mất</th><th className="py-3 font-medium">Quê quán</th><th /></tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id} className="flex flex-col gap-1 border-b border-line py-5 md:table-row">
                <td className="md:py-5"><button onClick={() => onNavigate?.('biography', { id: m.id })} className="text-left font-serif text-[1.3rem] hover:text-heritage">{m.name}</button></td>
                <td className="md:py-5"><Tag tone={m.category === 'Bà mẹ Việt Nam Anh hùng' ? 'red' : 'gold'}>{m.title}</Tag></td>
                <td className="text-ink-soft md:py-5">{m.years}</td>
                <td className="text-ink-soft md:py-5">{m.hometown}</td>
                <td className="pt-2 md:py-5 md:text-right"><Button variant="ghost" onClick={() => onNavigate?.('biography', { id: m.id })}>Tiểu sử</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 ? (
          <p className="py-14 text-center text-ink-soft">Chưa có hồ sơ phù hợp với lựa chọn này.</p>
        ) : (
          <div className="mt-10"><Pagination page={current} total={pages} onChange={setPage} /></div>
        )}
      </Container>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
