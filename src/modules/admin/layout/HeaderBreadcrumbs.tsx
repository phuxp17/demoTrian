import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { AdminPage } from '@/config/adminNav'

export type AdminCrumb = { label: string; page?: AdminPage }

const SECTION_DEFAULT_PAGE: Record<string, AdminPage> = {
  'Tổng quan': 'work',
  'Hồ sơ': 'soldiers',
  'Nội dung': 'articles',
  'Kiểm duyệt': 'reviews',
  'Dữ liệu': 'import',
  'Hệ thống': 'settings',
}

/**
 * Header breadcrumb navigation: displays all items when they fit, and collapses overflowing
 * middle/leading items into a clickable "..." dropdown button so nothing ever gets cut off awkwardly.
 */
export function HeaderBreadcrumbs({
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
                    className="whitespace-nowrap rounded px-1.5 py-0.5 text-ink-soft transition-colors duration-150 hover:bg-canvas hover:text-heritage"
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
