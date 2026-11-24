import React from 'react'
import { Flame, Sparkles } from 'lucide-react'
import { LotusSeal, MeanderBand, OrnamentRule } from '@/components/ornaments'
import { Panel } from '@/modules/admin/components'
import type { PortalSettings } from '@/services/settings'

export function ThemePreviewCard({ display }: { display: PortalSettings['display'] }) {
  const gilt = display.metallicGold && display.theme !== 'current-reference'

  return (
    <Panel
      title="Xem trước trực tiếp"
      description="Mô phỏng thanh điều hướng, tiêu đề lớn và thẻ tưởng niệm theo cấu hình đang chọn"
      action={
        <span className="inline-flex items-center gap-1 text-xs text-ink-mute">
          <Sparkles className="size-3.5 text-gold" /> Cập nhật tức thì
        </span>
      }
      flush
    >
      <div
        data-portal-theme={display.theme}
        data-metallic={display.metallicGold ? 'on' : 'off'}
        data-soft={display.softStyle ? 'on' : 'off'}
        className="overflow-hidden rounded-b-lg bg-[var(--color-paper)] text-[var(--color-ink)] transition-colors duration-200"
      >
        <div className="portal-header-top flex items-center justify-between px-4 py-1.5 text-[11px]">
          <span className="truncate font-serif italic">{display.motto}</span>
          <span>A · A+ · A++</span>
        </div>
        <div className="portal-header-main relative flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <LotusSeal gilt={gilt} className="size-7 text-[var(--color-gold-soft)]" />
            <div>
              <p className="font-serif text-sm font-semibold leading-tight">{display.siteTitle}</p>
              <p className="text-[10px] opacity-80">{display.siteSubtitle}</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-[11px] sm:flex">
            <span
              className="rounded-full px-2.5 py-0.5 ring-1 ring-[var(--portal-nav-pill-ring)]"
              style={{ background: 'var(--portal-nav-pill-active)' }}
            >
              Tra cứu liệt sĩ
            </span>
            <span className="opacity-80">Nghĩa trang</span>
            <span className="opacity-80">Bản đồ tri ân</span>
          </div>
        </div>
        <div className="portal-gilt-trim" />
        <MeanderBand gilt={gilt} className="text-black/15" height={8} />

        <div className="space-y-2.5 p-4 sm:p-5" style={{ backgroundImage: 'var(--portal-canvas-glow)' }}>
          <div className="relative overflow-hidden rounded-xl bg-[#24130f] px-5 py-6">
            <div className="absolute inset-0" style={{ background: 'var(--portal-hero-overlay)' }} />
            <div className="relative">
              <p className="portal-hero-title font-serif text-2xl leading-[1.22] font-medium italic sm:text-3xl">Uống nước nhớ nguồn</p>
              <p className="mt-1 max-w-md text-xs text-[var(--portal-on-dark-soft)]">
                Tưởng nhớ các anh hùng liệt sĩ, tri ân người có công với cách mạng.
              </p>
            </div>
          </div>

          <div className={`portal-gilt-card p-4 ${display.softStyle ? 'rounded-[16px]' : 'rounded-xl'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div>
                <OrnamentRule gilt={gilt} className="mb-1.5 text-[var(--color-gold)]" />
                <p className="font-serif text-lg font-semibold text-[var(--color-heritage-ink)]">Liệt sĩ Nguyễn Văn Thành</p>
                <p className="font-serif text-xs font-semibold text-[var(--color-gold)]">(1949 – 1972) · Thôn Thụy Lôi</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="portal-btn-primary inline-flex h-8 items-center rounded-[8px] px-3 text-xs font-semibold">
                  Xem trang tưởng niệm →
                </span>
                {display.candle && (
                  <span className="portal-btn-secondary inline-flex h-8 items-center gap-1 rounded-[8px] px-3 text-xs font-semibold">
                    <Flame className="size-3.5 text-[var(--portal-gold-icon)]" /> Thắp nén hương
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}
