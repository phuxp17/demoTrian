import React, { useState } from 'react'
import { ArrowRight, BookOpen, ChevronRight, Flag, Flame, House, Medal, Shield, Star, UserRound } from 'lucide-react'
import { CornerFlourish, LineArt } from '@/components/ornaments'
import { Button, Container } from '@/components/ui'
import type { Navigate } from '@/config/portalNav'
import { IMG, LINE_ART, SOLDIERS } from '@/data/portal.mock'
import { HomeSectionHeading } from './HomeSectionHeading'

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_6.5rem_minmax(0,1fr)] items-start gap-x-3">
      <span className="mt-0.5 text-[var(--portal-gold-icon)]">{icon}</span>
      <dt className="text-ink-mute">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  )
}

export function FeaturedMemorialSection({
  gilt,
  soft,
  showCandle,
  onNavigate,
}: {
  gilt: boolean
  soft: boolean
  showCandle: boolean
  onNavigate?: Navigate
}) {
  const [incense, setIncense] = useState(false)
  const featured = SOLDIERS[0]
  const recent = SOLDIERS.slice(1, 6)

  return (
    <section className="relative py-16 md:py-24">
      <LineArt src={LINE_ART.countryside} className="absolute top-6 right-0 hidden w-[620px] opacity-25 lg:block" />
      <Container className="relative">
        <HomeSectionHeading
          gilt={gilt}
          title="Tưởng niệm hôm nay"
          lead="Mỗi ngày, chúng ta cùng dành một phút để tưởng nhớ, tri ân những người đã cống hiến, hy sinh vì độc lập, tự do của Tổ quốc."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <article className={`portal-gilt-card relative p-5 sm:p-8 lg:col-span-8 ${soft ? 'rounded-[18px]' : 'rounded-xl'}`}>
            <div className={`pointer-events-none absolute inset-2.5 border border-gold-soft/50 ${soft ? 'rounded-[12px]' : 'rounded-lg'}`} />
            {gilt && (
              <>
                <CornerFlourish gilt className="pointer-events-none absolute top-3.5 left-3.5 h-6 w-6 opacity-85" />
                <CornerFlourish gilt className="pointer-events-none absolute top-3.5 right-3.5 h-6 w-6 -scale-x-100 opacity-85" />
                <CornerFlourish gilt className="pointer-events-none absolute bottom-3.5 left-3.5 h-6 w-6 -scale-y-100 opacity-85" />
                <CornerFlourish gilt className="pointer-events-none absolute right-3.5 bottom-3.5 h-6 w-6 scale-[-1] opacity-85" />
              </>
            )}

            <div className="relative flex flex-col gap-7 sm:flex-row sm:gap-9">
              <figure className={`portal-portrait-mat mx-auto w-52 shrink-0 p-2.5 sm:mx-0 sm:w-56 ${soft ? 'rounded-[12px]' : '-rotate-[1.5deg]'}`}>
                <img src={IMG.portraitS1} alt={`Ảnh minh hoạ liệt sĩ ${featured.name}`} className={`portal-photo aspect-[3/4] w-full object-cover ${soft ? 'rounded-[8px]' : ''}`} />
                <figcaption className="pt-2 text-center text-[0.72rem] text-ink-mute">Ảnh minh hoạ</figcaption>
              </figure>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="portal-gold-badge inline-flex items-center gap-1.5 self-start rounded-full px-3.5 py-1 text-[0.8rem] font-semibold">
                  <Star className="h-3.5 w-3.5 fill-current" /> Nhân vật tưởng niệm tiêu biểu
                </span>
                <h3 className="mt-3 font-serif text-[2rem] leading-tight font-semibold text-heritage-ink sm:text-[2.45rem]">{featured.name}</h3>
                <p className="font-serif text-lg font-semibold text-gold">({featured.born} – {featured.died})</p>
                <dl className="mt-5 space-y-3 text-[0.95rem]">
                  <Fact icon={<House className="h-4 w-4" />} label="Quê quán" value={featured.hometown} />
                  <Fact icon={<Medal className="h-4 w-4" />} label="Cấp bậc" value={featured.rank} />
                  <Fact icon={<Shield className="h-4 w-4" />} label="Đơn vị" value={featured.unit} />
                  <Fact icon={<Flag className="h-4 w-4" />} label="Hy sinh" value={`Năm ${featured.died}, tại ${featured.diedAt}`} />
                </dl>
                <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:flex-wrap">
                  <Button onClick={() => onNavigate?.('soldier', { id: featured.id })}>
                    Xem trang tưởng niệm <ArrowRight className="h-4 w-4" />
                  </Button>
                  {showCandle && (
                    <button
                      onClick={() => setIncense((v) => !v)}
                      aria-pressed={incense}
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-[0.95rem] font-semibold whitespace-nowrap transition-all duration-150 ease-out active:scale-[0.98] ${
                        incense ? 'portal-gold-badge' : 'portal-btn-secondary'
                      }`}
                    >
                      <Flame className={`h-4 w-4 ${incense ? 'fill-[#e08a3c] text-[#9b4410]' : 'text-[var(--portal-gold-icon)]'}`} />
                      {incense ? 'Đã thắp · 1.249 nén hương' : 'Thắp nén hương'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <h3 className="flex items-center gap-2.5 font-serif text-[1.35rem] font-semibold text-heritage-ink">
              <BookOpen className="h-5 w-5 text-[var(--portal-gold-icon)]" strokeWidth={1.5} /> Hồ sơ mới được cập nhật
            </h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {recent.map((s) => (
                <li key={s.id}>
                  <button onClick={() => onNavigate?.('soldier', { id: s.id })} className="group flex w-full items-center gap-3.5 rounded-lg px-1 py-3 text-left transition-colors duration-150 hover:bg-gold-pale/25">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-gold-soft/80 bg-ivory text-[var(--portal-gold-icon)] shadow-[inset_0_1px_0_rgba(255,250,232,0.5)]">
                      <UserRound className="h-5 w-5" strokeWidth={1.4} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-[1.12rem] font-semibold text-ink transition-colors duration-150 group-hover:text-heritage">{s.name}</span>
                      <span className="block truncate text-[0.82rem] text-ink-mute">({s.born} – {s.died}) · {s.hometown.split(',')[0]}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-heritage transition-transform duration-150 group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => onNavigate?.('soldiers')} className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-heritage underline decoration-gold-soft underline-offset-4 hover:decoration-heritage">
              Xem toàn bộ danh sách liệt sĩ <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      </Container>
    </section>
  )
}
