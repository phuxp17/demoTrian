import React from 'react'
import { Archive, ClipboardCheck, FileText, LayoutDashboard, MoreHorizontal } from 'lucide-react'
import { ADMIN_NAV, type AdminPage } from '@/config/adminNav'

/** Phone-only tab bar: the four places an editor returns to every day, and the full menu behind "Thêm". */
export function AdminBottomNav({ active, go, onMore }: { active: AdminPage; go: (p: AdminPage) => void; onMore: () => void }) {
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
