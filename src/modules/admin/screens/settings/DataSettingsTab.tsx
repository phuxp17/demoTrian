import React from 'react'
import { Btn, Callout, Field, Panel, Textarea, Toggle } from '@/modules/admin/components'
import type { PortalSettings } from '@/services/settings'

type DataState = PortalSettings['data']

const SECTION_STATES: { k: keyof DataState['sections']; label: string; desc: string }[] = [
  { k: 'soldiers', label: 'Tra cứu liệt sĩ & phần mộ', desc: '3.482 hồ sơ công khai' },
  { k: 'merit', label: 'Người có công', desc: '1.260 hồ sơ công khai' },
  { k: 'families', label: 'Địa chỉ gia đình', desc: 'Đang rà soát tọa độ thôn Liên Hà' },
  { k: 'red', label: 'Địa chỉ đỏ', desc: '37 công trình' },
  { k: 'tour', label: 'Tham quan 360°', desc: '4 nghĩa trang có cảnh 360°' },
]

export function DataSettingsTab({
  data,
  onChange,
  onBackupNotice,
}: {
  data: DataState
  onChange: (updater: (prev: DataState) => DataState) => void
  onBackupNotice: () => void
}) {
  return (
    <>
      <Panel title="Chế độ bảo trì">
        <Toggle
          on={data.maintenance}
          onChange={(v) => onChange((d) => ({ ...d, maintenance: v }))}
          label="Tạm đóng cổng tra cứu"
          description="Người dân thấy thông báo bảo trì; khu quản trị vẫn hoạt động"
        />
        {data.maintenance && (
          <div className="mt-4 space-y-2.5">
            <Callout tone="warn">Cổng công khai đang đóng. Nhớ tắt sau khi cập nhật xong.</Callout>
            <Field label="Thông báo hiển thị">
              <Textarea value={data.maintenanceMessage} onChange={(e) => onChange((d) => ({ ...d, maintenanceMessage: e.target.value }))} />
            </Field>
          </div>
        )}
      </Panel>

      <Panel title="Mục dữ liệu trên cổng công khai" description="Tắt để ẩn cả mục khỏi menu và tìm kiếm" flush>
        <ul className="divide-y divide-line">
          {SECTION_STATES.map((s) => (
            <li key={s.k} className="flex items-center justify-between gap-2.5 px-4 py-3 sm:px-5">
              <span className="min-w-0">
                <span className="block text-sm font-medium">{s.label}</span>
                <span className="block text-xs text-ink-mute">{s.desc}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2.5">
                <span className={`text-xs ${data.sections[s.k] ? 'text-jade-deep' : 'text-ink-mute'}`}>
                  {data.sections[s.k] ? 'Đang mở' : 'Đã ẩn'}
                </span>
                <span className="w-9">
                  <Toggle
                    on={data.sections[s.k]}
                    onChange={(v) =>
                      onChange((d) => ({
                        ...d,
                        sections: { ...d.sections, [s.k]: v },
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
        <Btn size="sm" className="mt-4" onClick={onBackupNotice}>
          Sao lưu ngay
        </Btn>
      </Panel>
    </>
  )
}
