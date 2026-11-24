import React, { useState } from 'react'
import { Check, Download, FileSpreadsheet, Upload } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Callout, Field, Panel, Select, Table, Tabs } from '@/modules/admin/components'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  step: 'preview',
  dataset: 'Liệt sĩ & phần mộ',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }
type Step = 'upload' | 'preview' | 'done'
type RowState = 'ok' | 'error' | 'dup'

const ROWS: { n: number; name: string; born: string; died: string; plot: string; s: RowState; note?: string }[] = [
  { n: 2, name: 'Nguyễn Văn Đông', born: '1948', died: '1970', plot: 'Khu B · Hàng 5 · Mộ 01', s: 'ok' },
  { n: 3, name: 'Trần Văn Lực', born: '1951', died: '1972', plot: 'Khu B · Hàng 5 · Mộ 02', s: 'ok' },
  { n: 4, name: 'Ngô Văn Sinh', born: '1949', died: '1971', plot: 'Khu B · Hàng 3 · Mộ 05', s: 'dup', note: 'Trùng LS-0014 (họ tên, năm sinh, vị trí mộ)' },
  { n: 5, name: 'Phùng Văn Hải', born: '195?', died: '1973', plot: 'Khu B · Hàng 5 · Mộ 04', s: 'error', note: 'Năm sinh không hợp lệ' },
  { n: 6, name: 'Lê Đình Khôi', born: '1947', died: '1968', plot: 'Khu B · Hàng 5 · Mộ 05', s: 'ok' },
  { n: 7, name: 'Đỗ Văn Thịnh', born: '1950', died: '1972', plot: 'Khu E · Hàng 1 · Mộ 02', s: 'error', note: 'Khu E không có trong sơ đồ nghĩa trang' },
  { n: 8, name: 'Vương Văn Tú', born: '1952', died: '1974', plot: 'Khu B · Hàng 5 · Mộ 07', s: 'ok' },
  { n: 9, name: 'Nguyễn Văn Bé', born: '1953', died: '1975', plot: 'Khu B · Hàng 5 · Mộ 08', s: 'error', note: 'Thiếu quê quán' },
]

const STEPS: { id: Step; label: string }[] = [
  { id: 'upload', label: 'Tải tệp lên' },
  { id: 'preview', label: 'Kiểm tra dữ liệu' },
  { id: 'done', label: 'Hoàn tất' },
]

