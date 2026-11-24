import React, { useState } from 'react'
import { ArrowRight, BookOpen, ChevronRight, Flag, Flame, Flower2, Grid3x3, House, Landmark, MapPin, Medal, Search, Shield, Star, UserRound } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { CornerFlourish, LineArt, OrnamentRule, RoofCrest } from '../shared/components/Ornaments'
import { Button, Container } from '../shared/components/ui'
import { MemorialMap } from '../shared/components/MemorialMap'
import { IMG, LINE_ART, MAP_POINTS, NEWS, SOLDIERS } from '../shared/data'
import type { Navigate, PageKey } from '../shared/nav'
import { ContributeButton } from '../shared/components/Contribute'
import { usePortalSettings } from '../shared/settings'

export const args = {
  heroTitle: 'Uống nước nhớ nguồn',
}

export const argTypes = {
  heroTitle: { control: 'text' },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

/** The things people come to the site for most often, one tap from the search box. */
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

export default function HomePage(props: Props) {
  const { heroTitle, onNavigate } = { ...args, ...props }
  const { display } = usePortalSettings()
  const [q, setQ] = useState('')
  const [mapSel, setMapSel] = useState<string | null>('c1')
  const [incense, setIncense] = useState(false)

  const gilt = display.metallicGold && display.theme !== 'current-reference'
  const soft = display.softStyle && display.theme !== 'current-reference'

  const runSearch = () => {
    const text = q.trim()
    onNavigate?.('search', { query: text })
  }

  const featured = SOLDIERS[0]
  const recent = SOLDIERS.slice(1, 6)
  const lead = NEWS[1]
  const side = [NEWS[2], NEWS[0], NEWS[3]]

  return (
    <div className="min-h-full overflow-x-clip bg-paper font-sans text-ink">
      <SiteHeader active="home" onNavigate={onNavigate} />

      {/* Hero */}
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

        {/* Search panel */}
        <Container className="relative z-10 -mt-14 md:-mt-15">
          <div
            className="relative mx-auto max-w-4xl px-4 pt-8 pb-4 sm:px-8 sm:pt-9 sm:pb-5 md:px-12 md:pt-10 md:pb-6"
            style={{ filter: 'drop-shadow(var(--portal-stele-shadow))' }}
          >
            {/* frame with scooped (concave) corners: metallic gold outer line, card sheen, inner gold line, card sheen */}
            <div className="pointer-events-none absolute inset-0" style={{ ...scoop(soft ? 21 : 18), background: 'var(--portal-gold-foil)' }} />
            <div className="pointer-events-none absolute inset-[2px]" style={{ ...scoop(soft ? 20 : 18), background: 'var(--portal-card-sheen)' }} />
            <div className="pointer-events-none absolute inset-[8.5px] opacity-85" style={{ ...scoop(soft ? 18.5 : 17), background: 'var(--portal-gold-foil-soft)' }} />
            <div className="pointer-events-none absolute inset-[10px]" style={{ ...scoop(soft ? 18 : 16.5), background: 'var(--portal-card-sheen)' }} />

            {/* cloud motifs, clipped to the panel */}
            <div className="pointer-events-none absolute inset-[10px] overflow-hidden" style={scoop(soft ? 18 : 16.5)}>
              <LineArt src={LINE_ART.lotusClouds} className="absolute -bottom-6 -left-10 hidden w-56 opacity-40 md:block" />
              <LineArt src={LINE_ART.lotusClouds} className="absolute -right-10 -bottom-6 hidden w-56 -scale-x-100 opacity-40 md:block" />
            </div>

            {/* roof crest rising from the top edge */}
            <RoofCrest gilt={gilt} fill="var(--portal-stele-top, var(--color-paper))" className="pointer-events-none absolute -top-[2.3rem] left-1/2 h-auto w-[220px] -translate-x-1/2 drop-shadow-[0_2px_6px_rgba(135,96,34,0.22)] sm:-top-12 sm:w-[300px]" />

            <form role="search" onSubmit={(e) => { e.preventDefault(); runSearch() }} className="relative flex gap-2 sm:gap-3">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Tìm tên liệt sĩ, người có công, địa danh</span>
                <Search className="pointer-events-none absolute top-1/2 left-5 hidden h-5.5 w-5.5 -translate-y-1/2 text-[var(--portal-gold-icon)] sm:block" />
                <input
                  type="search"
                  enterKeyHint="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className={`peer h-14 w-full border border-line-strong bg-paper/85 pr-3 pl-4 text-[1.05rem] shadow-[inset_0_2px_5px_rgba(55,36,16,0.06)] focus:border-gold focus:outline-none sm:pr-4 sm:pl-14 sm:text-[1.08rem] md:h-16 md:text-[1.15rem] ${soft ? 'rounded-[10px]' : 'rounded-md'}`}
                />
                {!q && (
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

      {/* Featured memorial */}
      <section className="relative py-16 md:py-24">
        <LineArt src={LINE_ART.countryside} className="absolute top-6 right-0 hidden w-[620px] opacity-25 lg:block" />
        <Container className="relative">
          <Heading gilt={gilt} title="Tưởng niệm hôm nay" lead="Mỗi ngày, chúng ta cùng dành một phút để tưởng nhớ, tri ân những người đã cống hiến, hy sinh vì độc lập, tự do của Tổ quốc." />

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
                    {display.candle && (
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

      {/* Spaces of remembrance */}
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
            {[
              { t: 'Nghĩa trang liệt sĩ', d: 'Nơi an nghỉ của những người con ưu tú của quê hương.', img: IMG.cemetery, p: 'cemeteries' as const, icon: <Landmark className="h-5 w-5" /> },
              { t: 'Người có công', d: 'Những tấm gương cống hiến, phụng sự Tổ quốc.', img: IMG.incense, p: 'merit' as const, icon: <Star className="h-5 w-5" /> },
              { t: 'Địa chỉ đỏ', d: 'Di tích, điểm đến gắn với lịch sử cách mạng.', img: IMG.dinh, p: 'redAddresses' as const, icon: <MapPin className="h-5 w-5" /> },
              { t: 'Thư viện tư liệu', d: 'Ảnh, thư từ, kỷ vật và các nguồn tư liệu quý.', img: IMG.artifacts, p: 'library' as const, icon: <BookOpen className="h-5 w-5" /> },
            ].map((s) => (
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

      {/* Stories */}
      <section className="relative py-16 md:py-24">
        <LineArt src={LINE_ART.lotusClouds} className="absolute top-10 -left-16 hidden w-72 opacity-35 xl:block" />
        <Container className="relative">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <Heading gilt={gilt} title="Câu chuyện tri ân" lead="Những câu chuyện, ký ức và tấm gương giàu ý nghĩa về sự hy sinh, cống hiến vì độc lập, tự do của Tổ quốc." />
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

      {/* Map */}
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
              {[
                { l: 'Nghĩa trang liệt sĩ', i: <Landmark className="h-4 w-4" />, p: 'cemeteries' as const },
                { l: 'Địa chỉ đỏ', i: <MapPin className="h-4 w-4" />, p: 'redAddresses' as const },
                { l: 'Di tích lịch sử', i: <Flag className="h-4 w-4" />, p: 'redAddresses' as const },
                { l: 'Gia đình có công', i: <House className="h-4 w-4" />, p: 'merit' as const },
              ].map((c) => (
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
              <MemorialMap points={MAP_POINTS} selectedId={mapSel} onSelect={setMapSel} className="aspect-square rounded-lg sm:aspect-[4/3] lg:aspect-[16/11]" />
            </div>
          </div>
        </Container>
      </section>

      {/* Contribute */}
      <section className="paper-grain relative overflow-hidden py-16 md:py-20">
        <LineArt src={LINE_ART.gate} className="absolute right-0 bottom-0 hidden w-80 opacity-30 lg:block" />
        <Container className="relative grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className={`portal-gilt-card overflow-hidden p-2 md:col-span-5 ${soft ? 'rounded-[16px]' : 'rounded-xl'}`}>
            <img src={IMG.letters} alt="Thư từ và ảnh cũ được gia đình lưu giữ" className={`portal-photo aspect-[16/10] w-full object-cover ${soft ? 'rounded-[11px]' : 'rounded-lg'}`} />
          </div>
          <div className="md:col-span-7 lg:col-span-6">
            <h2 className="font-serif text-[1.8rem] leading-tight font-semibold text-balance text-heritage-ink sm:text-[2.2rem] md:text-[2.5rem]">Gia đình còn lưu giữ ảnh, thư từ hay kỷ vật?</h2>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ink-soft">
              Hãy cùng chia sẻ, đóng góp tư liệu để làm giàu thêm kho lưu trữ tri ân. Ban quản lý sẽ liên hệ để số hoá và hoàn trả nguyên vẹn bản gốc cho gia đình.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ContributeButton size="lg">Góp tư liệu</ContributeButton>
              <ContributeButton size="lg" variant="secondary" topic="Đính chính thông tin">Đính chính thông tin</ContributeButton>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function Heading({ title, lead, gilt }: { title: string; lead: string; gilt: boolean }) {
  return (
    <div className="max-w-2xl">
      <OrnamentRule gilt={gilt} className="mb-3 text-gold" />
      <h2 className="font-serif text-[2rem] leading-tight font-semibold text-heritage-ink sm:text-[2.45rem] md:text-[2.85rem]">{title}</h2>
      <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">{lead}</p>
    </div>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_6.5rem_minmax(0,1fr)] items-start gap-x-3">
      <span className="mt-0.5 text-[var(--portal-gold-icon)]">{icon}</span>
      <dt className="text-ink-mute">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  )
}
