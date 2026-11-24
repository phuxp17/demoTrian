import React, { useState } from 'react'
import { Globe, Lock, Users } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Callout, FormFooter, Panel, Select, Tabs, Toggle } from '@/modules/admin/components'
import { IMG } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  record: 'soldier',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }
type Level = 'public' | 'family' | 'internal'
type Rec = 'soldier' | 'merit' | 'family' | 'red'

const LEVELS: { id: Level; label: string; I: React.ComponentType<{ className?: string }> }[] = [
  { id: 'public', label: 'Công khai', I: Globe },
  { id: 'family', label: 'Thân nhân', I: Users },
  { id: 'internal', label: 'Nội bộ', I: Lock },
]

const FIELDS: Record<Rec, { group: string; rows: [string, Level][] }[]> = {
  soldier: [
    { group: 'Thông tin cơ bản', rows: [['Họ tên, bí danh', 'public'], ['Năm sinh, năm hy sinh', 'public'], ['Quê quán', 'public'], ['Cấp bậc, chức vụ', 'public'], ['Đơn vị', 'public']] },
    { group: 'Hy sinh & an táng', rows: [['Nơi hy sinh', 'public'], ['Vị trí phần mộ', 'public'], ['Ngày quy tập', 'family'], ['Số giấy báo tử', 'internal']] },
    { group: 'Thân nhân', rows: [['Họ tên thân nhân', 'family'], ['Số điện thoại thân nhân', 'internal'], ['Địa chỉ thân nhân', 'internal']] },
  ],
  merit: [
    { group: 'Thông tin cơ bản', rows: [['Họ tên', 'public'], ['Danh hiệu', 'public'], ['Năm sinh – mất', 'public'], ['Quê quán', 'public']] },
    { group: 'Chế độ', rows: [['Mức trợ cấp', 'internal'], ['Số quyết định', 'internal'], ['Tiểu sử', 'public']] },
  ],
  family: [
    { group: 'Gia đình', rows: [['Tên chủ hộ', 'public'], ['Địa chỉ', 'public'], ['Toạ độ chính xác', 'family'], ['Số điện thoại', 'internal']] },
  ],
  red: [
    { group: 'Địa điểm', rows: [['Tên, loại', 'public'], ['Lịch sử', 'public'], ['Giờ mở cửa', 'public'], ['Người liên hệ', 'public'], ['Hồ sơ xếp hạng', 'internal']] },
  ],
}

