import React, { useState } from 'react'
import { Flower2, Grid3x3, Landmark, MapPin, Search } from 'lucide-react'
import { LineArt, RoofCrest } from '@/components/ornaments'
import { Container } from '@/components/ui'
import type { Navigate, PageKey } from '@/config/portalNav'
import { IMG, LINE_ART } from '@/data/portal.mock'

const SHORTCUTS: { label: string; short: string; page: PageKey; icon: React.ReactNode }[] = [
  { label: 'Tra cứu liệt sĩ theo thôn', short: 'Liệt sĩ theo thôn', page: 'soldiers', icon: <MapPin className="h-5 w-5 sm:h-4 sm:w-4" /> },
  { label: 'Sơ đồ phần mộ', short: 'Sơ đồ phần mộ', page: 'graveMap', icon: <Grid3x3 className="h-5 w-5 sm:h-4 sm:w-4" /> },
  { label: 'Bà mẹ Việt Nam anh hùng', short: 'Bà mẹ VN anh hùng', page: 'merit', icon: <Flower2 className="h-5 w-5 sm:h-4 sm:w-4" /> },
  { label: 'Địa chỉ đỏ', short: 'Địa chỉ đỏ', page: 'redAddresses', icon: <Landmark className="h-5 w-5 sm:h-4 sm:w-4" /> },
]

/** Cuts a concave quarter-circle of radius r out of each corner. */
function scoop(r: number): React.CSSProperties {
  const g = (pos: string) => `radial-gradient(circle at ${pos}, transparent ${r}px, #000 ${r + 0.5}px) ${pos} / 51% 51% no-repeat`
  const m = [g('top left'), g('top right'), g('bottom left'), g('bottom right')].join(', ')
  return { mask: m, WebkitMask: m }
}

