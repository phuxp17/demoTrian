import React, { useState } from 'react'
import { Download, EyeOff, ImageOff, MapPin, Pencil, Plus, RotateCcw, Upload } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Check, Filter, Panel, Pager, SearchBox, Status, Table, Tabs, type StatusKey } from '@/modules/admin/components'
import { soldierCode } from '@/data/admin.mock'
import { SOLDIERS, CEMETERIES } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  tab: 'all',
  query: '',
  selected: 0,
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

const STATUS_BY_ID: Record<string, StatusKey> = { s10: 'returned', s13: 'pending', s14: 'pending', s12: 'pending', s16: 'draft' }
const UNPLACED = new Set(['s14', 's16'])

export default function SoldierList(props: Props) {
  const { tab: initialTab, query, selected, onNavigate } = { ...args, ...props }
  const [tab, setTab] = useState(initialTab)
  const [picked, setPicked] = useState<Set<string>>(() => new Set(SOLDIERS.slice(0, selected).map((s) => s.id)))

  const all = SOLDIERS.map((s) => ({ ...s, status: STATUS_BY_ID[s.id] ?? ('published' as StatusKey), placed: !UNPLACED.has(s.id) }))
  const hiddenRows = [{ ...SOLDIERS[13], id: 'sx', name: 'Ngô Văn S. (bản trùng)', status: 'hidden' as StatusKey, placed: false }]
  const source = tab === 'hidden' ? hiddenRows : all
  const rows = source
    .filter((s) => (tab === 'pending' ? s.status === 'pending' : tab === 'returned' ? s.status === 'returned' : tab === 'unplaced' ? !s.placed : true))
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))

  const toggle = (id: string) => setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  const allOn = rows.length > 0 && rows.every((r) => picked.has(r.id))

  return (
    <AdminShell
      active="soldiers"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Liệt sĩ & phần mộ' }]}
      title="Liệt sĩ & phần mộ"
      subtitle="744 hồ sơ · 683 đã xác minh · 18 chưa gán vị trí mộ"
      actions={
        <>
          <Btn icon={<Upload className="size-4" />} onClick={() => onNavigate?.('import')}>Nhập Excel</Btn>
          <Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => onNavigate?.('soldierEdit', { id: 'new' })}>Thêm hồ sơ</Btn>
        </>
      }
    >
      <Panel flush>
        <Tabs
          className="px-3"
          value={tab}
          onChange={(t) => { setTab(t); setPicked(new Set()) }}
          tabs={[
            { id: 'all', label: 'Tất cả', count: 744 },
            { id: 'pending', label: 'Chờ duyệt', count: 3 },
            { id: 'returned', label: 'Cần bổ sung', count: 1 },
            { id: 'unplaced', label: 'Chưa gán mộ', count: 18 },
            { id: 'hidden', label: 'Đã ẩn', count: 1 },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <SearchBox value={query} placeholder="Họ tên, mã hồ sơ, quê quán" className="w-full sm:w-72" />
          <Filter label="Nghĩa trang" value="Tất cả" options={['Tất cả', ...CEMETERIES.map((c) => c.name.replace('Nghĩa trang Liệt sĩ', 'NTLS'))]} />
          <Filter label="Năm hy sinh" value="Tất cả" options={['Tất cả', '1945–1954', '1955–1975', 'Sau 1975']} />
          <Filter label="Ảnh" value="Tất cả" options={['Tất cả', 'Có ảnh', 'Chưa có ảnh']} />
        </div>

        {picked.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-gold-pale/40 px-4 py-2 text-sm">
            <span className="font-medium">Đã chọn {picked.size}</span>
            <span className="mx-1 h-4 w-px bg-line-strong" />
            {tab === 'hidden' ? (
              <Btn size="sm" variant="ghost" icon={<RotateCcw className="size-3.5" />}>Khôi phục</Btn>
            ) : (
              <>
                <Btn size="sm" variant="ghost">Gửi duyệt</Btn>
                <Btn size="sm" variant="ghost" icon={<Download className="size-3.5" />}>Xuất</Btn>
                <Btn size="sm" variant="ghost" icon={<EyeOff className="size-3.5" />} className="text-heritage">Ẩn</Btn>
              </>
            )}
            <button onClick={() => setPicked(new Set())} className="ml-auto text-[13px] text-ink-mute hover:text-ink">Bỏ chọn</button>
          </div>
        )}

        <Table head={[{ label: '', className: 'w-10' }, 'Họ tên', 'Sinh – Hy sinh', 'Quê quán', 'Vị trí mộ', 'Trạng thái', { label: '', className: 'w-24' }]}>
          {rows.map((s) => (
            <tr key={s.id} className={s.status === 'hidden' ? 'bg-canvas/40 text-ink-mute' : picked.has(s.id) ? 'bg-gold-pale/25' : 'hover:bg-canvas/50'}>
              <td className="px-4 py-3"><Check checked={picked.has(s.id)} onChange={() => toggle(s.id)} /></td>
              <td className="px-4 py-3">
                <button onClick={() => onNavigate?.('soldierEdit', { id: s.id })} className="text-left font-medium text-ink hover:text-heritage">{s.name}</button>
                <p className="flex items-center gap-1.5 text-xs text-ink-mute">
                  <span className="tabular-nums">{soldierCode(s.id)}</span>·<span>{s.rank}</span>
                  {!s.photo && <ImageOff className="size-3" aria-label="Chưa có ảnh" />}
                </p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 tabular-nums">{s.born} – {s.died}</td>
              <td className="px-4 py-3 text-ink-soft">{s.hometown.replace(', Thư Lâm', '')}</td>
              <td className="px-4 py-3">
                {s.placed ? (
                  <span className="text-[13px]">
                    <span className="block text-ink-soft">{s.cemetery.replace('Nghĩa trang Liệt sĩ', 'NTLS')}</span>
                    <span className="text-ink-mute">{s.plot}</span>
                  </span>
                ) : (
                  <button onClick={() => onNavigate?.('mapEditor')} className="inline-flex items-center gap-1 text-[13px] text-heritage hover:underline"><MapPin className="size-3.5" /> Gán vị trí</button>
                )}
              </td>
              <td className="px-4 py-3"><Status s={s.status} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  {s.status === 'hidden' ? (
                    <Btn size="sm" variant="ghost" icon={<RotateCcw className="size-3.5" />}>Khôi phục</Btn>
                  ) : (
                    <button aria-label="Sửa" onClick={() => onNavigate?.('soldierEdit', { id: s.id })} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><Pencil className="size-4" /></button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {rows.length === 0 && <p className="px-4 py-12 text-center text-sm text-ink-mute">Không có hồ sơ nào khớp bộ lọc.</p>}
        <div className="flex items-center gap-2.5 border-t border-line px-4 py-2">
          <Check checked={allOn} onChange={(v) => setPicked(v ? new Set(rows.map((r) => r.id)) : new Set())} label={<span className="text-[13px] text-ink-mute">Chọn cả trang</span>} />
        </div>
        <Pager from={1} to={rows.length} total={tab === 'all' ? 744 : rows.length} pages={tab === 'all' ? 47 : 1} />
      </Panel>
    </AdminShell>
  )
}
