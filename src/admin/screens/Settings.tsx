import React, { useMemo, useState } from 'react'
import { Check, ExternalLink, Flame, Palette, RotateCcw, Sparkles } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Callout, Field, FormFooter, Input, Panel, Select, Tabs, Textarea, Toggle } from '../../shared/admin/ui'
import type { AdminNavigate } from '../../shared/admin/nav'
import { LotusSeal, MeanderBand, OrnamentRule } from '../../shared/components/Ornaments'
import {
  DEFAULT_SETTINGS,
  loadSettings,
  PORTAL_THEMES,
  resetSettings,
  saveSettings,
  type PortalSettings,
} from '../../shared/settings'

const args = {
  tab: 'display' as Tab,
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }
type Tab = 'display' | 'contact' | 'data'

const STATES: { k: keyof PortalSettings['data']['sections']; label: string; desc: string }[] = [
  { k: 'soldiers', label: 'Tra cứu liệt sĩ & phần mộ', desc: '3.482 hồ sơ công khai' },
  { k: 'merit', label: 'Người có công', desc: '1.260 hồ sơ công khai' },
  { k: 'families', label: 'Địa chỉ gia đình', desc: 'Đang rà soát tọa độ thôn Liên Hà' },
  { k: 'red', label: 'Địa chỉ đỏ', desc: '37 công trình' },
  { k: 'tour', label: 'Tham quan 360°', desc: '4 nghĩa trang có cảnh 360°' },
]

