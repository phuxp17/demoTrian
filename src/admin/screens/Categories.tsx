import React, { useState } from 'react'
import { GripVertical, Pencil, Plus } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Callout, Field, Input, Panel, Select, Toggle } from '../../shared/admin/ui'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  catalog: 'merit-groups',
  adding: false,
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }
type Item = { code: string; name: string; used: number; on: boolean; fields?: string }

const CATALOGS: { id: string; group: string; name: string; desc: string; items: Item[] }[] = [
  {
    id: 'merit-groups', group: 'Nhóm đối tượng', name: 'Đối tượng người có công', desc: 'Quyết định form nhập ở M12 và bộ lọc trên cổng công khai.',
    items: [
      { code: 'BMVNAH', name: 'Bà mẹ Việt Nam anh hùng', used: 42, on: true, fields: 'Quyết định phong tặng, năm phong tặng' },
      { code: 'AHLLVT', name: 'Anh hùng LLVT nhân dân', used: 6, on: true, fields: 'Quyết định, đơn vị' },
      { code: 'TB', name: 'Thương binh', used: 512, on: true, fields: 'Tỷ lệ thương tật, hạng' },
      { code: 'BB', name: 'Bệnh binh', used: 188, on: true, fields: 'Tỷ lệ suy giảm' },
      { code: 'HDKC-CĐHH', name: 'Người HĐKC bị nhiễm chất độc hóa học', used: 231, on: true, fields: 'Tỷ lệ, thế hệ' },
      { code: 'NCCGM', name: 'Người có công giúp đỡ cách mạng', used: 74, on: true },
      { code: 'CBTK', name: 'Cán bộ tiền khởi nghĩa', used: 0, on: false },
    ],
  },
  { id: 'ranks', group: 'Danh mục dùng chung', name: 'Cấp bậc, chức vụ', desc: 'Dùng cho hồ sơ liệt sĩ và người có công.', items: [
    { code: 'B2', name: 'Binh nhì', used: 640, on: true }, { code: 'B1', name: 'Binh nhất', used: 912, on: true }, { code: 'H1', name: 'Hạ sĩ', used: 501, on: true },
    { code: 'TS', name: 'Trung sĩ', used: 388, on: true }, { code: 'TU', name: 'Thượng sĩ', used: 207, on: true }, { code: 'TUY', name: 'Thiếu úy', used: 96, on: true } ] },
  { id: 'hamlets', group: 'Danh mục dùng chung', name: 'Địa bàn (thôn)', desc: 'Phạm vi phụ trách của tài khoản và bộ lọc thống kê.', items: [
    { code: 'VH', name: 'Thôn Vân Hà', used: 1204, on: true }, { code: 'TL', name: 'Thôn Thụy Lâm', used: 1588, on: true },
    { code: 'LH', name: 'Thôn Liên Hà', used: 987, on: true }, { code: 'XN', name: 'Thôn Xuân Nộn', used: 1103, on: true } ] },
  { id: 'cemeteries-zones', group: 'Danh mục dùng chung', name: 'Loại khu mộ', desc: 'Nhãn khu trên sơ đồ nghĩa trang.', items: [
    { code: 'LS', name: 'Khu liệt sĩ', used: 18, on: true }, { code: 'VD', name: 'Khu mộ vô danh', used: 3, on: true }, { code: 'TG', name: 'Khu tưởng niệm', used: 4, on: true } ] },
  { id: 'article-topics', group: 'Cấu hình dữ liệu', name: 'Chuyên mục bài viết', desc: 'Menu “Tin tức” trên cổng công khai.', items: [
    { code: 'TT', name: 'Tin hoạt động', used: 86, on: true }, { code: 'GT', name: 'Gương sáng tri ân', used: 41, on: true }, { code: 'LS', name: 'Lịch sử địa phương', used: 23, on: true }, { code: 'TB', name: 'Thông báo', used: 12, on: false } ] },
  { id: 'media-sources', group: 'Cấu hình dữ liệu', name: 'Nguồn tư liệu', desc: 'Ghi nguồn bắt buộc khi tải lên thư viện media.', items: [
    { code: 'GD', name: 'Gia đình cung cấp', used: 940, on: true }, { code: 'BTLS', name: 'Bảo tàng Lịch sử Quân sự', used: 112, on: true }, { code: 'UBX', name: 'Lưu trữ UBND xã', used: 386, on: true } ] },
]

