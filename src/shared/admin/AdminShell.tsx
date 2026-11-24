import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive, BarChart3, Bell, BookOpen, Building2, ChevronRight, ClipboardCheck, Download, Eye, FileText, FolderTree, Home,
  Image as ImageIcon, LayoutDashboard, Landmark, LogOut, Map, Menu, MoreHorizontal, Rotate3d, Settings, ShieldCheck, Upload, UserRound, Users, X,
} from 'lucide-react'
import { ADMIN_NAV, type AdminNavigate, type AdminPage } from './nav'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  work: LayoutDashboard, stats: BarChart3, cemeteries: Building2, soldiers: Archive, mapEditor: Map, merit: UserRound,
  families: Home, redAddresses: Landmark, articles: FileText, homeEditor: BookOpen, media: ImageIcon, tour360: Rotate3d,
  reviews: ClipboardCheck, publicConfig: Eye, import: Upload, export: Download, logs: ShieldCheck, accounts: Users,
  categories: FolderTree, settings: Settings,
}

const SECTION_DEFAULT_PAGE: Record<string, AdminPage> = {
  'Tổng quan': 'work',
  'Hồ sơ': 'soldiers',
  'Nội dung': 'articles',
  'Kiểm duyệt': 'reviews',
  'Dữ liệu': 'import',
  'Hệ thống': 'settings',
}

export type AdminCrumb = { label: string; page?: AdminPage }

type Props = {
  active: AdminPage
  onNavigate?: AdminNavigate
  /** Trail shown in the top header; the last item is the current page. */
  crumbs?: AdminCrumb[]
  title: string
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  /** Let a page (editor, map) own its full height without the padded body. */
  bleed?: boolean
}

