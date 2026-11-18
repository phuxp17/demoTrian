import React, { useState } from 'react'
import { ArrowRight, BookOpen, ChevronRight, Flag, Flame, Flower2, Grid3x3, House, Landmark, MapPin, Medal, Search, Shield, Star, UserRound } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { LineArt, RoofCrest } from '../shared/components/Ornaments'
import { Container } from '../shared/components/ui'
import { MemorialMap } from '../shared/components/MemorialMap'
import { IMG, LINE_ART, MAP_POINTS, NEWS, SOLDIERS } from '../shared/data'
import type { Navigate, PageKey } from '../shared/nav'
import { ContributeButton } from '../shared/components/Contribute'

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
  const [q, setQ] = useState('')
  const [mapSel, setMapSel] = useState<string | null>('c1')
  const [incense, setIncense] = useState(false)

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
          <img src={IMG.heroSunrise} alt="Đài tưởng niệm và cổng tam quan trong nắng sớm" className="absolute inset-0 h-full w-full object-cover object-[65%_center]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,19,14,0.78)_0%,rgba(29,19,14,0.45)_45%,rgba(29,19,14,0.05)_75%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(29,19,14,0.35),transparent)]" />
          <Container className="relative flex h-full flex-col justify-center pb-16 md:pb-14">
            <h1 className="max-w-xl font-serif text-[3rem] leading-[1.02] font-medium text-balance text-gold-pale italic sm:text-[3.8rem] md:text-[5rem]">{heroTitle}</h1>
            <svg viewBox="0 0 220 14" className="mt-3 h-3.5 w-48 text-gold-soft md:w-56" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <path d="M2 10 C60 2 140 2 218 7" />
              <path d="M30 11 C80 6 140 6 190 9" opacity="0.5" />
            </svg>
            <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-white/90 sm:text-[1.08rem]">
              Tưởng nhớ các anh hùng liệt sĩ, tri ân người có công với cách mạng — gìn giữ đạo lý tốt đẹp của dân tộc Việt Nam.
            </p>
          </Container>
        </div>

        {/* Search panel */}
        <Container className="relative -mt-14 md:-mt-14">
          <div className="relative mx-auto max-w-4xl px-4 pt-8 pb-4 drop-shadow-[0_22px_28px_rgba(60,30,20,0.28)] sm:px-8 sm:pt-9 sm:pb-5 md:px-12 md:pt-10 md:pb-6">
            {/* frame with scooped (concave) corners: outer gold line, paper, inner gold line, paper */}
            <div className="pointer-events-none absolute inset-0 bg-gold-soft" style={scoop(18)} />
            <div className="pointer-events-none absolute inset-px bg-paper" style={scoop(18)} />
            <div className="pointer-events-none absolute inset-2 bg-gold-soft/80" style={scoop(17)} />
            <div className="pointer-events-none absolute inset-[9px] bg-paper" style={scoop(16.5)} />
            {/* cloud motifs, clipped to the panel */}
            <div className="pointer-events-none absolute inset-[9px] overflow-hidden" style={scoop(16.5)}>
              <LineArt src={LINE_ART.lotusClouds} className="absolute -bottom-6 -left-10 hidden w-56 opacity-50 md:block" />
              <LineArt src={LINE_ART.lotusClouds} className="absolute -right-10 -bottom-6 hidden w-56 -scale-x-100 opacity-50 md:block" />
            </div>
            {/* roof crest rising from the top edge */}
            <RoofCrest className="pointer-events-none absolute -top-[2.3rem] left-1/2 h-auto w-[220px] -translate-x-1/2 sm:-top-12 sm:w-[300px]" />

            <form role="search" onSubmit={(e) => { e.preventDefault(); runSearch() }} className="relative flex gap-2 sm:gap-3">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Tìm tên liệt sĩ, người có công, địa danh</span>
                <Search className="pointer-events-none absolute top-1/2 left-5 hidden h-6 w-6 -translate-y-1/2 text-ink-mute sm:block" />
                <input
                  type="search"
                  enterKeyHint="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="peer h-14 w-full rounded-md border border-line-strong bg-white/75 pr-3 pl-4 text-[1.05rem] focus:border-heritage focus:outline-none sm:pr-4 sm:pl-14 sm:text-[1.08rem] md:h-16 md:text-[1.15rem]"
                />
                {!q && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 left-4 flex items-center truncate text-[1.05rem] text-ink-mute sm:left-14 sm:text-[1.08rem] md:text-[1.15rem]">
                    <span className="truncate sm:hidden">Tên liệt sĩ, địa danh…</span>
                    <span className="hidden truncate sm:inline">Tìm tên liệt sĩ, người có công, địa danh…</span>
                  </span>
                )}
              </label>
              <button type="submit" aria-label="Tìm kiếm" className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-md bg-heritage px-5 text-[1.02rem] sm:px-8 font-semibold whitespace-nowrap text-white shadow-[0_8px_18px_-10px_rgba(124,31,31,0.9)] transition-[background-color,transform] duration-150 ease-out hover:bg-heritage-deep active:scale-[0.98] md:h-16">
                <span className="sm:hidden">Tìm</span>
                <span className="hidden sm:inline">Tìm kiếm</span>
              </button>
            </form>

            <nav aria-label="Lối tắt" className="relative mt-4 grid grid-cols-2 gap-2 sm:mt-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-1 sm:gap-y-0.5 md:mt-4">
              <span className="col-span-2 text-[0.85rem] text-ink-mute sm:mr-1">Hay tìm:</span>
              {SHORTCUTS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => onNavigate?.(s.page)}
                  aria-label={s.label}
                  className="inline-flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-md border border-line bg-white/50 px-2 py-2.5 text-center text-[0.88rem] leading-tight font-medium whitespace-nowrap text-heritage-ink transition-[background-color,color,border-color] duration-150 hover:border-gold-soft hover:bg-gold-pale/70 hover:text-heritage active:bg-gold-pale sm:h-10 sm:min-h-0 sm:flex-row sm:gap-1.5 sm:border-transparent sm:bg-transparent sm:px-2.5 sm:py-0 sm:text-[0.9rem] sm:font-normal"
                >
                  <span className="text-gold">{s.icon}</span>
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
        <LineArt src={LINE_ART.countryside} className="absolute top-6 right-0 hidden w-[620px] opacity-30 lg:block" />
        <Container className="relative">
          <Heading title="Tưởng niệm hôm nay" lead="Mỗi ngày, chúng ta cùng dành một phút để tưởng nhớ, tri ân những người đã cống hiến, hy sinh vì độc lập, tự do của Tổ quốc." />

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <article className="relative rounded-xl border border-gold-soft bg-ivory p-5 shadow-[0_20px_50px_-36px_rgba(60,30,20,0.6)] sm:p-7 lg:col-span-8">
              <div className="pointer-events-none absolute inset-2 rounded-lg border border-gold-soft/50" />
              <div className="relative flex flex-col gap-7 sm:flex-row sm:gap-9">
                <figure className="mx-auto w-52 shrink-0 -rotate-[1.5deg] bg-[#f8f1e1] p-2.5 shadow-[0_14px_30px_-14px_rgba(40,20,10,0.55)] sm:mx-0 sm:w-56">
                  <img src={IMG.portraitS1} alt={`Ảnh minh hoạ liệt sĩ ${featured.name}`} className="aspect-[3/4] w-full object-cover sepia-[0.25]" />
                  <figcaption className="pt-2 text-center text-[0.72rem] text-ink-mute">Ảnh minh hoạ</figcaption>
                </figure>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-gold-soft bg-gold-pale/70 px-3 py-1 text-[0.8rem] font-medium text-heritage-ink">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" /> Nhân vật tưởng niệm tiêu biểu
                  </span>
                  <h3 className="mt-3 font-serif text-[2rem] leading-tight text-heritage sm:text-[2.4rem]">{featured.name}</h3>
                  <p className="font-serif text-lg text-gold">({featured.born} – {featured.died})</p>
                  <dl className="mt-5 space-y-3 text-[0.95rem]">
                    <Fact icon={<House className="h-4 w-4" />} label="Quê quán" value={featured.hometown} />
                    <Fact icon={<Medal className="h-4 w-4" />} label="Cấp bậc" value={featured.rank} />
                    <Fact icon={<Shield className="h-4 w-4" />} label="Đơn vị" value={featured.unit} />
                    <Fact icon={<Flag className="h-4 w-4" />} label="Hy sinh" value={`Năm ${featured.died}, tại ${featured.diedAt}`} />
                  </dl>
                  <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:flex-wrap">
                    <button onClick={() => onNavigate?.('soldier', { id: featured.id })} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-heritage px-5 text-[0.95rem] font-semibold whitespace-nowrap text-white transition-[background-color,transform] duration-150 ease-out hover:bg-heritage-deep active:scale-[0.98]">
                      Xem trang tưởng niệm <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIncense((v) => !v)}
                      aria-pressed={incense}
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-[0.95rem] font-semibold whitespace-nowrap transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.98] ${incense ? 'border-gold bg-gold-pale text-heritage-ink' : 'border-heritage/40 bg-paper text-heritage hover:border-heritage'}`}
                    >
                      <Flame className={`h-4 w-4 ${incense ? 'fill-[#e08a3c] text-[#c2621f]' : ''}`} />
                      {incense ? 'Đã thắp · 1.249 nén hương' : 'Thắp nén hương'}
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <h3 className="flex items-center gap-2.5 font-serif text-[1.3rem] text-heritage-ink">
                <BookOpen className="h-5 w-5 text-gold" strokeWidth={1.5} /> Hồ sơ mới được cập nhật
              </h3>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {recent.map((s) => (
                  <li key={s.id}>
                    <button onClick={() => onNavigate?.('soldier', { id: s.id })} className="group flex w-full items-center gap-3.5 py-3 text-left">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gold-soft bg-parchment text-gold">
                        <UserRound className="h-5 w-5" strokeWidth={1.4} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-[1.05rem] text-ink transition-colors duration-150 group-hover:text-heritage">{s.name}</span>
                        <span className="block truncate text-[0.82rem] text-ink-mute">({s.born} – {s.died}) · {s.hometown.split(',')[0]}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-heritage transition-transform duration-150 group-hover:translate-x-0.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => onNavigate?.('soldiers')} className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-heritage underline decoration-heritage/40 underline-offset-4 hover:decoration-heritage">
                Xem toàn bộ danh sách liệt sĩ <ArrowRight className="h-4 w-4" />
              </button>
            </aside>
          </div>
        </Container>
      </section>

      {/* Spaces of remembrance */}
      <section className="paper-grain relative overflow-hidden py-16 md:py-24">
        <LineArt src={LINE_ART.countryside} className="absolute top-0 left-1/2 w-[1100px] max-w-none -translate-x-1/2 opacity-25" />
        <Container className="relative">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <LineArt src={LINE_ART.gate} className="w-40 opacity-80 md:w-48" />
            <h2 className="mt-2 font-serif text-[2rem] leading-tight font-medium text-heritage-ink sm:text-[2.4rem] md:text-[2.9rem]">Những không gian tưởng niệm</h2>
            <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">Đi tới những địa danh, công trình và tư liệu gắn với sự hy sinh, cống hiến của các thế hệ cha anh trên quê hương Thư Lâm.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              { t: 'Nghĩa trang liệt sĩ', d: 'Nơi an nghỉ của những người con ưu tú của quê hương.', img: IMG.cemetery, p: 'cemeteries' as const, icon: <Landmark className="h-5 w-5" /> },
              { t: 'Người có công', d: 'Những tấm gương cống hiến, phụng sự Tổ quốc.', img: IMG.incense, p: 'merit' as const, icon: <Star className="h-5 w-5" /> },
              { t: 'Địa chỉ đỏ', d: 'Di tích, điểm đến gắn với lịch sử cách mạng.', img: IMG.dinh, p: 'redAddresses' as const, icon: <MapPin className="h-5 w-5" /> },
              { t: 'Thư viện tư liệu', d: 'Ảnh, thư từ, kỷ vật và các nguồn tư liệu quý.', img: IMG.artifacts, p: 'library' as const, icon: <BookOpen className="h-5 w-5" /> },
            ].map((s) => (
              <button key={s.t} onClick={() => onNavigate?.(s.p)} className="group relative flex flex-col rounded-t-[999px] rounded-b-xl border border-gold-soft bg-paper p-2 text-left shadow-[0_18px_40px_-30px_rgba(60,30,20,0.6)] transition-[border-color,transform] duration-200 ease-out hover:-translate-y-1 hover:border-gold">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px]">
                  <img src={s.img} alt="" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
                  <div className="pointer-events-none absolute inset-2 rounded-t-[999px] border border-white/50" />
                </div>
                <span className="relative mx-auto -mt-7 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-paper bg-heritage text-gold-pale shadow-md">{s.icon}</span>
                <span className="flex flex-1 flex-col items-center px-3 pt-3 pb-4 text-center">
                  <span className="font-serif text-[1.3rem] leading-snug text-heritage-ink">{s.t}</span>
                  <span className="mt-1.5 text-[0.9rem] leading-snug text-ink-soft">{s.d}</span>
                  <span className="mt-auto flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-heritage/40 text-heritage transition-[background-color,color] duration-150 group-hover:bg-heritage group-hover:text-white">
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
        <LineArt src={LINE_ART.lotusClouds} className="absolute top-10 -left-16 hidden w-72 opacity-40 xl:block" />
        <Container className="relative">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <Heading title="Câu chuyện tri ân" lead="Những câu chuyện, ký ức và tấm gương giàu ý nghĩa về sự hy sinh, cống hiến vì độc lập, tự do của Tổ quốc." />
            <button onClick={() => onNavigate?.('news')} className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-md border border-heritage/40 px-5 font-semibold whitespace-nowrap text-heritage transition-[background-color,border-color] duration-150 hover:border-heritage hover:bg-heritage-tint md:self-auto">
              Tất cả câu chuyện <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <button onClick={() => onNavigate?.('article', { id: lead.id })} className="group text-left lg:col-span-7">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                <img src={lead.image} alt="" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1 text-[0.8rem] font-medium text-heritage-ink">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" /> Câu chuyện nổi bật
                </span>
              </div>
              <p className="mt-5 text-[0.85rem] text-ink-mute"><span className="font-medium text-heritage">{lead.category}</span> · {lead.date}</p>
              <h3 className="mt-1.5 font-serif text-[1.55rem] leading-snug text-heritage-ink transition-colors duration-150 group-hover:text-heritage sm:text-[1.85rem]">{lead.title}</h3>
              <p className="mt-2.5 max-w-2xl leading-relaxed text-ink-soft">{lead.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-heritage underline decoration-heritage/40 underline-offset-4">Đọc tiếp <ArrowRight className="h-4 w-4" /></span>
            </button>

            <div className="flex flex-col divide-y divide-line lg:col-span-5">
              {side.map((n) => (
                <button key={n.id} onClick={() => onNavigate?.('article', { id: n.id })} className="group flex items-center gap-4 py-5 text-left first:pt-0 sm:gap-5">
                  <img src={n.image} alt="" className="h-20 w-28 shrink-0 rounded-md object-cover sm:h-24 sm:w-36" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.82rem] text-ink-mute"><span className="font-medium text-heritage">{n.category}</span> · {n.date}</span>
                    <span className="mt-1 block font-serif text-[1.1rem] leading-snug text-ink transition-colors duration-150 group-hover:text-heritage sm:text-[1.2rem]">{n.title}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-heritage" />
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="relative overflow-hidden bg-heritage-deep py-16 text-paper md:py-20">
        <LineArt src={LINE_ART.gateLight} light className="absolute -bottom-10 -left-20 w-[520px] opacity-15" />
        <Container className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 className="flex items-center gap-3 font-serif text-[2rem] leading-tight font-medium sm:text-[2.5rem]">
              <MapPin className="h-9 w-9 shrink-0 text-gold-soft" strokeWidth={1.4} /> Bản đồ tri ân
            </h2>
            <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-gold-pale">
              Khám phá các nghĩa trang, địa chỉ đỏ và di tích lịch sử trên địa bàn Thư Lâm — những dấu ấn thiêng liêng của truyền thống cách mạng.
            </p>
            <div className="mt-7 grid max-w-md grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {[
                { l: 'Nghĩa trang liệt sĩ', i: <Landmark className="h-4 w-4" />, p: 'cemeteries' as const },
                { l: 'Địa chỉ đỏ', i: <MapPin className="h-4 w-4" />, p: 'redAddresses' as const },
                { l: 'Di tích lịch sử', i: <Flag className="h-4 w-4" />, p: 'redAddresses' as const },
                { l: 'Gia đình có công', i: <House className="h-4 w-4" />, p: 'merit' as const },
              ].map((c) => (
                <button key={c.l} onClick={() => onNavigate?.(c.p)} className="flex h-11 min-w-0 items-center gap-2 rounded-md border border-white/25 bg-white/5 px-3 text-left text-[0.88rem] whitespace-nowrap transition-[background-color,border-color] duration-150 hover:border-gold-soft hover:bg-white/10">
                  <span className="shrink-0 text-gold-soft">{c.i}</span>
                  <span className="truncate">{c.l}</span>
                </button>
              ))}
            </div>
            <button onClick={() => onNavigate?.('memorialMap')} className="mt-7 inline-flex h-11 items-center gap-2 rounded-md bg-paper px-5 font-semibold whitespace-nowrap text-heritage-ink transition-[background-color,transform] duration-150 ease-out hover:bg-gold-pale active:scale-[0.98]">
              Mở bản đồ đầy đủ <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-xl bg-paper p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] lg:col-span-7">
            <MemorialMap points={MAP_POINTS} selectedId={mapSel} onSelect={setMapSel} className="aspect-square rounded-lg sm:aspect-[4/3] lg:aspect-[16/11]" />
          </div>
        </Container>
      </section>

      {/* Contribute */}
      <section className="paper-grain relative overflow-hidden py-16 md:py-20">
        <LineArt src={LINE_ART.gate} className="absolute right-0 bottom-0 hidden w-80 opacity-35 lg:block" />
        <Container className="relative grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className="overflow-hidden rounded-xl border border-gold-soft bg-paper p-2 md:col-span-5">
            <img src={IMG.letters} alt="Thư từ và ảnh cũ được gia đình lưu giữ" className="aspect-[16/10] w-full rounded-lg object-cover" />
          </div>
          <div className="md:col-span-7 lg:col-span-6">
            <h2 className="font-serif text-[1.8rem] leading-tight text-balance text-heritage-ink sm:text-[2.2rem] md:text-[2.5rem]">Gia đình còn lưu giữ ảnh, thư từ hay kỷ vật?</h2>
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

function Heading({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="max-w-2xl">
      <Star className="mb-2 h-4 w-4 fill-gold text-gold" aria-hidden />
      <h2 className="font-serif text-[2rem] leading-tight font-medium text-heritage-ink sm:text-[2.4rem] md:text-[2.75rem]">{title}</h2>
      <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">{lead}</p>
    </div>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_6.5rem_minmax(0,1fr)] items-start gap-x-3">
      <span className="mt-0.5 text-gold">{icon}</span>
      <dt className="text-ink-mute">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  )
}