export default function PublicDataConfig(props: Props) {
  const { record, onNavigate } = { ...args, ...props }
  const [rec, setRec] = useState<Rec>(record as Rec)
  const [levels, setLevels] = useState<Record<string, Level>>({})
  const lv = (k: string, d: Level) => levels[`${rec}:${k}`] ?? d
  const set = (k: string, v: Level) => setLevels((s) => ({ ...s, [`${rec}:${k}`]: v }))
  const changed = Object.keys(levels).length

  return (
    <AdminShell
      active="publicConfig"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Kiểm duyệt' }, { label: 'Dữ liệu công khai' }]}
      title="Cấu hình dữ liệu công khai"
      subtitle="Quyết định trường nào người dân thấy, trường nào chỉ thân nhân đã xác thực hoặc cán bộ thấy"
    >
      <Tabs<Rec>
        value={rec}
        onChange={setRec}
        tabs={[
          { id: 'soldier', label: 'Liệt sĩ & phần mộ' },
          { id: 'merit', label: 'Người có công' },
          { id: 'family', label: 'Địa chỉ gia đình' },
          { id: 'red', label: 'Địa chỉ đỏ' },
        ]}
      />

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-2.5">
          <Panel flush>
            {FIELDS[rec].map((g) => (
              <div key={g.group}>
                <p className="border-b border-line bg-canvas/60 px-5 py-2 text-xs font-medium text-ink-mute">{g.group}</p>
                <ul className="divide-y divide-line">
                  {g.rows.map(([name, d]) => (
                    <li key={name} className="flex flex-wrap items-center justify-between gap-2.5 px-5 py-2.5">
                      <span className="text-sm">{name}</span>
                      <Segment value={lv(name, d)} onChange={(v) => set(name, v)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Panel>

          <Panel title="Tài liệu & hình ảnh">
            <div className="space-y-2.5">
              <Toggle on label="Chỉ công khai ảnh đã có xác nhận đồng ý của gia đình" description="Ảnh chưa xác nhận vẫn lưu trữ, nhưng ẩn khỏi cổng" />
              <Toggle on={false} label="Cho phép tải bản scan giấy tờ gốc" description="Giấy báo tử, quyết định công nhận luôn ẩn với khách" />
              <Toggle on label="Đóng dấu nguồn lên ảnh khi hiển thị" />
              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className="block text-[13px]"><span className="mb-1.5 block font-medium">Hồ sơ chưa xác minh</span><Select options={['Ẩn hoàn toàn', 'Hiện với nhãn “Đang xác minh”']} /></label>
                <label className="block text-[13px]"><span className="mb-1.5 block font-medium">Thân nhân xác thực bằng</span><Select options={['Mã hồ sơ + số điện thoại', 'Tài khoản VNeID']} /></label>
              </div>
            </div>
          </Panel>
        </div>

        <aside className="min-w-0 space-y-2.5 xl:sticky xl:top-0 xl:self-start">
          <Panel title="Người dân sẽ thấy" description="Thẻ hồ sơ trên cổng, theo cấu hình hiện tại">
            <div className="rounded-md border border-line bg-paper p-4">
              <div className="flex gap-2.5">
                <img src={IMG.portraitS1} alt="" className="h-20 w-16 shrink-0 rounded object-cover" />
                <div className="min-w-0">
                  <p className="text-xs text-ink-mute">Liệt sĩ</p>
                  <p className="font-serif text-lg font-semibold leading-tight">Nguyễn Văn Thành</p>
                  <p className="text-[13px] text-ink-soft">1949 – 1972 · Hạ sĩ</p>
                </div>
              </div>
              <dl className="mt-3 space-y-1 text-[13px]">
                {[
                  ['Quê quán', 'Thôn Thụy Lôi, Thư Lâm'],
                  ['Đơn vị', 'Trung đoàn 48, Sư đoàn 320'],
                  ['Hy sinh', 'Thành cổ Quảng Trị'],
                  ['Phần mộ', 'Khu A · Hàng 2 · Mộ 07'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2"><dt className="w-20 shrink-0 text-ink-mute">{k}</dt><dd className="min-w-0">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-3 flex items-center gap-1.5 border-t border-line pt-2 text-xs text-ink-mute"><Lock className="size-3" /> 4 trường ẩn với khách</p>
            </div>
          </Panel>
          <Callout tone="warn">Thay đổi áp dụng ngay cho toàn bộ hồ sơ đã công khai, không cần duyệt lại từng hồ sơ.</Callout>
        </aside>
      </div>

      <FormFooter note={changed ? `${changed} trường đã thay đổi` : 'Chưa có thay đổi'}>
        <Btn variant="ghost" disabled={!changed} onClick={() => setLevels({})}>Hoàn tác</Btn>
        <Btn variant="primary" disabled={!changed}>Lưu cấu hình</Btn>
      </FormFooter>
    </AdminShell>
  )
}

function Segment({ value, onChange }: { value: Level; onChange: (v: Level) => void }) {
  return (
    <div className="inline-flex rounded-md border border-line-strong bg-canvas p-0.5">
      {LEVELS.map(({ id, label, I }) => {
        const on = id === value
        const tone = id === 'public' ? 'text-jade-deep' : id === 'family' ? 'text-sky-ink' : 'text-heritage-ink'
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`inline-flex h-7 items-center gap-1 whitespace-nowrap rounded px-2 text-xs transition-colors duration-150 ${on ? `bg-surface font-medium shadow-sm ${tone}` : 'text-ink-mute hover:text-ink'}`}
          >
            <I className="size-3.5" /> {label}
          </button>
        )
      })}
    </div>
  )
}
