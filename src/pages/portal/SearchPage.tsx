import React, { useEffect, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { SiteFooter, SiteHeader } from '@/components/layout'
import { Breadcrumb, Container, Portrait } from '@/components/ui'
import { CEMETERIES, MERIT, NEWS, RED_ADDRESSES, SOLDIERS } from '@/data/portal.mock'
import type { Navigate, PageKey } from '@/config/portalNav'
import { fold, matches } from '@/utils/text'
import { ContributeButton } from '@/features/contribute'

export const args = {
  query: 'Nguyễn',
  state: 'results',
}

export const argTypes = {
  query: { control: 'text' },
  state: { control: 'radio', options: ['results', 'empty', 'idle'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

type Hit = { id: string; group: string; title: string; meta: string; page: PageKey; portrait?: boolean }

const GROUPS = ['Tất cả', 'Liệt sĩ', 'Người có công', 'Nghĩa trang', 'Địa chỉ đỏ', 'Tin tức']

export default function SearchPage(props: Props) {
  const { query: initialQuery, state, onNavigate } = { ...args, ...props }
  const [q, setQ] = useState(initialQuery)
  const [group, setGroup] = useState('Tất cả')
  useEffect(() => { setQ(initialQuery); setGroup('Tất cả') }, [initialQuery])

  const term = q.trim()
  const all = buildIndex()
  const hits = state === 'empty' || state === 'idle' || !term ? [] : all.filter((h) => matches(`${h.title} ${h.meta}`, term))
  const shown = hits.filter((h) => group === 'Tất cả' || h.group === group)
  const countOf = (g: string) => (g === 'Tất cả' ? hits.length : hits.filter((h) => h.group === g).length)
  const showIdle = state === 'idle' || !term

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="search" onNavigate={onNavigate} />

      <section className="paper-grain border-b border-line">
        <Container className="max-w-4xl pt-8 pb-10 md:pt-10">
          <Breadcrumb items={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Tìm kiếm' }]} />
          <h1 className="mt-5 font-serif text-[2.2rem] leading-tight font-medium text-heritage-ink md:text-[2.8rem]">Tìm trên toàn cổng thông tin</h1>
          <form className="mt-6 flex gap-2" onSubmit={(e) => e.preventDefault()} role="search">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Từ khoá tìm kiếm</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-mute" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setGroup('Tất cả') }}
                placeholder="Họ tên liệt sĩ, nghĩa trang, địa danh…"
                className="h-14 w-full rounded-md border border-line-strong bg-paper pr-4 pl-12 text-[1.05rem] placeholder:text-ink-mute focus:border-heritage focus:outline-none"
              />
            </label>
            <button className="h-14 shrink-0 rounded-md bg-heritage px-6 font-semibold text-white transition-colors duration-150 hover:bg-heritage-deep">Tìm</button>
          </form>
        </Container>
      </section>

      <Container className="max-w-4xl py-10">
        {showIdle ? (
          <div>
            <h2 className="font-serif text-[1.4rem] text-heritage-ink">Gợi ý tìm kiếm</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Nguyễn Văn Thành', 'Nghĩa trang Thụy Lâm', 'Bà mẹ Việt Nam Anh hùng', 'Đền Sái', '27/7'].map((s) => (
                <button key={s} onClick={() => { setQ(s); setGroup('Tất cả') }} className="h-11 rounded-md border border-line-strong px-4 text-[0.95rem] text-ink-soft transition-colors duration-150 hover:border-heritage hover:text-heritage">{s}</button>
              ))}
            </div>
            <p className="mt-10 text-ink-soft">Cần tìm theo năm sinh, năm hy sinh hay vị trí mộ? Dùng <button onClick={() => onNavigate?.('soldiers')} className="font-semibold text-heritage underline-offset-4 hover:underline">tra cứu liệt sĩ nâng cao</button>.</p>
          </div>
        ) : hits.length === 0 ? (
          <div className="py-10">
            <h2 className="font-serif text-[1.6rem] text-heritage-ink">Không tìm thấy kết quả cho “{q}”</h2>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-ink-soft">
              <li>Thử nhập ít từ hơn, hoặc chỉ nhập tên (ví dụ “Thanh”).</li>
              <li>Dữ liệu đang được bổ sung — hồ sơ có thể chưa được số hoá.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onNavigate?.('soldiers')} className="rounded-md bg-heritage px-5 py-3 font-semibold text-white transition-colors duration-150 hover:bg-heritage-deep">Tra cứu nâng cao</button>
              <ContributeButton variant="ghost" topic="Bổ sung thông tin" subject={`Tìm kiếm “${term}”`}>Báo thông tin còn thiếu</ContributeButton>
            </div>
          </div>
        ) : (
          <>
            <p className="text-ink-soft"><span className="font-semibold text-ink">{hits.length}</span> kết quả cho “{q}”</p>
            <div className="no-scrollbar -mx-5 mt-5 flex gap-1 overflow-x-auto border-b border-line px-5 md:mx-0 md:px-0" role="tablist">
              {GROUPS.filter((g) => countOf(g) > 0).map((g) => (
                <button key={g} role="tab" aria-selected={group === g} onClick={() => setGroup(g)} className={`relative h-11 shrink-0 px-3.5 text-[0.95rem] whitespace-nowrap transition-colors duration-150 ${group === g ? 'font-semibold text-heritage' : 'text-ink-soft hover:text-heritage'}`}>
                  {g} <span className="ml-0.5 text-[0.82rem] text-ink-mute">{countOf(g)}</span>
                  {group === g && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-heritage" />}
                </button>
              ))}
            </div>
            <ul className="divide-y divide-line">
              {shown.map((h) => (
                <li key={h.group + h.id}>
                  <button onClick={() => onNavigate?.(h.page, { id: h.id })} className="group flex w-full items-center gap-5 py-5 text-left">
                    {h.portrait && <Portrait name={h.title} className="h-16 w-13 shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.85rem] font-medium text-gold">{h.group}</p>
                      <h3 className="mt-0.5 font-serif text-[1.3rem] leading-snug group-hover:text-heritage"><Mark text={h.title} term={term.split(/\s+/)[0]} /></h3>
                      <p className="mt-1 text-[0.93rem] text-ink-soft">{h.meta}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-ink-mute transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-heritage" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Container>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function Mark({ text, term }: { text: string; term: string }) {
  // fold() keeps one character per character of composed Vietnamese text, so indices line up.
  const needle = fold(term)
  const i = needle ? fold(text.normalize('NFC')).indexOf(needle) : -1
  if (i < 0) return <>{text}</>
  text = text.normalize('NFC')
  term = text.slice(i, i + needle.length)
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-gold-pale px-0.5 text-heritage-ink">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  )
}

function buildIndex(): Hit[] {
  return [
    ...SOLDIERS.map((s) => ({ id: s.id, group: 'Liệt sĩ', title: `Liệt sĩ ${s.name}`, meta: `${s.born} – ${s.died} · ${s.cemetery} · ${s.plot}`, page: 'soldier' as PageKey, portrait: true })),
    ...MERIT.map((m) => ({ id: m.id, group: 'Người có công', title: m.name, meta: `${m.title} · ${m.years}`, page: 'biography' as PageKey, portrait: true })),
    ...CEMETERIES.map((c) => ({ id: c.id, group: 'Nghĩa trang', title: c.name, meta: `${c.address} · ${c.graves} phần mộ`, page: 'cemetery' as PageKey })),
    ...RED_ADDRESSES.map((r) => ({ id: r.id, group: 'Địa chỉ đỏ', title: r.name, meta: `${r.kind} · ${r.address}`, page: 'redAddress' as PageKey })),
    ...NEWS.map((n) => ({ id: n.id, group: 'Tin tức', title: n.title, meta: `${n.category} · ${n.date}`, page: 'article' as PageKey })),
  ]
}