export default function Settings(props: Props) {
  const { tab, onNavigate } = { ...args, ...props }
  const [t, setT] = useState<Tab>(tab)
  const [saved, setSaved] = useState<PortalSettings>(() => loadSettings())
  const [draft, setDraft] = useState<PortalSettings>(() => loadSettings())
  const [notice, setNotice] = useState<string | null>(null)

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved])

  const handleSave = () => {
    const next = saveSettings(draft)
    setSaved(next)
    setDraft(next)
    setNotice('Đã lưu cấu hình và áp dụng giao diện mới lên cổng thông tin công khai.')
  }

  const handleCancel = () => {
    setDraft(saved)
    setNotice(null)
  }

  const handleReset = () => {
    const def = resetSettings()
    setSaved(def)
    setDraft(def)
    setNotice('Đã khôi phục cấu hình mặc định (Sơn Son Hoàng Kim).')
  }

  const gilt = draft.display.metallicGold && draft.display.theme !== 'current-reference'

  return (
    <AdminShell
      active="settings"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hệ thống' }, { label: 'Cấu hình' }]}
      title="Cấu hình hệ thống & Giao diện"
      subtitle="Tùy biến bảng màu, ánh kim, hiển thị và thông tin liên hệ áp dụng trực tiếp cho cổng Tri ân Thư Lâm"
      actions={
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line-strong bg-surface px-3 text-sm font-medium text-ink hover:bg-canvas"
        >
          <ExternalLink className="size-4" /> Mở cổng công khai
        </a>
      }
    >
      <Tabs<Tab>
        value={t}
        onChange={setT}
        tabs={[
          { id: 'display', label: 'Giao diện & Hiển thị' },
          { id: 'contact', label: 'Thông tin liên hệ' },
          { id: 'data', label: 'Trạng thái dữ liệu' },
        ]}
      />

      {notice && (
        <Callout tone="ok" className="max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>{notice}</span>
            <a href="/" className="font-semibold text-jade-deep underline underline-offset-4">
              Xem cổng ngay →
            </a>
          </div>
        </Callout>
      )}

      <div className="max-w-5xl space-y-2.5">
        {t === 'display' && (
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
                  const active = draft.display.theme === theme.id
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setNotice(null)
                        setDraft((d) => ({ ...d, display: { ...d.display, theme: theme.id } }))
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
                          <span
                            key={i}
                            title={hex}
                            className="h-5 flex-1 rounded border border-black/15 shadow-xs"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-2.5 space-y-2.5 border-t border-line pt-2.5">
                <Toggle
                  on={draft.display.metallicGold}
                  onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, metallicGold: v } }))}
                  label="Ánh kim vàng quỳ & sơn son bóng"
                  description="Tạo độ bóng satin trên thanh điều hướng, nút bấm và hiệu ứng vàng quỳ đa sắc cho ấn sen, mái đình, viền khung"
                />
                <Toggle
                  on={draft.display.softStyle}
                  onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, softStyle: v } }))}
                  label="Đường nét mềm mại & bo góc thanh thoát"
                  description="Dùng bo góc mềm dịu mắt, khung chân dung thẳng trang nghiêm và nét chữ serif uyển chuyển"
                />
                <Toggle
                  on={draft.display.showThemeSwitcher}
                  onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, showThemeSwitcher: v } }))}
                  label="Hiện nút đổi nhanh bảng màu trên thanh tiện ích công khai"
                  description="Cho phép khách truy cập hoặc cán bộ chuyển thử 4 bảng màu ngay trên đầu trang công khai"
                />
              </div>
            </Panel>

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
                data-portal-theme={draft.display.theme}
                data-metallic={draft.display.metallicGold ? 'on' : 'off'}
                data-soft={draft.display.softStyle ? 'on' : 'off'}
                className="overflow-hidden rounded-b-lg bg-[var(--color-paper)] text-[var(--color-ink)] transition-colors duration-200"
              >
                {/* Mini Header Preview */}
                <div className="portal-header-top flex items-center justify-between px-4 py-1.5 text-[11px]">
                  <span className="truncate font-serif italic">{draft.display.motto}</span>
                  <span>A · A+ · A++</span>
                </div>
                <div className="portal-header-main relative flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <LotusSeal gilt={gilt} className="size-7 text-[var(--color-gold-soft)]" />
                    <div>
                      <p className="font-serif text-sm font-semibold leading-tight">{draft.display.siteTitle}</p>
                      <p className="text-[10px] opacity-80">{draft.display.siteSubtitle}</p>
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

                {/* Mini Hero + Featured Card Preview */}
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

                  <div className={`portal-gilt-card p-4 ${draft.display.softStyle ? 'rounded-[16px]' : 'rounded-xl'}`}>
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
                        {draft.display.candle && (
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

            <Panel title="Tên gọi & hiển thị cổng thông tin">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <Field label="Tên hiển thị">
                  <Input
                    value={draft.display.siteTitle}
                    onChange={(e) => setDraft((d) => ({ ...d, display: { ...d.display, siteTitle: e.target.value } }))}
                  />
                </Field>
                <Field label="Phụ đề dưới tên cổng">
                  <Input
                    value={draft.display.siteSubtitle}
                    onChange={(e) => setDraft((d) => ({ ...d, display: { ...d.display, siteSubtitle: e.target.value } }))}
                  />
                </Field>
                <Field label="Câu khẩu hiệu thanh trên" className="sm:col-span-2">
                  <Input
                    value={draft.display.motto}
                    onChange={(e) => setDraft((d) => ({ ...d, display: { ...d.display, motto: e.target.value } }))}
                  />
                </Field>
                <Field label="Ngôn ngữ mặc định">
                  <Select
                    value={draft.display.language}
                    onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, language: v } }))}
                    options={['Tiếng Việt', 'English']}
                  />
                </Field>
                <Field label="Số kết quả mỗi trang">
                  <Select
                    value={draft.display.pageSize}
                    onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, pageSize: v } }))}
                    options={['20', '50', '100']}
                  />
                </Field>
                <Field label="Bản đồ nền" className="sm:col-span-2">
                  <Select
                    value={draft.display.mapBase}
                    onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, mapBase: v } }))}
                    options={['OpenStreetMap', 'Bản đồ vệ tinh', 'Bản đồ địa hình']}
                  />
                </Field>
              </div>
            </Panel>

            <Panel title="Tương tác của người dân">
              <div className="space-y-2.5">
                <Toggle
                  on={draft.display.candle}
                  onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, candle: v } }))}
                  label="Thắp nến tri ân trực tuyến"
                  description="Hiện nút thắp nén hương và số lượt tưởng niệm trên trang chủ và hồ sơ liệt sĩ"
                />
                <Toggle
                  on={draft.display.flowers}
                  onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, flowers: v } }))}
                  label="Dâng hoa"
                  description="Cho phép dâng hoa trên trang Bản đồ tri ân"
                />
                <Toggle
                  on={draft.display.comments}
                  onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, comments: v } }))}
                  label="Lời tri ân"
                  description="Bình luận phải qua kiểm duyệt trước khi hiện"
                />
                <Toggle
                  on={draft.display.birthYear}
                  onChange={(v) => setDraft((d) => ({ ...d, display: { ...d.display, birthYear: v } }))}
                  label="Hiện năm sinh chưa xác minh"
                  description="Hiển thị kèm dấu “?” khi năm sinh chưa đối chiếu"
                />
              </div>
            </Panel>
          </>
        )}

        {t === 'contact' && (
          <>
            <Panel title="Đơn vị quản lý" description="Hiện ở chân trang và trang Giới thiệu">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <Field label="Tên đơn vị" required className="sm:col-span-2">
                  <Input
                    value={draft.contact.orgName}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, orgName: e.target.value } }))}
                  />
                </Field>
                <Field label="Địa chỉ" className="sm:col-span-2">
                  <Input
                    value={draft.contact.address}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, address: e.target.value } }))}
                  />
                </Field>
                <Field label="Điện thoại">
                  <Input
                    value={draft.contact.phone}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, phone: e.target.value } }))}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    value={draft.contact.email}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, email: e.target.value } }))}
                  />
                </Field>
                <Field label="Giờ tiếp nhận" className="sm:col-span-2">
                  <Input
                    value={draft.contact.hours}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, hours: e.target.value } }))}
                  />
                </Field>
              </div>
            </Panel>
            <Panel title="Đầu mối hỗ trợ tra cứu" description="Người dân liên hệ khi không tìm thấy thân nhân">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <Field label="Cán bộ phụ trách">
                  <Input
                    value={draft.contact.supportOfficer}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, supportOfficer: e.target.value } }))}
                  />
                </Field>
                <Field label="Số điện thoại">
                  <Input
                    value={draft.contact.supportPhone}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, supportPhone: e.target.value } }))}
                  />
                </Field>
                <Field label="Lời nhắn trên trang tra cứu" className="sm:col-span-2" hint="Tối đa 200 ký tự">
                  <Textarea
                    value={draft.contact.searchNote}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, searchNote: e.target.value } }))}
                  />
                </Field>
              </div>
            </Panel>
          </>
        )}

        {t === 'data' && (
          <>
            <Panel title="Chế độ bảo trì">
              <Toggle
                on={draft.data.maintenance}
                onChange={(v) => setDraft((d) => ({ ...d, data: { ...d.data, maintenance: v } }))}
                label="Tạm đóng cổng tra cứu"
                description="Người dân thấy thông báo bảo trì; khu quản trị vẫn hoạt động"
              />
              {draft.data.maintenance && (
                <div className="mt-4 space-y-2.5">
                  <Callout tone="warn">Cổng công khai đang đóng. Nhớ tắt sau khi cập nhật xong.</Callout>
                  <Field label="Thông báo hiển thị">
                    <Textarea
                      value={draft.data.maintenanceMessage}
                      onChange={(e) => setDraft((d) => ({ ...d, data: { ...d.data, maintenanceMessage: e.target.value } }))}
                    />
                  </Field>
                </div>
              )}
            </Panel>
            <Panel title="Mục dữ liệu trên cổng công khai" description="Tắt để ẩn cả mục khỏi menu và tìm kiếm" flush>
              <ul className="divide-y divide-line">
                {STATES.map((s) => (
                  <li key={s.k} className="flex items-center justify-between gap-2.5 px-4 py-3 sm:px-5">
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{s.label}</span>
                      <span className="block text-xs text-ink-mute">{s.desc}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2.5">
                      <span className={`text-xs ${draft.data.sections[s.k] ? 'text-jade-deep' : 'text-ink-mute'}`}>
                        {draft.data.sections[s.k] ? 'Đang mở' : 'Đã ẩn'}
                      </span>
                      <span className="w-9">
                        <Toggle
                          on={draft.data.sections[s.k]}
                          onChange={(v) =>
                            setDraft((d) => ({
                              ...d,
                              data: { ...d.data, sections: { ...d.data.sections, [s.k]: v } },
                            }))
                          }
                        />
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Sao lưu">
              <dl className="grid gap-2.5 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-ink-mute">Lần gần nhất</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">18/11/2026 02:00</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-mute">Dung lượng</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">4,2 GB</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-mute">Lịch</dt>
                  <dd className="mt-0.5 font-medium">Hằng ngày, 2:00</dd>
                </div>
              </dl>
              <Btn size="sm" className="mt-4" onClick={() => setNotice('Đã tạo bản sao lưu thủ công.')}>
                Sao lưu ngay
              </Btn>
            </Panel>
          </>
        )}
      </div>

      <FormFooter note={dirty ? 'Có thay đổi chưa lưu' : saved.updatedAt ? `Đã lưu lúc ${saved.updatedAt}` : 'Đang dùng cấu hình mặc định'}>
        <Btn variant="ghost" icon={<RotateCcw className="size-3.5" />} onClick={handleReset}>
          Mặc định
        </Btn>
        <Btn variant="ghost" disabled={!dirty} onClick={handleCancel}>
          Hủy thay đổi
        </Btn>
        <Btn variant="primary" onClick={handleSave}>
          Lưu cấu hình
        </Btn>
      </FormFooter>
    </AdminShell>
  )
}
