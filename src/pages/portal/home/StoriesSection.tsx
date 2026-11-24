import React from 'react'
import { ArrowRight, ChevronRight, Star } from 'lucide-react'
import { LineArt } from '@/components/ornaments'
import { Button, Container } from '@/components/ui'
import type { Navigate } from '@/config/portalNav'
import { LINE_ART, NEWS } from '@/data/portal.mock'
import { HomeSectionHeading } from './HomeSectionHeading'

export function StoriesSection({ gilt, soft, onNavigate }: { gilt: boolean; soft: boolean; onNavigate?: Navigate }) {
  const lead = NEWS[1]
  const side = [NEWS[2], NEWS[0], NEWS[3]]

  return (
    <section className="relative py-16 md:py-24">
      <LineArt src={LINE_ART.lotusClouds} className="absolute top-10 -left-16 hidden w-72 opacity-35 xl:block" />
      <Container className="relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <HomeSectionHeading gilt={gilt} title="Câu chuyện tri ân" lead="Những câu chuyện, ký ức và tấm gương giàu ý nghĩa về sự hy sinh, cống hiến vì độc lập, tự do của Tổ quốc." />
          <Button variant="secondary" onClick={() => onNavigate?.('news')} className="self-start md:self-auto">
            Tất cả câu chuyện <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <button onClick={() => onNavigate?.('article', { id: lead.id })} className="group text-left lg:col-span-7">
            <div className={`portal-gilt-card relative aspect-[16/9] overflow-hidden ${soft ? 'rounded-[16px]' : 'rounded-xl'}`}>
              <img src={lead.image} alt="" className="portal-photo h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]" />
              <span className="portal-gold-badge absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[0.8rem] font-semibold">
                <Star className="h-3.5 w-3.5 fill-current" /> Câu chuyện nổi bật
              </span>
            </div>
            <p className="mt-5 text-[0.85rem] text-ink-mute"><span className="font-semibold text-heritage">{lead.category}</span> · {lead.date}</p>
            <h3 className="mt-1.5 font-serif text-[1.6rem] leading-snug font-semibold text-heritage-ink transition-colors duration-150 group-hover:text-heritage sm:text-[1.9rem]">{lead.title}</h3>
            <p className="mt-2.5 max-w-2xl leading-relaxed text-ink-soft">{lead.excerpt}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-heritage underline decoration-gold-soft underline-offset-4">Đọc tiếp <ArrowRight className="h-4 w-4" /></span>
          </button>

          <div className="flex flex-col divide-y divide-line lg:col-span-5">
            {side.map((n) => (
              <button key={n.id} onClick={() => onNavigate?.('article', { id: n.id })} className="group flex items-center gap-4 rounded-lg px-1 py-5 text-left transition-colors duration-150 first:pt-0 hover:bg-gold-pale/20 sm:gap-5">
                <img src={n.image} alt="" className={`portal-photo h-20 w-28 shrink-0 border border-gold-soft/75 object-cover sm:h-24 sm:w-36 ${soft ? 'rounded-[10px]' : 'rounded-md'}`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.82rem] text-ink-mute"><span className="font-semibold text-heritage">{n.category}</span> · {n.date}</span>
                  <span className="mt-1 block font-serif text-[1.15rem] leading-snug font-semibold text-ink transition-colors duration-150 group-hover:text-heritage sm:text-[1.25rem]">{n.title}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-heritage" />
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
