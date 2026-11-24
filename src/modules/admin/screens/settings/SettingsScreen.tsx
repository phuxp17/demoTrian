import React, { useMemo, useState } from 'react'
import { ExternalLink, RotateCcw } from 'lucide-react'
import type { AdminNavigate } from '@/config/adminNav'
import { Btn, Callout, FormFooter, Tabs } from '@/modules/admin/components'
import { AdminShell } from '@/modules/admin/layout'
import { loadSettings, resetSettings, saveSettings, type PortalSettings } from '@/services/settings'
import { ContactSettingsTab } from './ContactSettingsTab'
import { DataSettingsTab } from './DataSettingsTab'
import { DisplaySettingsTab } from './DisplaySettingsTab'

type Tab = 'display' | 'contact' | 'data'
type Props = { tab?: Tab; onNavigate?: AdminNavigate }

export default function SettingsScreen({ tab = 'display', onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(tab)
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
        value={activeTab}
        onChange={setActiveTab}
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
        {activeTab === 'display' && (
          <DisplaySettingsTab
            display={draft.display}
            onChange={(updater) => setDraft((d) => ({ ...d, display: updater(d.display) }))}
            onClearNotice={() => setNotice(null)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSettingsTab
            contact={draft.contact}
            onChange={(updater) => setDraft((d) => ({ ...d, contact: updater(d.contact) }))}
          />
        )}

        {activeTab === 'data' && (
          <DataSettingsTab
            data={draft.data}
            onChange={(updater) => setDraft((d) => ({ ...d, data: updater(d.data) }))}
            onBackupNotice={() => setNotice('Đã tạo bản sao lưu thủ công.')}
          />
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
