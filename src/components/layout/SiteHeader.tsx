import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Palette, Search, X } from 'lucide-react'
import { MAIN_NAV, UTILITY_NAV, type Navigate, type PageKey } from '@/config/portalNav'
import { applyPortalAttributes, PORTAL_THEMES, setPortalTheme, usePortalSettings, type ThemeId } from '@/services/settings'
import { LotusSeal, MeanderBand } from '@/components/ornaments'

const SIZES = [17, 19, 21]

export function SiteHeader({ active, onNavigate }: { active?: PageKey; onNavigate?: Navigate }) {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState(0)
  const settings = usePortalSettings()
  const { display } = settings
  const gilt = display.metallicGold && display.theme !== 'current-reference'

  const go = (p: PageKey) => {
    setOpen(false)
    onNavigate?.(p)
  }

  useEffect(() => {
    document.documentElement.style.fontSize = `${SIZES[size]}px`
  }, [size])

  useEffect(() => {
    applyPortalAttributes(display, true)
    document.title = display.siteTitle
  }, [display.theme, display.metallicGold, display.softStyle, display.siteTitle])

  return (
    <header className="sticky -top-10 z-40">
      {/* utility bar: darker satin lacquered strip, scrolls away so only the main bar stays pinned */}
      <div className="portal-header-top text-[0.82rem] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-5 md:px-8">
          <p className="min-w-0 truncate font-serif text-[0.98rem] italic">{display.motto}</p>
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <nav className="hidden items-center gap-5 md:flex" aria-label="Liên kết phụ">
              {UTILITY_NAV.map((n) => (
                <button
                  key={n.page}
                  onClick={() => go(n.page)}
                  className={`transition-colors duration-150 hover:text-[var(--portal-nav-accent)] ${active && n.group.includes(active) ? 'text-white underline underline-offset-4' : ''}`}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            {display.showThemeSwitcher && (
              <label className="hidden items-center gap-1.5 sm:inline-flex">
                <Palette className="h-3.5 w-3.5 text-[var(--portal-nav-accent)]" aria-hidden="true" />
                <span className="sr-only">Chọn bảng màu giao diện</span>
                <select
                  aria-label="Chọn bảng màu giao diện"
                  value={display.theme}
                  onChange={(e) => setPortalTheme(e.target.value as ThemeId)}
                  className="h-7 rounded-full border border-[var(--portal-nav-pill-ring)] bg-black/25 px-2.5 text-[0.76rem] font-medium text-[var(--portal-nav-ink)] focus:outline-none"
                >
                  {PORTAL_THEMES.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#241815] text-[#f8f1e1]">
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex items-center gap-1" role="group" aria-label="Cỡ chữ">
              <span className="mr-1 hidden sm:inline">Cỡ chữ</span>
              {['A', 'A+', 'A++'].map((l, i) => (
                <button
                  key={l}
                  onClick={() => setSize(i)}
                  aria-pressed={size === i}
                  className={`h-7 min-w-8 rounded-full px-2 font-semibold transition-all duration-150 ${
                    size === i
                      ? 'portal-gold-badge'
                      : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="portal-header-main relative shadow-[0_14px_34px_-12px_rgba(15,8,6,0.52)] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300">
        {/* satin sheen overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,236,198,0.1)_0%,rgba(255,236,198,0.02)_45%,rgba(0,0,0,0.08)_100%)]"
          aria-hidden="true"
        />
        {/* specular gilt rim on the top edge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(242,212,144,0.52)_50%,transparent)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:h-20 md:px-8">
          <button onClick={() => go('home')} className="flex min-w-0 items-center gap-3 text-left" aria-label="Về trang chủ">
            <span className={gilt ? 'drop-shadow-[0_2px_6px_rgba(212,168,84,0.3)]' : ''}>
              <LotusSeal gilt={gilt} className="h-9 w-9 shrink-0 text-gold-soft md:h-11 md:w-11" />
            </span>
            <span className="min-w-0">
              <span className="block truncate py-0.5 font-serif text-[1.22rem] leading-snug font-semibold sm:text-[1.45rem]">{display.siteTitle}</span>
              <span className="block truncate text-[0.75rem] leading-snug text-[var(--portal-nav-ink-soft)]">{display.siteSubtitle}</span>
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
                  className={`group relative flex h-20 items-center px-1 text-[0.94rem] font-medium whitespace-nowrap transition-colors duration-150 ${
                    on ? 'text-[#fff7e4]' : 'text-[var(--portal-nav-ink-soft)] hover:text-white'
                  }`}
                >
                  <span
                    className={`rounded-full px-3.5 py-2 transition-all duration-150 ${
                      on
                        ? 'shadow-[inset_0_1px_0_rgba(255,244,214,0.38),inset_0_-1px_0_rgba(0,0,0,0.18)] ring-1 ring-[var(--portal-nav-pill-ring)]'
                        : 'group-hover:bg-white/8'
                    }`}
                    style={on ? { background: 'var(--portal-nav-pill-active)' } : undefined}
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
              className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-[var(--portal-nav-pill-ring)] bg-[linear-gradient(180deg,rgba(255,244,214,0.14)_0%,rgba(255,244,214,0.04)_100%)] px-3 text-[0.92rem] font-medium shadow-[inset_0_1px_0_rgba(255,248,224,0.32)] transition-all duration-150 hover:border-[var(--portal-nav-accent)] hover:bg-white/15 sm:px-4"
              aria-label="Tìm kiếm"
            >
              <Search className="h-4.5 w-4.5 text-[var(--portal-nav-accent)]" />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-white/15 xl:hidden"
              aria-label="Mở menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className="portal-gilt-trim relative" aria-hidden="true" />
        <MeanderBand gilt={gilt} className="relative block text-black/15" height={10} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-0 top-full max-h-[75vh] overflow-y-auto overscroll-contain border-b border-gold-soft/40 bg-paper/95 shadow-[0_20px_40px_-16px_rgba(30,10,10,0.4)] backdrop-blur-2xl backdrop-saturate-150 xl:hidden"
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
              {display.showThemeSwitcher && (
                <li className="pt-3 pb-2">
                  <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
                    <span>Bảng màu giao diện</span>
                    <select
                      value={display.theme}
                      onChange={(e) => setPortalTheme(e.target.value as ThemeId)}
                      className="h-10 rounded-md border border-line-strong bg-ivory px-3 text-ink"
                    >
                      {PORTAL_THEMES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </li>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
