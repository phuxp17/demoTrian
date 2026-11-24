import React, { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Eye, Menu, X } from 'lucide-react'
import type { AdminNavigate, AdminPage } from '@/config/adminNav'
import { AdminBottomNav } from './AdminBottomNav'
import { AdminSidebar } from './AdminSidebar'
import { HeaderBreadcrumbs, type AdminCrumb } from './HeaderBreadcrumbs'

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
        <AdminSidebar active={active} go={go} />
      </aside>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
            <button aria-label="Đóng menu" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <motion.div className="absolute inset-y-0 left-0 flex w-64" initial={{ x: -24 }} animate={{ x: 0 }} exit={{ x: -24 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
              <AdminSidebar active={active} go={go} />
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
              <AdminBottomNav active={active} go={go} onMore={() => setOpen(true)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
