import React from 'react'
import { Pencil, Plus, Rotate3d } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Chip, Filter, Panel, SearchBox, Status, Table, Thumb, type StatusKey } from '@/modules/admin/components'
import { RED_ADDRESSES } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  query: '',
  kind: 'Tất cả',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

const STATUS: Record<string, StatusKey> = { r3: 'pending', r5: 'draft' }
const HAS_360 = new Set(['r1', 'r2'])
const DOCS: Record<string, number> = { r1: 6, r2: 14, r3: 9, r4: 11, r5: 3, r6: 2 }

export default function RedAddressList(props: Props) {
  const { query, kind, onNavigate } = { ...args, ...props }
  const rows = RED_ADDRESSES.filter((r) => kind === 'Tất cả' || r.kind === kind).filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <AdminShell
      active="redAddresses"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Địa chỉ đỏ' }]}
      title="Địa chỉ đỏ"
      subtitle="Công trình, di tích và địa điểm tưởng niệm trên địa bàn"
      actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => onNavigate?.('redAddressEdit', { id: 'new' })}>Thêm địa chỉ</Btn>}
    >
      <Panel flush>
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <SearchBox value={query} placeholder="Tên công trình, địa điểm" className="w-full sm:w-72" />
          <Filter label="Loại" value={kind} options={['Tất cả', 'Đình, đền', 'Đài tưởng niệm', 'Nhà truyền thống', 'Bia tưởng niệm']} />
          <Filter label="Xếp hạng" value="Tất cả" options={['Tất cả', 'Di tích quốc gia', 'Di tích cấp thành phố', 'Chưa xếp hạng']} />
        </div>
        <Table head={['Địa điểm', 'Loại', 'Xếp hạng', 'Tư liệu', '360°', 'Trạng thái', { label: '', className: 'w-12' }]}>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-canvas/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Thumb src={r.image} className="h-10 w-14" />
                  <div className="min-w-0">
                    <button onClick={() => onNavigate?.('redAddressEdit', { id: r.id })} className="text-left font-medium hover:text-heritage">{r.name}</button>
                    <p className="text-xs text-ink-mute">{r.address}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><Chip>{r.kind}</Chip></td>
              <td className="px-4 py-3 text-[13px] text-ink-soft">{r.rank}</td>
              <td className="px-4 py-3 tabular-nums text-ink-soft">{DOCS[r.id]}</td>
              <td className="px-4 py-3">{HAS_360.has(r.id) ? <Rotate3d className="size-4 text-jade" aria-label="Có 360°" /> : <span className="text-ink-mute">—</span>}</td>
              <td className="px-4 py-3"><Status s={STATUS[r.id] ?? 'published'} /></td>
              <td className="px-4 py-3 text-right">
                <button aria-label="Sửa" onClick={() => onNavigate?.('redAddressEdit', { id: r.id })} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><Pencil className="size-4" /></button>
              </td>
            </tr>
          ))}
        </Table>
        {rows.length === 0 && <p className="px-4 py-12 text-center text-sm text-ink-mute">Không có địa chỉ nào khớp.</p>}
      </Panel>
    </AdminShell>
  )
}
