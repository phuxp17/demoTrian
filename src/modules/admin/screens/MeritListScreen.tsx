import React, { useState } from 'react'
import { Link2, Pencil, Plus, Upload } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Filter, Initials, Panel, Pager, SearchBox, Status, Table, type StatusKey } from '@/modules/admin/components'
import { MERIT } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  group: 'Tất cả',
  query: '',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

const GROUPS: [string, number][] = [
  ['Tất cả', 412],
  ['Bà mẹ Việt Nam Anh hùng', 38],
  ['Thương binh', 146],
  ['Bệnh binh', 61],
  ['Người hoạt động kháng chiến', 129],
  ['Người có công giúp đỡ cách mạng', 38],
]

const STATUS: Record<string, StatusKey> = { m4: 'pending', m5: 'draft' }
const LINKED: Record<string, string> = { m1: 'Gia đình ông Nguyễn Văn Hùng', m3: 'Gia đình ông Lê Văn Dũng', m4: 'Gia đình bà Phạm Thị Hoa', m5: 'Gia đình ông Đặng Văn Long' }

export default function MeritList(props: Props) {
  const { group: initialGroup, query, onNavigate } = { ...args, ...props }
  const [group, setGroup] = useState(initialGroup)
  const rows = MERIT.filter((m) => group === 'Tất cả' || m.category === group).filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <AdminShell
      active="merit"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Người có công' }]}
      title="Người có công"
      subtitle="412 hồ sơ thuộc 5 nhóm đối tượng"
      actions={
        <>
          <Btn icon={<Upload className="size-4" />} onClick={() => onNavigate?.('import')}>Nhập Excel</Btn>
          <Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => onNavigate?.('meritEdit', { id: 'new' })}>Thêm hồ sơ</Btn>
        </>
      }
    >
      <div className="grid gap-2.5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Nhóm đối tượng" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-0.5 lg:px-0">
          <p className="hidden px-2.5 pb-2 text-xs font-medium text-ink-mute lg:block">Nhóm đối tượng</p>
          {GROUPS.map(([g, n]) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`flex h-9 shrink-0 items-center justify-between gap-2.5 whitespace-nowrap rounded-md px-2.5 text-left text-sm transition-colors duration-150 lg:w-full ${group === g ? 'bg-surface font-medium text-ink shadow-sm ring-1 ring-line' : 'text-ink-soft hover:bg-surface/60'}`}
            >
              <span className="truncate">{g}</span>
              <span className="text-xs tabular-nums text-ink-mute">{n}</span>
            </button>
          ))}
        </nav>

        <Panel flush>
          <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
            <SearchBox value={query} placeholder="Họ tên, quê quán" className="w-full sm:w-72" />
            <Filter label="Thôn" value="Tất cả" options={['Tất cả', 'Thụy Lôi', 'Hà Lâm', 'Đào Thục', 'Biểu Khê', 'Cổ Miếu', 'Mạnh Tân']} />
            <Filter label="Trạng thái" value="Tất cả" options={['Tất cả', 'Công khai', 'Chờ duyệt', 'Nháp', 'Đã ẩn']} />
          </div>
          <Table head={['Họ tên', 'Diện đối tượng', 'Quê quán', 'Gia đình liên kết', 'Trạng thái', { label: '', className: 'w-12' }]}>
            {rows.map((m) => (
              <tr key={m.id} className="hover:bg-canvas/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Initials name={m.name} />
                    <div className="min-w-0">
                      <button onClick={() => onNavigate?.('meritEdit', { id: m.id })} className="text-left font-medium hover:text-heritage">{m.name}</button>
                      <p className="text-xs tabular-nums text-ink-mute">{m.years}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{m.title}</td>
                <td className="px-4 py-3 text-ink-soft">{m.hometown.replace(', Thư Lâm', '')}</td>
                <td className="px-4 py-3">
                  {LINKED[m.id] ? (
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-soft"><Link2 className="size-3.5 text-ink-mute" />{LINKED[m.id]}</span>
                  ) : (
                    <span className="text-[13px] text-ink-mute">Chưa liên kết</span>
                  )}
                </td>
                <td className="px-4 py-3"><Status s={STATUS[m.id] ?? 'published'} /></td>
                <td className="px-4 py-3 text-right">
                  <button aria-label="Sửa" onClick={() => onNavigate?.('meritEdit', { id: m.id })} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><Pencil className="size-4" /></button>
                </td>
              </tr>
            ))}
          </Table>
          {rows.length === 0 && <p className="px-4 py-12 text-center text-sm text-ink-mute">Không có hồ sơ nào trong nhóm này khớp tìm kiếm.</p>}
          <Pager from={1} to={rows.length} total={GROUPS.find(([g]) => g === group)?.[1] ?? rows.length} pages={group === 'Tất cả' ? 26 : 3} />
        </Panel>
      </div>
    </AdminShell>
  )
}