export default function Categories(props: Props) {
  const { catalog, adding, onNavigate } = { ...args, ...props }
  const [sel, setSel] = useState(catalog)
  const [add, setAdd] = useState(adding)
  const [toggles, setToggles] = useState<Record<string, boolean>>({})
  const cur = CATALOGS.find((c) => c.id === sel) ?? CATALOGS[0]
  const groups = Array.from(new Set(CATALOGS.map((c) => c.group)))

  return (
    <AdminShell
      active="categories"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hệ thống' }, { label: 'Danh mục' }]}
      title="Quản lý danh mục"
      subtitle="Giá trị dùng chung cho các form nhập và bộ lọc"
    >
      <div className="grid gap-2.5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav className="min-w-0">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 lg:hidden">
            {CATALOGS.map((c) => (
              <button key={c.id} onClick={() => setSel(c.id)} className={`h-8 shrink-0 whitespace-nowrap rounded-md px-3 text-sm transition-colors duration-150 ${c.id === sel ? 'bg-ink text-white' : 'bg-surface text-ink-soft hover:bg-ink/5'}`}>{c.name}</button>
            ))}
          </div>
          <div className="hidden space-y-2.5 lg:block">
            {groups.map((g) => (
              <div key={g}>
                <p className="mb-1.5 px-3 text-xs font-medium text-ink-mute">{g}</p>
                <ul>
                  {CATALOGS.filter((c) => c.group === g).map((c) => (
                    <li key={c.id}>
                      <button onClick={() => setSel(c.id)} className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors duration-150 ${c.id === sel ? 'bg-surface font-medium text-ink shadow-[0_0_0_1px_var(--color-line)]' : 'text-ink-soft hover:bg-ink/5'}`}>
                        <span className="truncate">{c.name}</span>
                        <span className="text-xs tabular-nums text-ink-mute">{c.items.length}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <Panel
          flush
          title={cur.name}
          description={cur.desc}
          action={<Btn variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={() => setAdd(true)}>Thêm giá trị</Btn>}
        >
          {add && (
            <div className="border-b border-line bg-gold-pale/20 px-4 py-4 sm:px-5">
              <div className="grid gap-2.5 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)]">
                <Field label="Mã" required><Input placeholder="VD: TNXP" /></Field>
                <Field label="Tên hiển thị" required><Input placeholder="VD: Thanh niên xung phong" /></Field>
                {cur.id === 'merit-groups' ? (
                  <Field label="Trường bổ sung trên form"><Select options={['Không có', 'Quyết định công nhận', 'Tỷ lệ thương tật', 'Đơn vị, thời gian phục vụ']} /></Field>
                ) : (
                  <Field label="Thứ tự"><Select options={['Cuối danh sách', 'Đầu danh sách']} /></Field>
                )}
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setAdd(false)}>Hủy</Btn>
                <Btn size="sm" variant="primary" onClick={() => setAdd(false)}>Lưu</Btn>
              </div>
            </div>
          )}

          <ul className="divide-y divide-line">
            {cur.items.map((it) => {
              const on = toggles[`${cur.id}:${it.code}`] ?? it.on
              return (
                <li key={it.code} className="grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-2.5 px-4 py-3 sm:grid-cols-[1rem_6.5rem_minmax(0,1fr)_7rem_auto_auto] sm:px-5">
                  <GripVertical className="size-4 cursor-grab text-line-strong" aria-label="Kéo để sắp xếp" />
                  <span className="hidden text-xs font-medium tabular-nums text-ink-mute sm:block">{it.code}</span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-medium ${on ? '' : 'text-ink-mute'}`}>{it.name}</span>
                    {it.fields && <span className="block truncate text-xs text-ink-mute">Thêm trường: {it.fields}</span>}
                  </span>
                  <span className="hidden text-right text-[13px] tabular-nums text-ink-soft sm:block">{it.used.toLocaleString('vi-VN')} hồ sơ</span>
                  <span className="w-9"><Toggle on={on} onChange={(v) => setToggles((s) => ({ ...s, [`${cur.id}:${it.code}`]: v }))} /></span>
                  <button aria-label={`Sửa ${it.name}`} className="hidden size-8 place-items-center rounded-md text-ink-mute transition-colors duration-150 hover:bg-ink/5 hover:text-ink sm:grid"><Pencil className="size-3.5" /></button>
                </li>
              )
            })}
          </ul>
          <div className="border-t border-line px-4 py-3 sm:px-5">
            <Callout tone="info">Giá trị đang được hồ sơ sử dụng không xóa được, chỉ tắt để ẩn khỏi form nhập mới.</Callout>
          </div>
        </Panel>
      </div>
    </AdminShell>
  )
}
