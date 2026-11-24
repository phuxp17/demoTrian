import React from 'react'
import { Map, Pencil, Plus, Rotate3d } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Filter, Panel, SearchBox, Status, Table, Thumb } from '../../shared/admin/ui'
import { CEMETERIES } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  query: '',
  showHidden: false,
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

export default function CemeteryList(props: Props) {
  const { query, showHidden, onNavigate } = { ...args, ...props }
  const rows = [
    ...CEMETERIES.map((c, i) => ({ ...c, mapped: [241, 150, 140, 0][i], status: (i === 3 ? 'draft' : 'published') as 'draft' | 'published' | 'hidden' })),
    ...(showHidden ? [{ ...CEMETERIES[3], id: 'c5', name: 'Bia tưởng niệm cũ thôn Cổ Miếu (đã quy tập)', graves: 0, identified: 0, has360: false, mapped: 0, status: 'hidden' as const }] : []),
  ].filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <AdminShell
      active="cemeteries"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Nghĩa trang' }]}
      title="Nghĩa trang"
      subtitle="4 nghĩa trang liệt sĩ trên địa bàn · 744 phần mộ"
      actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => onNavigate?.('cemeteryEdit', { id: 'new' })}>Thêm nghĩa trang</Btn>}
    >
      <Panel flush>
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <SearchBox value={query} placeholder="Tìm theo tên, địa chỉ" className="w-full sm:w-72" />
          <Filter label="Địa bàn" value="Toàn xã" options={['Toàn xã', 'Xã Thụy Lâm cũ', 'Xã Vân Hà cũ', 'Xã Liên Hà cũ', 'Xã Xuân Nộn cũ']} />
          <Filter label="Trạng thái" value={showHidden ? 'Gồm đã ẩn' : 'Đang dùng'} options={['Đang dùng', 'Gồm đã ẩn']} />
        </div>
        <Table head={['Nghĩa trang', 'Phần mộ', 'Đã xác minh', 'Đã gán sơ đồ', '360°', 'Trạng thái', { label: '', className: 'w-32' }]}>
          {rows.map((c) => {
            const pct = c.graves ? Math.round((c.identified / c.graves) * 100) : 0
            const mapPct = c.graves ? Math.round((c.mapped / c.graves) * 100) : 0
            return (
              <tr key={c.id} className={c.status === 'hidden' ? 'opacity-60' : 'hover:bg-canvas/50'}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Thumb src={c.image} className="h-10 w-14" />
                    <div className="min-w-0">
                      <button onClick={() => onNavigate?.('cemeteryEdit', { id: c.id })} className="text-left font-medium hover:text-heritage">{c.name}</button>
                      <p className="truncate text-xs text-ink-mute">{c.address}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums">{c.graves}</td>
                <td className="px-4 py-3">
                  <Bar pct={pct} tone="bg-jade" />
                </td>
                <td className="px-4 py-3">
                  {mapPct === 0 ? <span className="text-[13px] text-heritage">Chưa có sơ đồ</span> : <Bar pct={mapPct} tone="bg-gold" />}
                </td>
                <td className="px-4 py-3">{c.has360 ? <Rotate3d className="size-4 text-jade" aria-label="Có 360°" /> : <span className="text-ink-mute">—</span>}</td>
                <td className="px-4 py-3"><Status s={c.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Btn size="sm" variant="ghost" icon={<Map className="size-3.5" />} onClick={() => onNavigate?.('mapEditor', { id: c.id })}>Sơ đồ</Btn>
                    <button aria-label="Sửa" onClick={() => onNavigate?.('cemeteryEdit', { id: c.id })} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><Pencil className="size-4" /></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </Table>
      </Panel>
    </AdminShell>
  )
}

function Bar({ pct, tone }: { pct: number; tone: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-canvas"><div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} /></div>
      <span className="text-[13px] tabular-nums text-ink-soft">{pct}%</span>
    </div>
  )
}
