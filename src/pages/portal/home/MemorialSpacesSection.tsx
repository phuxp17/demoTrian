import React from 'react'
import { ArrowRight, BookOpen, Landmark, MapPin, Star } from 'lucide-react'
import { LineArt, OrnamentRule } from '@/components/ornaments'
import { Container } from '@/components/ui'
import type { Navigate } from '@/config/portalNav'
import { IMG, LINE_ART } from '@/data/portal.mock'

const SPACES = [
  { t: 'Nghĩa trang liệt sĩ', d: 'Nơi an nghỉ của những người con ưu tú của quê hương.', img: IMG.cemetery, p: 'cemeteries' as const, icon: <Landmark className="h-5 w-5" /> },
  { t: 'Người có công', d: 'Những tấm gương cống hiến, phụng sự Tổ quốc.', img: IMG.incense, p: 'merit' as const, icon: <Star className="h-5 w-5" /> },
  { t: 'Địa chỉ đỏ', d: 'Di tích, điểm đến gắn với lịch sử cách mạng.', img: IMG.dinh, p: 'redAddresses' as const, icon: <MapPin className="h-5 w-5" /> },
  { t: 'Thư viện tư liệu', d: 'Ảnh, thư từ, kỷ vật và các nguồn tư liệu quý.', img: IMG.artifacts, p: 'library' as const, icon: <BookOpen className="h-5 w-5" /> },
]

export function MemorialSpacesSection({ gilt, soft, onNavigate }: { gilt: boolean; soft: boolean; onNavigate?: Navigate }) {
  return (
    <section className="paper-grain relative overflow-hidden py-16 md:py-24">
      <LineArt src={LINE_ART.countryside} className="absolute top-0 left-1/2 w-[1100px] max-w-none -translate-x-1/2 opacity-22" />
      <Container className="relative">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <LineArt src={LINE_ART.gate} className="w-40 opacity-80 md:w-48" />
          <OrnamentRule gilt={gilt} className="mt-2 mb-3 text-gold" />
          <h2 className="font-serif text-[2rem] leading-tight font-semibold text-heritage-ink sm:text-[2.45rem] md:text-[2.95rem]">Những không gian tưởng niệm</h2>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">Đi tới những địa danh, công trình và tư liệu gắn với sự hy sinh, cống hiến của các thế hệ cha anh trên quê hương Thư Lâm.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {SPACES.map((s) => (
            <button
              key={s.t}
              onClick={() => onNavigate?.(s.p)}
              className={`portal-gilt-card group relative flex flex-col rounded-t-[999px] p-2 text-left transition-[transform,box-shadow] duration-250 ease-out hover:-translate-y-1.5 ${soft ? 'rounded-b-[18px]' : 'rounded-b-xl'}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px]">
                <img src={s.img} alt="" className="portal-photo h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
                <div className="pointer-events-none absolute inset-2 rounded-t-[999px] border border-[#fff2d2]/55" />
              </div>
              <span className="portal-arch-badge relative mx-auto -mt-7 flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-pale">
                {s.icon}
              </span>
              <span className="flex flex-1 flex-col items-center px-3 pt-3 pb-4 text-center">
                <span className="font-serif text-[1.35rem] leading-snug font-semibold text-heritage-ink">{s.t}</span>
                <span className="mt-1.5 text-[0.9rem] leading-snug text-ink-soft">{s.d}</span>
                <span className="mt-auto flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-gold-soft text-heritage transition-all duration-150 group-hover:border-gold-pale group-hover:bg-gold-pale group-hover:text-heritage-ink">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}
