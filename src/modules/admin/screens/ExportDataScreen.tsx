import React, { useState } from 'react'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Callout, Check, Field, Input, Panel, Select, Status, Table } from '@/modules/admin/components'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  dataset: 'soldiers',
  format: 'xlsx',
  state: 'default',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

const DATASETS: { id: string; label: string; count: number; fields: { k: string; on: boolean; internal?: boolean }[] }[] = [
  {
    id: 'soldiers', label: 'Liệt sĩ & phần mộ', count: 3482,
    fields: [
      { k: 'Họ tên', on: true }, { k: 'Năm sinh', on: true }, { k: 'Năm hy sinh', on: true }, { k: 'Quê quán', on: true },
      { k: 'Cấp bậc, đơn vị', on: true }, { k: 'Nghĩa trang', on: true }, { k: 'Vị trí mộ', on: true }, { k: 'Trạng thái hồ sơ', on: false },
      { k: 'Thân nhân liên hệ', on: false, internal: true }, { k: 'Số giấy báo tử', on: false, internal: true },
    ],
  },
  {
    id: 'merit', label: 'Người có công', count: 1260,
    fields: [
      { k: 'Họ tên', on: true }, { k: 'Đối tượng', on: true }, { k: 'Năm sinh', on: true }, { k: 'Địa chỉ', on: true },
      { k: 'Danh hiệu', on: true }, { k: 'Tiểu sử tóm tắt', on: false }, { k: 'Số CCCD', on: false, internal: true }, { k: 'Số điện thoại', on: false, internal: true },
    ],
  },
  {
    id: 'families', label: 'Địa chỉ gia đình', count: 418,
    fields: [{ k: 'Chủ hộ', on: true }, { k: 'Địa chỉ', on: true }, { k: 'Tọa độ', on: true }, { k: 'Nhân vật liên kết', on: true }, { k: 'Số điện thoại', on: false, internal: true }],
  },
  {
    id: 'redAddresses', label: 'Địa chỉ đỏ', count: 37,
    fields: [{ k: 'Tên công trình', on: true }, { k: 'Loại', on: true }, { k: 'Địa chỉ', on: true }, { k: 'Năm xây dựng', on: true }, { k: 'Xếp hạng di tích', on: true }, { k: 'Tọa độ', on: false }],
  },
]

const FORMATS = [
  { id: 'xlsx', label: 'Excel (.xlsx)', note: 'Mở và lọc tiếp được', I: FileSpreadsheet },
  { id: 'csv', label: 'CSV (UTF-8)', note: 'Cho hệ thống khác', I: FileText },
  { id: 'pdf', label: 'PDF danh sách', note: 'Để in, nộp báo cáo', I: FileText },
]

const HISTORY = [
  { file: 'lietsi_toanxa_2026-11-12.xlsx', by: 'Nguyễn Thị Hằng', at: '12/11/2026 16:20', rows: 3471, ready: true },
  { file: 'nguoicocong_thuylam.csv', by: 'Trần Văn Quang', at: '05/11/2026 09:02', rows: 214, ready: true },
  { file: 'diachido_baocao.pdf', by: 'Nguyễn Thị Hằng', at: '28/10/2026 14:47', rows: 37, ready: false },
]

