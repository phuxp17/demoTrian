import React, { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { PageHeader } from '../shared/components/PageHeader'
import { Container, Pagination } from '../shared/components/ui'
import { NEWS } from '../shared/data'
import type { Navigate } from '../shared/nav'

const PAGE_SIZE = 6

export const args = {
  category: 'Tất cả',
}

export const argTypes = {
  category: { control: 'select', options: ['Tất cả', 'Hoạt động', 'Sự kiện', 'Thông báo', 'Hướng dẫn'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

const CATEGORIES = ['Tất cả', 'Hoạt động', 'Sự kiện', 'Thông báo', 'Hướng dẫn']

export default function News(props: Props) {
  const { category: initial, onNavigate } = { ...args, ...props }
  const [category, setCategory] = useState(initial)
  const [page, setPage] = useState(1)
  useEffect(() => { setCategory(initial); setPage(1) }, [initial])

  const all = NEWS.filter((n) => category === 'Tất cả' || n.category === category)
  const pages = Math.ceil(all.length / PAGE_SIZE)
  const current = Math.min(page, Math.max(pages, 1))
  const [lead, ...rest] = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const event = NEWS.find((n) => n.category === 'Sự kiện')
  const latest = [...NEWS].reverse().slice(0, 4)

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="news" onNavigate={onNavigate} />
      <PageHeader
        crumbs={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Tin tức' }]}
        title="Tin tức & hoạt động tri ân"
        lead="Thông báo của Ban quản lý, các hoạt động tưởng niệm và hướng dẫn sử dụng cổng thông tin."
      />

      <Container className="py-12">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Chuyên mục">
          {CATEGORIES.map((c) => (
            <button key={c} role="tab" aria-selected={category === c} onClick={() => { setCategory(c); setPage(1) }} className={`h-11 shrink-0 rounded-md border px-4 text-[0.92rem] whitespace-nowrap transition-colors duration-150 ${category === c ? 'border-heritage bg-heritage text-white' : 'border-line-strong text-ink-soft hover:border-heritage hover:text-heritage'}`}>{c}</button>
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="min-w-0">
            {lead ? (
              <>
                <article>
                  <button onClick={() => onNavigate?.('article', { id: lead.id })} className="group block w-full text-left">
                    <div className="overflow-hidden rounded-sm">
                      <img src={lead.image} alt="" className="aspect-[16/9] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
                    </div>
                    <p className="mt-5 text-[0.9rem] text-gold"><span className="font-medium">{lead.category}</span> · {lead.date}</p>
                    <h2 className="mt-2 font-serif text-[2rem] leading-tight text-heritage-ink group-hover:text-heritage md:text-[2.5rem]">{lead.title}</h2>
                  </button>
                  <p className="mt-3 max-w-[65ch] text-[1.05rem] leading-relaxed text-ink-soft">{lead.excerpt}</p>
                </article>

                <ul className="mt-12 divide-y divide-line border-t border-line">
                  {rest.map((n) => (
                    <li key={n.id}>
                      <button onClick={() => onNavigate?.('article', { id: n.id })} className="group grid w-full grid-cols-[112px_minmax(0,1fr)] gap-5 py-6 text-left sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-7">
                        <div className="overflow-hidden rounded-sm">
                          <img src={n.image} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.85rem] text-gold"><span className="font-medium">{n.category}</span> · {n.date}</p>
                          <h3 className="mt-1 font-serif text-[1.2rem] leading-snug group-hover:text-heritage sm:text-[1.45rem]">{n.title}</h3>
                          <p className="mt-2 hidden text-[0.95rem] leading-relaxed text-ink-soft sm:block">{n.excerpt}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-10"><Pagination page={current} total={pages} onChange={setPage} /></div>
              </>
            ) : (
              <p className="py-16 text-center text-ink-soft">Chưa có bài viết trong chuyên mục này.</p>
            )}
          </div>

          <aside className="flex flex-col gap-10 lg:border-l lg:border-line lg:pl-10">
            <section>
              <h2 className="font-serif text-[1.35rem] text-heritage-ink">Mới cập nhật</h2>
              <ol className="mt-4 divide-y divide-line">
                {latest.map((n) => (
                  <li key={n.id}>
                    <button onClick={() => onNavigate?.('article', { id: n.id })} className="block w-full py-3.5 text-left">
                      <span className="block text-[0.98rem] leading-snug hover:text-heritage">{n.title}</span>
                      <span className="mt-1 block text-[0.82rem] text-ink-mute">{n.date}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
            <section className="rounded-md bg-heritage-ink p-6 text-gold-pale">
              <h2 className="font-serif text-[1.35rem] text-paper">Ngày 27/7 sắp tới</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed">Lịch dâng hương tại các nghĩa trang và hướng dẫn đăng ký viếng cho thân nhân ở xa.</p>
              <button onClick={() => onNavigate?.('article', event ? { id: event.id } : undefined)} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-paper underline-offset-4 hover:underline">
                Xem lịch <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          </aside>
        </div>
      </Container>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