export default function ImportExcel(props: Props) {
  const { step, dataset, onNavigate } = { ...args, ...props }
  const [cur, setCur] = useState<Step>(step as Step)
  const [filter, setFilter] = useState<'all' | RowState>('all')
  const idx = STEPS.findIndex((s) => s.id === cur)
  const rows = ROWS.filter((r) => filter === 'all' || r.s === filter)

  return (
    <AdminShell
      active="import"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Dữ liệu' }, { label: 'Nhập Excel' }]}
      title="Nhập dữ liệu từ Excel"
      subtitle="Hồ sơ nhập vào được lưu ở trạng thái chờ duyệt"
    >
      <ol className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-2">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            {i > 0 && <span className={`h-px w-6 sm:w-12 ${i <= idx ? 'bg-heritage' : 'bg-line-strong'}`} />}
            <span className={`grid size-6 place-items-center rounded-full text-xs font-semibold ${i < idx ? 'bg-heritage text-white' : i === idx ? 'border-2 border-heritage text-heritage' : 'border border-line-strong text-ink-mute'}`}>
              {i < idx ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={`whitespace-nowrap text-sm ${i === idx ? 'font-semibold' : 'text-ink-mute'}`}>{s.label}</span>
          </li>
        ))}
      </ol>

      {cur === 'upload' && (
        <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Panel>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="Loại dữ liệu" required><Select options={['Liệt sĩ & phần mộ', 'Người có công', 'Địa chỉ gia đình']} value={dataset} /></Field>
              <Field label="Nghĩa trang"><Select options={['NTLS Vân Hà', 'NTLS Thụy Lâm', 'NTLS Liên Hà', 'NTLS Xuân Nộn']} /></Field>
            </div>
            <button onClick={() => setCur('preview')} className="mt-2.5 flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line-strong bg-canvas/50 px-6 py-12 text-center transition-colors duration-150 hover:border-gold hover:bg-gold-pale/20">
              <Upload className="size-6 text-ink-mute" />
              <span className="text-sm font-medium">Kéo tệp .xlsx vào đây hoặc bấm để chọn</span>
              <span className="text-xs text-ink-mute">Tối đa 5.000 dòng, 10 MB</span>
            </button>
          </Panel>
          <Panel title="Dùng tệp mẫu">
            <p className="text-[13px] leading-relaxed text-ink-soft">Tệp mẫu có sẵn các cột bắt buộc, danh sách chọn cho cấp bậc, nghĩa trang, khu – hàng. Giữ nguyên dòng tiêu đề.</p>
            <Btn className="mt-3 w-full" icon={<Download className="size-4" />}>Tải mẫu liệt sĩ (.xlsx)</Btn>
            <ul className="mt-4 space-y-1 text-xs text-ink-mute">
              <li>Bắt buộc: Họ tên, năm sinh, năm hy sinh, quê quán</li>
              <li>Vị trí mộ ghi dạng “Khu B · Hàng 5 · Mộ 01”</li>
            </ul>
          </Panel>
        </div>
      )}

      {cur === 'preview' && (
        <div className="space-y-2.5">
          <Panel>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="size-8 text-jade" />
                <div>
                  <p className="text-sm font-semibold">lietsi_vanha_dot3.xlsx</p>
                  <p className="text-xs text-ink-mute">{dataset} · NTLS Vân Hà · 48 dòng</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span><b className="text-lg font-semibold tabular-nums text-jade-deep">44</b> hợp lệ</span>
                <span><b className="text-lg font-semibold tabular-nums text-heritage">3</b> lỗi</span>
                <span><b className="text-lg font-semibold tabular-nums text-amber-ink">1</b> nghi trùng</span>
              </div>
              <Btn size="sm" variant="ghost" className="ml-auto" onClick={() => setCur('upload')}>Chọn tệp khác</Btn>
            </div>
          </Panel>

          <Callout tone="warn" title="3 dòng lỗi sẽ bị bỏ qua">Sửa trong tệp rồi tải lên lại, hoặc tiếp tục nhập 44 dòng hợp lệ. Dòng nghi trùng cần chọn cách xử lý.</Callout>

          <Panel flush>
            <Tabs<'all' | RowState>
              className="px-2"
              value={filter}
              onChange={setFilter}
              tabs={[{ id: 'all', label: 'Tất cả', count: 48 }, { id: 'error', label: 'Lỗi', count: 3 }, { id: 'dup', label: 'Nghi trùng', count: 1 }, { id: 'ok', label: 'Hợp lệ', count: 44 }]}
            />
            <Table primary={1} head={[{ label: 'Dòng', className: 'w-16' }, 'Họ tên', 'Năm sinh', 'Hy sinh', 'Vị trí mộ', 'Kiểm tra']}>
              {rows.map((r) => (
                <tr key={r.n} className={r.s === 'error' ? 'bg-heritage-tint/40' : r.s === 'dup' ? 'bg-amber-tint/50' : ''}>
                  <td className="px-4 py-2.5 tabular-nums text-ink-mute">{r.n}</td>
                  <td className="px-4 py-2.5 font-medium">{r.name}</td>
                  <td className={`px-4 py-2.5 tabular-nums ${r.note?.includes('Năm sinh') ? 'font-semibold text-heritage' : ''}`}>{r.born}</td>
                  <td className="px-4 py-2.5 tabular-nums">{r.died}</td>
                  <td className={`px-4 py-2.5 ${r.note?.includes('Khu E') ? 'font-semibold text-heritage' : 'text-ink-soft'}`}>{r.plot}</td>
                  <td className="px-4 py-2.5 text-[13px]">
                    {r.s === 'ok' && <span className="inline-flex items-center gap-1 text-jade-deep"><Check className="size-3.5" /> Hợp lệ</span>}
                    {r.s === 'error' && <span className="text-heritage-ink">{r.note}</span>}
                    {r.s === 'dup' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-amber-ink">{r.note}</span>
                        <Select options={['Bỏ qua dòng này', 'Cập nhật hồ sơ cũ', 'Vẫn tạo mới']} className="w-44" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
          </Panel>

          <div className="flex flex-wrap justify-end gap-2">
            <Btn variant="ghost" icon={<Download className="size-4" />}>Tải báo cáo lỗi</Btn>
            <Btn variant="primary" onClick={() => setCur('done')}>Nhập 44 hồ sơ</Btn>
          </div>
        </div>
      )}

      {cur === 'done' && (
        <Panel>
          <div className="flex flex-col items-start gap-2.5 py-4 sm:flex-row sm:items-center">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-jade-tint text-jade"><Check className="size-6" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold">Đã nhập 44 hồ sơ liệt sĩ vào NTLS Vân Hà</p>
              <p className="mt-1 text-sm text-ink-soft">Hồ sơ đang chờ duyệt. 3 dòng lỗi và 1 dòng trùng đã bỏ qua, ghi trong nhật ký hoạt động.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => setCur('upload')}>Nhập tệp khác</Btn>
              <Btn variant="primary" onClick={() => onNavigate?.('reviews')}>Tới hàng chờ duyệt</Btn>
            </div>
          </div>
        </Panel>
      )}
    </AdminShell>
  )
}
