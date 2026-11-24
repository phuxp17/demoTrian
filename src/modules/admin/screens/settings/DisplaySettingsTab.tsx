import React from 'react'
import { Check, Palette } from 'lucide-react'
import { Field, Input, Panel, Select, Toggle } from '@/modules/admin/components'
import { PORTAL_THEMES, type PortalSettings } from '@/services/settings'
import { ThemePreviewCard } from './ThemePreviewCard'

type DisplayState = PortalSettings['display']

export function DisplaySettingsTab({
  display,
  onChange,
  onClearNotice,
}: {
  display: DisplayState
  onChange: (updater: (prev: DisplayState) => DisplayState) => void
  onClearNotice: () => void
}) {
  return (
    <>
      <Panel
        title="Bảng màu & phong cách giao diện"
        description="Chọn hệ màu chủ đạo cho cổng thông tin tri ân. Thay đổi sẽ lưu và đồng bộ ngay khi bấm Lưu cấu hình."
        action={
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gold">
            <Palette className="size-3.5" /> 4 hệ màu sẵn có
          </span>
        }
      >
        <div className="grid gap-2.5 sm:grid-cols-2">
          {PORTAL_THEMES.map((theme) => {
            const active = display.theme === theme.id
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onClearNotice()
                  onChange((d) => ({ ...d, theme: theme.id }))
                }}
                aria-pressed={active}
                className={`relative flex flex-col justify-between rounded-lg border p-4 text-left transition-all duration-150 ${
                  active
                    ? 'border-heritage bg-heritage-tint/45 ring-2 ring-heritage/20'
                    : 'border-line bg-canvas/50 hover:border-line-strong hover:bg-canvas'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{theme.name}</p>
                    <p className="mt-0.5 text-xs font-medium text-heritage-ink">{theme.subtitle}</p>
                  </div>
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                      active ? 'border-heritage bg-heritage text-white' : 'border-line-strong bg-surface'
                    }`}
                  >
                    {active && <Check className="size-3" />}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{theme.description}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  {theme.swatches.map((hex, i) => (
                    <span key={i} title={hex} className="h-5 flex-1 rounded border border-black/15 shadow-xs" style={{ backgroundColor: hex }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-2.5 space-y-2.5 border-t border-line pt-2.5">
          <Toggle
            on={display.metallicGold}
            onChange={(v) => onChange((d) => ({ ...d, metallicGold: v }))}
            label="Ánh kim vàng quỳ & sơn son bóng"
            description="Tạo độ bóng satin trên thanh điều hướng, nút bấm và hiệu ứng vàng quỳ đa sắc cho ấn sen, mái đình, viền khung"
          />
          <Toggle
            on={display.softStyle}
            onChange={(v) => onChange((d) => ({ ...d, softStyle: v }))}
            label="Đường nét mềm mại & bo góc thanh thoát"
            description="Dùng bo góc mềm dịu mắt, khung chân dung thẳng trang nghiêm và nét chữ serif uyển chuyển"
          />
          <Toggle
            on={display.showThemeSwitcher}
            onChange={(v) => onChange((d) => ({ ...d, showThemeSwitcher: v }))}
            label="Hiện nút đổi nhanh bảng màu trên thanh tiện ích công khai"
            description="Cho phép khách truy cập hoặc cán bộ chuyển thử 4 bảng màu ngay trên đầu trang công khai"
          />
        </div>
      </Panel>

      <ThemePreviewCard display={display} />

      <Panel title="Tên gọi & hiển thị cổng thông tin">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field label="Tên hiển thị">
            <Input value={display.siteTitle} onChange={(e) => onChange((d) => ({ ...d, siteTitle: e.target.value }))} />
          </Field>
          <Field label="Phụ đề dưới tên cổng">
            <Input value={display.siteSubtitle} onChange={(e) => onChange((d) => ({ ...d, siteSubtitle: e.target.value }))} />
          </Field>
          <Field label="Câu khẩu hiệu thanh trên" className="sm:col-span-2">
            <Input value={display.motto} onChange={(e) => onChange((d) => ({ ...d, motto: e.target.value }))} />
          </Field>
          <Field label="Ngôn ngữ mặc định">
            <Select value={display.language} onChange={(v) => onChange((d) => ({ ...d, language: v }))} options={['Tiếng Việt', 'English']} />
          </Field>
          <Field label="Số kết quả mỗi trang">
            <Select value={display.pageSize} onChange={(v) => onChange((d) => ({ ...d, pageSize: v }))} options={['20', '50', '100']} />
          </Field>
          <Field label="Bản đồ nền" className="sm:col-span-2">
            <Select
              value={display.mapBase}
              onChange={(v) => onChange((d) => ({ ...d, mapBase: v }))}
              options={['OpenStreetMap', 'Bản đồ vệ tinh', 'Bản đồ địa hình']}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Tương tác của người dân">
        <div className="space-y-2.5">
          <Toggle
            on={display.candle}
            onChange={(v) => onChange((d) => ({ ...d, candle: v }))}
            label="Thắp nến tri ân trực tuyến"
            description="Hiện nút thắp nén hương và số lượt tưởng niệm trên trang chủ và hồ sơ liệt sĩ"
          />
          <Toggle
            on={display.flowers}
            onChange={(v) => onChange((d) => ({ ...d, flowers: v }))}
            label="Dâng hoa"
            description="Cho phép dâng hoa trên trang Bản đồ tri ân"
          />
          <Toggle
            on={display.comments}
            onChange={(v) => onChange((d) => ({ ...d, comments: v }))}
            label="Lời tri ân"
            description="Bình luận phải qua kiểm duyệt trước khi hiện"
          />
          <Toggle
            on={display.birthYear}
            onChange={(v) => onChange((d) => ({ ...d, birthYear: v }))}
            label="Hiện năm sinh chưa xác minh"
            description="Hiển thị kèm dấu “?” khi năm sinh chưa đối chiếu"
          />
        </div>
      </Panel>
    </>
  )
}
