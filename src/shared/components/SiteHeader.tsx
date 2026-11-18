import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, X } from 'lucide-react'
import { MAIN_NAV, UTILITY_NAV, type Navigate, type PageKey } from '../nav'
import { LotusSeal, MeanderBand } from './Ornaments'

const SIZES = [17, 19, 21]

export function SiteHeader({ active, onNavigate }: { active?: PageKey; onNavigate?: Navigate }) {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState(0)
  const go = (p: PageKey) => {
    setOpen(false)
    onNavigate?.(p)
  }

  useEffect(() => {
    document.documentElement.style.fontSize = `${SIZES[size]}px`
  }, [size])

  return (
    <header className="sticky -top-10 z-40">
      {/* utility bar: darker smoked glass, scrolls away so only the main bar stays pinned */}
      <div className="border-b border-white/10 bg-heritage-deep/90 bg-[linear-gradient(90deg,rgba(60,8,8,0.25)_0%,rgba(60,8,8,0.08)_100%)] text-[0.82rem] text-gold-pale backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-5 md:px-8">
          <p className="min-w-0 truncate font-serif italic">Uống nước nhớ nguồn — Tổ quốc ghi công</p>
          <div className="flex shrink-0 items-center gap-5">
            <nav className="hidden items-center gap-5 md:flex" aria-label="Liên kết phụ">
              {UTILITY_NAV.map((n) => (
                <button key={n.page} onClick={() => go(n.page)} className={`hover:text-white ${active && n.group.includes(active) ? 'text-white underline underline-offset-4' : ''}`}>
                  {n.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-1" role="group" aria-label="Cỡ chữ">
              <span className="mr-1 hidden sm:inline">Cỡ chữ</span>
              {['A', 'A+', 'A++'].map((l, i) => (
                <button
                  key={l}
                  onClick={() => setSize(i)}
                  aria-pressed={size === i}
                  className={`h-7 min-w-8 rounded-full px-2 font-semibold transition-colors duration-150 ${size === i ? 'bg-gold-soft text-heritage-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.3)]' : 'hover:bg-white/10'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="relative bg-[#b3262a]/90 text-white shadow-[0_10px_30px_-12px_rgba(90,12,12,0.45)] backdrop-blur-2xl backdrop-saturate-150">
        {/* glass depth: clean red, a touch deeper at the edges */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(110,14,18,0.22)_0%,rgba(110,14,18,0)_45%,rgba(110,14,18,0.18)_100%)]" aria-hidden="true" />
        {/* gloss: a soft sheen on the upper half, kept low so it doesn't glare */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0)_60%)]" aria-hidden="true" />
        {/* specular rim on the top edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08))]" aria-hidden="true" />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:h-20 md:px-8">
          <button onClick={() => go('home')} className="flex min-w-0 items-center gap-3 text-left" aria-label="Về trang chủ">
            <LotusSeal className="h-9 w-9 shrink-0 text-gold-soft md:h-11 md:w-11" />
            <span className="min-w-0">
              <span className="block truncate font-serif text-[1.15rem] leading-tight font-medium sm:text-[1.35rem]">Tri ân Thư Lâm</span>
              <span className="block truncate text-[0.75rem] text-gold-pale">Cổng thông tin tưởng niệm</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Điều hướng chính">
            {MAIN_NAV.map((n) => {
              const on = active ? n.group.includes(active) : false
              return (
                <button
                  key={n.page}
                  onClick={() => go(n.page)}
                  aria-current={on ? 'page' : undefined}
                  className={`group relative flex h-20 items-center px-1 text-[0.95rem] font-medium whitespace-nowrap transition-colors duration-150 ${on ? 'text-white' : 'text-white/85 hover:text-white'}`}
                >
                  <span
                    className={`rounded-full px-3.5 py-2 transition-colors duration-150 ${
                      on
                        ? 'bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.12)] ring-1 ring-white/15'
                        : 'group-hover:bg-white/8'
                    }`}
                  >
                    {n.label}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => go('search')}
              className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 text-[0.95rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition-colors duration-150 hover:bg-white/18 sm:px-4"
              aria-label="Tìm kiếm"
            >
              <Search className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
            <button onClick={() => setOpen((o) => !o)} className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-white/15 xl:hidden" aria-label="Mở menu" aria-expanded={open}>
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        <MeanderBand className="relative block text-black/15" height={10} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-0 top-full max-h-[75vh] overflow-y-auto overscroll-contain border-b border-white/60 bg-paper/85 shadow-[0_20px_40px_-16px_rgba(60,10,10,0.35)] backdrop-blur-2xl backdrop-saturate-150 xl:hidden"
            aria-label="Menu di động"
          >
            <ul className="mx-auto max-w-7xl px-5 py-3 md:px-8">
              {[{ label: 'Trang chủ', page: 'home' as PageKey, group: ['home' as PageKey] }, ...MAIN_NAV, ...UTILITY_NAV].map((n) => {
                const on = active ? n.group.includes(active) : false
                return (
                  <li key={n.page}>
                    <button
                      onClick={() => go(n.page)}
                      className={`flex h-13 w-full items-center border-b border-line text-left text-[1.05rem] ${on ? 'font-semibold text-heritage' : 'text-ink'}`}
                    >
                      {n.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
