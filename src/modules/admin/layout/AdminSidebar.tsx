import React from 'react'
import {
  Archive, BarChart3, BookOpen, Building2, ClipboardCheck, Download, Eye, FileText, FolderTree, Home,
  Image as ImageIcon, LayoutDashboard, Landmark, LogOut, Map, Rotate3d, Settings, ShieldCheck, Upload, UserRound, Users,
} from 'lucide-react'
import { ADMIN_NAV, type AdminPage } from '@/config/adminNav'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  work: LayoutDashboard, stats: BarChart3, cemeteries: Building2, soldiers: Archive, mapEditor: Map, merit: UserRound,
  families: Home, redAddresses: Landmark, articles: FileText, homeEditor: BookOpen, media: ImageIcon, tour360: Rotate3d,
  reviews: ClipboardCheck, publicConfig: Eye, import: Upload, export: Download, logs: ShieldCheck, accounts: Users,
  categories: FolderTree, settings: Settings,
}

export function AdminSidebar({ active, go }: { active: AdminPage; go: (p: AdminPage) => void }) {
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