export default function ExportData(props: Props) {
  const { dataset, format, state, onNavigate } = { ...args, ...props }
  const [ds, setDs] = useState(dataset)
  const [fmt, setFmt] = useState(format)
  const [busy, setBusy] = useState(state === 'exporting')
  const cur = DATASETS.find((d) => d.id === ds) ?? DATASETS[0]
  const [fields, setFields] = useState<Record<string, boolean>>({})
  const isOn = (k: string, def: boolean) => fields[`${cur.id}:${k}`] ?? def
  const selected = cur.fields.filter((f) => isOn(f.k, f.on))
  const hasInternal = selected.some((f) => f.internal)

  return (
    <AdminShell
      active="export"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Dữ liệu' }, { label: 'Xuất dữ liệu' }]}
      title="Xuất dữ liệu"
      subtitle="Mỗi lần xuất được ghi vào nhật ký hoạt động"
    >
      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-2.5">
          <Panel title="1. Nhóm dữ liệu">
            <div className="grid gap-2 sm:grid-cols-2">
              {DATASETS.map((d) => {
                const on = d.id === ds
                return (
                  <button
                    key={d.id}
                    onClick={() => setDs(d.id)}
                    className={`flex items-center justify-between gap-2.5 rounded-md border px-3.5 py-3 text-left transition-colors duration-150 ${on ? 'border-heritage bg-heritage-tint/50' : 'border-line hover:border-line-strong hover:bg-canvas'}`}
                  >
                    <span className={`text-sm ${on ? 'font-semibold text-heritage-ink' : 'font-medium'}`}>{d.label}</span>
                    <span className="text-xs tabular-nums text-ink-mute">{d.count.toLocaleString('vi-VN')} hồ sơ</span>
                  </button>
                )
              })}
            </div>
          </Panel>

          <Panel title="2. Phạm vi">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="Địa bàn"><Select options={['Toàn xã Thư Lâm', 'Thôn Vân Hà', 'Thôn Thụy Lâm', 'Thôn Liên Hà', 'Thôn Xuân Nộn']} /></Field>
              {ds === 'soldiers' ? (
                <Field label="Nghĩa trang"><Select options={['Tất cả nghĩa trang', 'NTLS Vân Hà', 'NTLS Thụy Lâm', 'NTLS Liên Hà', 'NTLS Xuân Nộn']} /></Field>
              ) : (
                <Field label="Phân nhóm"><Select options={['Tất cả nhóm', 'Bà mẹ Việt Nam anh hùng', 'Thương binh', 'Bệnh binh', 'Người hoạt động kháng chiến']} /></Field>
              )}
              <Field label="Trạng thái hồ sơ"><Select options={['Chỉ hồ sơ công khai', 'Tất cả trạng thái', 'Chờ duyệt', 'Cần bổ sung']} /></Field>
              <Field label="Cập nhật từ ngày" hint="Để trống để xuất toàn bộ"><Input type="date" /></Field>
            </div>
          </Panel>

          <Panel title="3. Trường dữ liệu" description={`${selected.length}/${cur.fields.length} trường được chọn`}>
            <div className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {cur.fields.map((f) => (
                <Check
                  key={f.k}
                  checked={isOn(f.k, f.on)}
                  onChange={(v) => setFields((s) => ({ ...s, [`${cur.id}:${f.k}`]: v }))}
                  label={
                    <span className="flex items-center gap-2">
                      {f.k}
                      {f.internal && <span className="rounded bg-heritage-tint px-1.5 text-[11px] font-medium text-heritage-ink">Nội bộ</span>}
                    </span>
                  }
                />
              ))}
            </div>
            {hasInternal && (
              <Callout tone="warn" className="mt-4" title="Tệp có thông tin nội bộ">
                Chỉ dùng trong cơ quan. Lý do xuất sẽ được ghi vào nhật ký.
              </Callout>
            )}
          </Panel>
        </div>

        <aside className="min-w-0 space-y-2.5 lg:sticky lg:top-0 lg:self-start">
          <Panel title="Định dạng tệp">
            <div className="space-y-2">
              {FORMATS.map((f) => {
                const on = f.id === fmt
                return (
                  <button key={f.id} onClick={() => setFmt(f.id)} className={`flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors duration-150 ${on ? 'border-heritage bg-heritage-tint/50' : 'border-line hover:bg-canvas'}`}>
                    <f.I className={`size-5 shrink-0 ${on ? 'text-heritage' : 'text-ink-mute'}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{f.label}</span>
                      <span className="block text-xs text-ink-mute">{f.note}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            {hasInternal && (
              <Field label="Lý do xuất" required className="mt-4"><Input placeholder="VD: Báo cáo Phòng LĐ-TB&XH quý IV" /></Field>
            )}
            <div className="mt-2.5 border-t border-line pt-4">
              <p className="text-sm text-ink-soft">Ước tính</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums">{cur.count.toLocaleString('vi-VN')} <span className="text-sm font-normal text-ink-mute">dòng</span></p>
              <Btn variant="primary" className="mt-4 w-full" disabled={busy} onClick={() => setBusy(true)} icon={busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}>
                {busy ? 'Đang tạo tệp…' : 'Xuất dữ liệu'}
              </Btn>
              {busy && <p className="mt-2 text-xs text-ink-mute">Tệp lớn được tạo nền; tải về ở mục Lần xuất gần đây.</p>}
            </div>
          </Panel>
        </aside>
      </div>

      <Panel title="Lần xuất gần đây" className="mt-2.5" flush>
        <Table head={['Tệp', 'Người xuất', 'Thời gian', { label: 'Số dòng', className: 'text-right' }, 'Trạng thái', '']}>
          {busy && (
            <tr>
              <td className="px-4 py-2.5 font-medium">{cur.id}_{new Date().getFullYear()}.{fmt}</td>
              <td className="px-4 py-2.5 text-ink-soft">Bạn</td>
              <td className="px-4 py-2.5 text-ink-soft">Vừa xong</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{cur.count.toLocaleString('vi-VN')}</td>
              <td className="px-4 py-2.5"><Status s="pending" label="Đang tạo" /></td>
              <td className="px-4 py-2.5" />
            </tr>
          )}
          {HISTORY.map((h) => (
            <tr key={h.file}>
              <td className="px-4 py-2.5 font-medium">{h.file}</td>
              <td className="px-4 py-2.5 text-ink-soft">{h.by}</td>
              <td className="px-4 py-2.5 tabular-nums text-ink-soft">{h.at}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{h.rows.toLocaleString('vi-VN')}</td>
              <td className="px-4 py-2.5">{h.ready ? <Status s="active" label="Sẵn sàng" /> : <Status s="hidden" label="Hết hạn" />}</td>
              <td className="px-4 py-2.5 text-right">{h.ready && <Btn size="sm" variant="ghost" icon={<Download className="size-3.5" />}>Tải về</Btn>}</td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AdminShell>
  )
}