export function HeroSearchSection({
  heroTitle,
  gilt,
  soft,
  onNavigate,
}: {
  heroTitle: string
  gilt: boolean
  soft: boolean
  onNavigate?: Navigate
}) {
  const [query, setQuery] = useState('')

  const runSearch = () => {
    onNavigate?.('search', { query: query.trim() })
  }

  return (
    <section className="relative isolate">
      <div className="relative h-[460px] overflow-hidden sm:h-[520px] md:h-[600px]">
        <img
          src={IMG.heroSunrise}
          alt="Đài tưởng niệm và cổng tam quan trong nắng sớm"
          className="portal-photo absolute inset-0 h-full w-full object-cover object-[65%_center]"
        />
        <div className="absolute inset-0" style={{ background: 'var(--portal-hero-overlay)' }} />
        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: 'var(--portal-hero-bottom)' }} />
        <Container className="relative flex h-full flex-col justify-center pb-16 md:pb-14">
          <h1 className="portal-hero-title max-w-2xl font-serif text-[3rem] leading-[1.18] font-medium italic sm:text-[3.8rem] md:text-[5rem]">
            {heroTitle}
          </h1>
          {gilt ? (
            <div className="mt-3 flex max-w-[16rem] items-center gap-2.5" aria-hidden="true">
              <svg viewBox="0 0 24 12" className="h-3 w-5 shrink-0 text-[var(--portal-nav-accent)]" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M12 1 L17 6 L12 11 L7 6 Z" />
                <circle cx="2.5" cy="6" r="1.3" fill="currentColor" />
              </svg>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(244,214,143,0.85),rgba(244,214,143,0.1))]" />
            </div>
          ) : (
            <svg viewBox="0 0 220 14" className="mt-3 h-3.5 w-48 text-gold-soft md:w-56" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <path d="M2 10 C60 2 140 2 218 7" />
              <path d="M30 11 C80 6 140 6 190 9" opacity="0.5" />
            </svg>
          )}
          <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-[var(--portal-on-dark)] sm:text-[1.08rem]" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}>
            Tưởng nhớ các anh hùng liệt sĩ, tri ân người có công với cách mạng — gìn giữ đạo lý tốt đẹp của dân tộc Việt Nam.
          </p>
        </Container>
      </div>

      <Container className="relative z-10 -mt-14 md:-mt-15">
        <div
          className="relative mx-auto max-w-4xl px-4 pt-8 pb-4 sm:px-8 sm:pt-9 sm:pb-5 md:px-12 md:pt-10 md:pb-6"
          style={{ filter: 'drop-shadow(var(--portal-stele-shadow))' }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ ...scoop(soft ? 21 : 18), background: 'var(--portal-gold-foil)' }} />
          <div className="pointer-events-none absolute inset-[2px]" style={{ ...scoop(soft ? 20 : 18), background: 'var(--portal-card-sheen)' }} />
          <div className="pointer-events-none absolute inset-[8.5px] opacity-85" style={{ ...scoop(soft ? 18.5 : 17), background: 'var(--portal-gold-foil-soft)' }} />
          <div className="pointer-events-none absolute inset-[10px]" style={{ ...scoop(soft ? 18 : 16.5), background: 'var(--portal-card-sheen)' }} />

          <div className="pointer-events-none absolute inset-[10px] overflow-hidden" style={scoop(soft ? 18 : 16.5)}>
            <LineArt src={LINE_ART.lotusClouds} className="absolute -bottom-6 -left-10 hidden w-56 opacity-40 md:block" />
            <LineArt src={LINE_ART.lotusClouds} className="absolute -right-10 -bottom-6 hidden w-56 -scale-x-100 opacity-40 md:block" />
          </div>

          <RoofCrest gilt={gilt} fill="var(--portal-stele-top, var(--color-paper))" className="pointer-events-none absolute -top-[2.3rem] left-1/2 h-auto w-[220px] -translate-x-1/2 drop-shadow-[0_2px_6px_rgba(135,96,34,0.22)] sm:-top-12 sm:w-[300px]" />

          <form role="search" onSubmit={(e) => { e.preventDefault(); runSearch() }} className="relative flex gap-2 sm:gap-3">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Tìm tên liệt sĩ, người có công, địa danh</span>
              <Search className="pointer-events-none absolute top-1/2 left-5 hidden h-5.5 w-5.5 -translate-y-1/2 text-[var(--portal-gold-icon)] sm:block" />
              <input
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`peer h-14 w-full border border-line-strong bg-paper/85 pr-3 pl-4 text-[1.05rem] shadow-[inset_0_2px_5px_rgba(55,36,16,0.06)] focus:border-gold focus:outline-none sm:pr-4 sm:pl-14 sm:text-[1.08rem] md:h-16 md:text-[1.15rem] ${soft ? 'rounded-[10px]' : 'rounded-md'}`}
              />
              {!query && (
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 left-4 flex items-center truncate text-[1.05rem] text-ink-mute sm:left-14 sm:text-[1.08rem] md:text-[1.15rem]">
                  <span className="truncate sm:hidden">Tên liệt sĩ, địa danh…</span>
                  <span className="hidden truncate sm:inline">Tìm tên liệt sĩ, người có công, địa danh…</span>
                </span>
              )}
            </label>
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className={`portal-btn-primary inline-flex h-14 shrink-0 items-center justify-center gap-2 px-5 text-[1.02rem] font-semibold whitespace-nowrap transition-transform duration-150 ease-out active:scale-[0.98] sm:px-8 md:h-16 ${soft ? 'rounded-[10px]' : 'rounded-md'}`}
            >
              <span className="sm:hidden">Tìm</span>
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
          </form>

          <nav aria-label="Lối tắt" className="relative mt-4 grid grid-cols-2 gap-2 sm:mt-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-1.5 sm:gap-y-0.5 md:mt-4">
            <span className="col-span-2 text-[0.85rem] text-ink-mute sm:mr-1">Hay tìm:</span>
            {SHORTCUTS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => onNavigate?.(s.page)}
                aria-label={s.label}
                className={`inline-flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 border border-line bg-ivory/70 px-2 py-2.5 text-center text-[0.88rem] leading-tight font-medium whitespace-nowrap text-heritage-ink transition-[background-color,color,border-color] duration-150 hover:border-gold-soft hover:bg-gold-pale/80 hover:text-heritage active:bg-gold-pale sm:h-9 sm:min-h-0 sm:flex-row sm:gap-1.5 sm:border-transparent sm:bg-transparent sm:px-3 sm:py-0 sm:text-[0.9rem] sm:font-normal ${soft ? 'rounded-full' : 'rounded-md'}`}
              >
                <span className="text-[var(--portal-gold-icon)]">{s.icon}</span>
                <span className="sm:hidden">{s.short}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  )
}
