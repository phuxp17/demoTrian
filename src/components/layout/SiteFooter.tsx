import React from 'react'
import { Mail, MapPin, Phone, SlidersHorizontal } from 'lucide-react'
import { MAIN_NAV, UTILITY_NAV, type Navigate } from '@/config/portalNav'
import { usePortalSettings } from '@/services/settings'
import { LotusSeal, MeanderBand, TempleGate } from '@/components/ornaments'

export function SiteFooter({ onNavigate }: { onNavigate?: Navigate }) {
  const { contact, display } = usePortalSettings()
  const gilt = display.metallicGold && display.theme !== 'current-reference'

  return (
    <footer className="portal-footer relative overflow-hidden">
      <div className="portal-gilt-trim relative" aria-hidden="true" />
      <MeanderBand gilt={gilt} className="block text-heritage" height={12} />
      <TempleGate className="pointer-events-none absolute -right-10 bottom-0 hidden w-[520px] text-white/[0.06] lg:block" strokeWidth={1} />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 md:grid-cols-12 md:gap-10 md:px-8 md:py-14">
        <div className="col-span-2 md:col-span-5">
          <div className="flex items-center gap-3">
            <LotusSeal gilt={gilt} className="h-12 w-12 text-gold-soft" />
            <div>
              <p className="font-serif text-2xl font-semibold text-[var(--portal-on-dark)]">{display.siteTitle}</p>
              <p className="text-[0.85rem]">{display.siteSubtitle}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md leading-relaxed opacity-90">
            Nơi lưu giữ thông tin, hình ảnh và ký ức về các anh hùng liệt sĩ, người có công và những địa chỉ đỏ của quê hương.
          </p>
          <ul className="mt-6 space-y-2.5 text-[0.92rem]">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--portal-nav-accent)]" />
              {contact.orgName}
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--portal-nav-accent)]" />
              Đường dây hỗ trợ: {contact.phone}
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--portal-nav-accent)]" />
              Hộp thư góp ý: {contact.email}
            </li>
          </ul>
        </div>
        <nav className="min-w-0 md:col-span-3" aria-label="Tra cứu">
          <p className="font-serif text-lg font-semibold text-[var(--portal-on-dark)]">Tra cứu</p>
          <ul className="mt-3 md:mt-4 md:space-y-2.5">
            {MAIN_NAV.map((n) => (
              <li key={n.page}>
                <button onClick={() => onNavigate?.(n.page)} className="min-h-11 text-left underline-offset-4 hover:text-[var(--portal-nav-accent)] hover:underline md:min-h-0">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="min-w-0 md:col-span-4" aria-label="Thông tin">
          <p className="font-serif text-lg font-semibold text-[var(--portal-on-dark)]">Thông tin</p>
          <ul className="mt-3 md:mt-4 md:space-y-2.5">
            {UTILITY_NAV.map((n) => (
              <li key={n.page}>
                <button onClick={() => onNavigate?.(n.page)} className="min-h-11 text-left underline-offset-4 hover:text-[var(--portal-nav-accent)] hover:underline md:min-h-0">
                  {n.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => onNavigate?.('search')} className="min-h-11 text-left underline-offset-4 hover:text-[var(--portal-nav-accent)] hover:underline md:min-h-0">
                Tìm kiếm toàn cổng
              </button>
            </li>
            <li className="py-2.5 md:py-0">
              <span>Góp tư liệu, đính chính thông tin</span>
            </li>
            <li className="pt-1">
              <a
                href="/admin"
                className="inline-flex min-h-11 items-center gap-1.5 text-[0.88rem] text-[var(--portal-nav-accent)] underline-offset-4 hover:text-white hover:underline md:min-h-0"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                Cấu hình giao diện &amp; Quản trị
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="relative border-t border-[rgba(235,198,118,0.18)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-[0.82rem] opacity-75 md:flex-row md:justify-between md:px-8">
          <p>© 2025 Cổng thông tin {display.siteTitle}.</p>
          <p>Dữ liệu trên trang là dữ liệu minh hoạ, chờ xác minh từ hồ sơ chính thức.</p>
        </div>
      </div>
    </footer>
  )
}