export function AdminShell({ active, onNavigate, crumbs = [], title, subtitle, actions, children, bleed }: Props) {
  const [open, setOpen] = useState(false)
  const [barHidden, setBarHidden] = useState(false)
  const lastY = useRef(0)

  /** Reading down hides the tab bar for more room; any move back up brings it straight back. */
  const onScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget
    const y = el.scrollTop
    const nearBottom = el.scrollHeight - el.clientHeight - y < 64
    const dy = y - lastY.current
    if (y < 48) setBarHidden(false)
    // Near the end the scroll range itself changes as the bar folds, so hold state there to avoid flicker.
    else if (!nearBottom && Math.abs(dy) > 8) setBarHidden(dy > 0)
    if (Math.abs(dy) > 8 || y < 48) lastY.current = y
  }

  const go = (p: AdminPage) => {
    setOpen(false)
    onNavigate?.(p)
  }

  return (
    <div data-admin-shell className="flex h-dvh w-full overflow-hidden bg-canvas text-ink">
      <aside className="hidden w-60 shrink-0 lg:flex">
        <Sidebar active={active} go={go} />
      </aside>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
            <button aria-label="Đóng menu" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <motion.div className="absolute inset-y-0 left-0 flex w-64" initial={{ x: -24 }} animate={{ x: 0 }} exit={{ x: -24 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
              <Sidebar active={active} go={go} />
              <button aria-label="Đóng" onClick={() => setOpen(false)} className="absolute right-2 top-3 rounded p-1.5 text-ivory/70 hover:bg-white/10">
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2.5 border-b border-line bg-surface px-3 sm:gap-3 sm:px-4">
          <button aria-label="Mở menu" onClick={() => setOpen(true)} className="-ml-1 hidden shrink-0 rounded-md p-2 text-ink-soft hover:bg-canvas md:inline-flex lg:hidden">
            <Menu className="size-5" />
          </button>
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <span className="grid size-7 place-items-center rounded-md bg-heritage font-serif text-xs font-semibold text-white">TL</span>
          </div>

          <span className="hidden shrink-0 whitespace-nowrap rounded bg-amber-tint px-2 py-1 text-xs font-medium text-amber-ink sm:inline-flex">
            Bản demo
          </span>

          <span className="hidden h-4 w-px shrink-0 bg-line sm:block" aria-hidden="true" />

          <HeaderBreadcrumbs crumbs={crumbs} fallbackTitle={title} onNavigate={go} />

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <a href="/" aria-label="Xem cổng công khai" className="hidden h-9 items-center gap-1.5 rounded-md px-3 text-sm text-ink-soft hover:bg-canvas md:inline-flex">
              <Eye className="size-4" /> Xem cổng
            </a>
            <button type="button" onClick={() => go('reviews')} aria-label="Thông báo kiểm duyệt" className="relative rounded-md p-2 text-ink-soft hover:bg-canvas">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-heritage ring-2 ring-surface" />
            </button>
            <div className="ml-1 flex items-center gap-2.5 border-l border-line pl-3">
              <span className="grid size-8 place-items-center rounded-full bg-heritage-tint text-xs font-semibold text-heritage-ink">TH</span>
              <div className="hidden leading-snug sm:block">
                <p className="text-sm font-medium">Trần Thu Hà</p>
                <p className="text-xs text-ink-mute">Biên tập viên</p>
              </div>
            </div>
          </div>
        </header>

        <main onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto">
          <div className={bleed ? 'flex h-full flex-col' : 'flex min-h-full w-full flex-col gap-2.5 px-2.5 py-2.5 sm:px-3'}>
            <div className={bleed ? 'border-b border-line bg-surface px-3 py-2.5 sm:px-4' : ''}>
              <div className="flex flex-wrap items-end justify-between gap-2.5">
                <div className="min-w-0">
                  <h1 className={bleed ? 'text-lg font-semibold leading-snug' : 'text-xl font-semibold leading-snug tracking-tight sm:text-2xl'}>{title}</h1>
                  {subtitle && <div className="mt-0.5 text-sm text-ink-soft">{subtitle}</div>}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
              </div>
            </div>
            {children}
          </div>
        </main>

        <div
          aria-hidden={barHidden || undefined}
          className={`grid shrink-0 transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none md:hidden ${barHidden ? 'invisible grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className={`transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${barHidden ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}>
              <BottomNav active={active} go={go} onMore={() => setOpen(true)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Header breadcrumb navigation: displays all items when they fit, and collapses overflowing
 * middle/leading items into a clickable "..." dropdown button so nothing ever gets cut off awkwardly.
 */
function HeaderBreadcrumbs({
  crumbs,
  fallbackTitle,
  onNavigate,
}: {
  crumbs: AdminCrumb[]
  fallbackTitle: string
  onNavigate: (page: AdminPage) => void
}) {
  const items = useMemo(() => {
    const raw = crumbs.length > 0 ? crumbs : [{ label: fallbackTitle }]
    return raw.map((c, idx) => ({
      ...c,
      targetPage: idx < raw.length - 1 ? (c.page ?? SECTION_DEFAULT_PAGE[c.label]) : c.page,
    }))
  }, [crumbs, fallbackTitle])

  const trailKey = useMemo(() => items.map((c) => `${c.label}:${c.targetPage ?? ''}`).join('|'), [items])

  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [hiddenIndices, setHiddenIndices] = useState<number[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [trailKey])

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const recompute = () => {
      const avail = container.clientWidth
      if (avail <= 0) return

      const nodes = Array.from(measure.querySelectorAll<HTMLElement>('[data-crumb-idx]'))
      const widths = nodes.map((el) => Math.ceil(el.getBoundingClientRect().width))
      const total = widths.reduce((a, b) => a + b, 0)

      if (total <= avail || items.length <= 1) {
        setHiddenIndices([])
        return
      }

      const ELLIPSIS_SLOT = 52
      const lastIdx = items.length - 1
      const minTailWidth = Math.min(widths[lastIdx] ?? 120, 150)

      // Try keeping items[0] + "..." + as many trailing items as fit
      const firstWidth = widths[0] ?? 0
      if (firstWidth + ELLIPSIS_SLOT + minTailWidth <= avail && items.length >= 3) {
        let used = firstWidth + ELLIPSIS_SLOT + (widths[lastIdx] ?? 0)
        let tailStart = lastIdx
        for (let i = lastIdx - 1; i >= 1; i--) {
          if (used + widths[i] <= avail) {
            used += widths[i]
            tailStart = i
          } else {
            break
          }
        }
        const hidden: number[] = []
        for (let i = 1; i < tailStart; i++) hidden.push(i)
        setHiddenIndices(hidden)
        return
      }

      // Narrow viewport: keep "..." + trailing items (always keeping at least the last item)
      let used = ELLIPSIS_SLOT + (widths[lastIdx] ?? 0)
      let tailStart = lastIdx
      for (let i = lastIdx - 1; i >= 0; i--) {
        if (used + widths[i] <= avail) {
          used += widths[i]
          tailStart = i
        } else {
          break
        }
      }
      const hidden: number[] = []
      for (let i = 0; i < tailStart; i++) hidden.push(i)
      setHiddenIndices(hidden.length > 0 ? hidden : items.length > 1 ? [0] : [])
    }

    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(container)
    return () => ro.disconnect()
  }, [trailKey])

  const hiddenSet = useMemo(() => new Set(hiddenIndices), [hiddenIndices])
  const collapsedItems = hiddenIndices.map((idx) => items[idx]).filter(Boolean)
  const ellipsisInsertedAt = hiddenIndices.length > 0 ? hiddenIndices[0] : -1

  return (
    <div ref={containerRef} className="relative flex min-w-0 flex-1 items-center">
      {/* Off-flow measuring strip for exact pixel widths without expanding viewport */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 flex max-w-full items-center overflow-hidden whitespace-nowrap text-[13px]"
      >
        {items.map((c, i) => (
          <span key={`${c.label}-${i}`} data-crumb-idx={i} className="inline-flex items-center">
            {i > 0 && <ChevronRight className="mx-1 size-3.5 shrink-0" />}
            <span className="px-1 py-0.5 font-medium">{c.label}</span>
          </span>
        ))}
      </div>

      <nav aria-label="Điều hướng vị trí" className="flex min-w-0 w-full items-center text-[13px]">
        <ol className="flex min-w-0 w-full items-center">
          {items.map((c, i) => {
            const isLast = i === items.length - 1
            if (hiddenSet.has(i)) {
              if (i !== ellipsisInsertedAt) return null
              return (
                <li key="ellipsis" className="relative flex shrink-0 items-center">
                  {i > 0 && <ChevronRight className="mx-1 size-3.5 shrink-0 text-ink-mute" aria-hidden="true" />}
                  <div ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpen((o) => !o)}
                      aria-expanded={menuOpen}
                      aria-haspopup="menu"
                      aria-label={`Hiển thị ${collapsedItems.length} mục điều hướng đã thu gọn`}
                      title="Xem các mục điều hướng trước"
                      className={`inline-flex h-7 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors duration-150 ${
                        menuOpen
                          ? 'border-heritage/40 bg-heritage-tint text-heritage-ink'
                          : 'border-line bg-canvas text-ink-soft hover:border-line-strong hover:text-ink'
                      }`}
                    >
                      ...
                    </button>

                    {menuOpen && (
                      <div
                        role="menu"
                        aria-label="Các cấp điều hướng trước"
                        className="absolute top-full left-0 z-50 mt-1.5 min-w-52 max-w-72 rounded-lg border border-line bg-surface p-1.5 shadow-[0_14px_32px_-8px_rgba(24,18,12,0.28)]"
                      >
                        {collapsedItems.map((hiddenItem, hi) => (
                          <button
                            key={`${hiddenItem.label}-${hi}`}
                            type="button"
                            role="menuitem"
                            disabled={!hiddenItem.targetPage}
                            onClick={() => {
                              if (hiddenItem.targetPage) {
                                setMenuOpen(false)
                                onNavigate(hiddenItem.targetPage)
                              }
                            }}
                            className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors duration-150 ${
                              hiddenItem.targetPage
                                ? 'text-ink hover:bg-heritage-tint/70 hover:text-heritage-ink'
                                : 'cursor-default text-ink-mute'
                            }`}
                          >
                            <span className="truncate">{hiddenItem.label}</span>
                            {hiddenItem.targetPage && <ChevronRight className="size-3.5 shrink-0 text-ink-mute" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              )
            }

            return (
              <li key={`${c.label}-${i}`} className={`flex items-center ${isLast ? 'min-w-0' : 'shrink-0'}`}>
                {i > 0 && <ChevronRight className="mx-1 size-3.5 shrink-0 text-ink-mute" aria-hidden="true" />}
                {!isLast && c.targetPage ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(c.targetPage!)}
                    className="rounded px-1.5 py-0.5 text-ink-soft transition-colors duration-150 hover:bg-canvas hover:text-heritage whitespace-nowrap"
                  >
                    {c.label}
                  </button>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    title={c.label}
                    className={`px-1 py-0.5 ${isLast ? 'truncate font-medium text-ink' : 'whitespace-nowrap text-ink-soft'}`}
                  >
                    {c.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

/** Phone-only tab bar: the four places an editor returns to every day, and the full menu behind "Thêm". */
function BottomNav({ active, go, onMore }: { active: AdminPage; go: (p: AdminPage) => void; onMore: () => void }) {
  const section = (title: string) => ADMIN_NAV.find((s) => s.title === title)?.items.flatMap((i) => i.group) ?? []
  const tabs: { label: string; page: AdminPage; group: AdminPage[]; I: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { label: 'Công việc', page: 'work', group: ['work', 'stats'], I: LayoutDashboard },
    { label: 'Hồ sơ', page: 'soldiers', group: section('Hồ sơ'), I: Archive },
    { label: 'Duyệt', page: 'reviews', group: section('Kiểm duyệt'), I: ClipboardCheck, count: 9 },
    { label: 'Nội dung', page: 'articles', group: section('Nội dung'), I: FileText },
  ]
  const moreOn = !tabs.some((t) => t.group.includes(active))
  const item = (on: boolean) =>
    `relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 whitespace-nowrap text-[11px] transition-[color,transform] duration-150 ease-out active:scale-95 ${on ? 'font-medium text-heritage' : 'text-ink-mute'}`

  return (
    <nav aria-label="Điều hướng chính" className="flex h-14 shrink-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      {tabs.map(({ label, page, group, I, count }) => {
        const on = group.includes(active)
        return (
          <button key={page} onClick={() => go(page)} aria-current={on ? 'page' : undefined} className={item(on)}>
            {on && <span className="absolute inset-x-5 top-0 h-0.5 rounded-b bg-heritage" />}
            <span className="relative">
              <I className="size-5" />
              {count ? (
                <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-heritage px-1 text-center text-[10px] font-semibold leading-4 text-white tabular-nums ring-2 ring-surface">{count}</span>
              ) : null}
            </span>
            {label}
          </button>
        )
      })}
      <button onClick={onMore} className={item(moreOn)}>
        {moreOn && <span className="absolute inset-x-5 top-0 h-0.5 rounded-b bg-heritage" />}
        <MoreHorizontal className="size-5" />
        Thêm
      </button>
    </nav>
  )
}

function Sidebar({ active, go }: { active: AdminPage; go: (p: AdminPage) => void }) {
  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-ivory">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-white/10 px-4">
        <span className="grid size-8 place-items-center rounded-md bg-heritage font-serif text-sm font-semibold">TL</span>
        <div className="leading-snug">
          <p className="text-sm font-semibold">Tri ân Thư Lâm</p>
          <p className="text-[11px] text-ivory/55">Trang quản trị</p>
        </div>
      </div>
      <nav aria-label="Menu quản trị" className="admin-sidebar-scroll flex-1 overflow-y-auto px-2.5 py-2.5">
        {ADMIN_NAV.map((s) => (
          <div key={s.title} className="mb-3 last:mb-0">
            <p className="px-2.5 pb-1 text-[11px] font-medium text-ivory/45">{s.title}</p>
            {s.items.map((it) => {
              const on = it.group.includes(active)
              const Icon = ICONS[it.page] ?? FileText
              return (
                <button
                  key={it.page}
                  onClick={() => go(it.page)}
                  aria-current={on ? 'page' : undefined}
                  className={`relative flex h-8 w-full items-center gap-2.5 whitespace-nowrap rounded-md px-2.5 text-[13px] transition-colors duration-150 ${on ? 'bg-white/10 font-medium text-white' : 'text-ivory/70 hover:bg-white/5 hover:text-white'}`}
                >
                  {on && <span className="absolute -left-2.5 top-1.5 h-5 w-[3px] rounded-r bg-gold-soft" />}
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate py-0.5">{it.label}</span>
                  {it.count ? <span className={`ml-auto rounded px-1.5 text-[11px] tabular-nums ${on ? 'bg-gold-soft text-ink' : 'bg-white/10 text-ivory/80'}`}>{it.count}</span> : null}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
      <button onClick={() => go('login')} className="flex h-11 shrink-0 items-center gap-2.5 border-t border-white/10 px-5 text-[13px] text-ivory/60 hover:text-white">
        <LogOut className="size-4" /> Đăng xuất
      </button>
    </div>
  )
}
