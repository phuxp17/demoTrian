import React, { useState } from 'react'
import { List, Map as MapIcon, MapPin, Pencil, Plus } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Filter, Panel, Pager, SearchBox, Status, Table, type StatusKey } from '@/modules/admin/components'
import { FAMILIES, MAP_POINTS } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  view: 'list',
  query: '',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

const STATUS: Record<string, StatusKey> = { f2: 'returned', f6: 'draft' }
const NO_COORD = new Set(['f6'])

export default function FamilyList(props: Props) {
  const { view: initialView, query, onNavigate } = { ...args, ...props }
  const [view, setView] = useState(initialView)
  const [focus, setFocus] = useState('f1')
  const rows = FAMILIES.filter((f) => (f.head + f.address + f.honoured).toLowerCase().includes(query.toLowerCase()))

  return (
    <AdminShell
      active="families"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Địa chỉ gia đình' }]}
      title="Địa chỉ gia đình"
      subtitle="286 gia đình · 9 chưa có toạ độ"
      actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => onNavigate?.('familyEdit', { id: 'new' })}>Thêm gia đình</Btn>}
    >
      <Panel flush>
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <SearchBox value={query} placeholder="Chủ hộ, địa chỉ, người được tri ân" className="w-full sm:w-80" />
          <Filter label="Loại" value="Tất cả" options={['Tất cả', 'Gia đình liệt sĩ', 'Gia đình Bà mẹ Việt Nam Anh hùng', 'Gia đình có công với cách mạng', 'Gia đình thương binh, bệnh binh']} />
          <Filter label="Thôn" value="Tất cả" options={['Tất cả', 'Thụy Lôi 1', 'Hà Lâm', 'Đào Thục', 'Biểu Khê', 'Cổ Miếu']} />
          <div className="ml-auto inline-flex rounded-md border border-line-strong p-0.5">
            {[['list', 'Danh sách', List], ['map', 'Bản đồ', MapIcon]].map(([id, label, I]) => {
              const Icon = I as typeof List
              return (
                <button key={id as string} onClick={() => setView(id as string)} className={`inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-[13px] transition-colors duration-150 ${view === id ? 'bg-ink text-white' : 'text-ink-soft hover:bg-canvas'}`}>
                  <Icon className="size-3.5" />{label as string}
                </button>
              )
            })}
          </div>
        </div>

        {view === 'list' ? (
          <>
            <Table head={['Gia đình', 'Loại', 'Người được tri ân', 'Toạ độ', 'Trạng thái', { label: '', className: 'w-12' }]}>
              {rows.map((f) => (
                <tr key={f.id} className="hover:bg-canvas/50">
                  <td className="px-4 py-3">
                    <button onClick={() => onNavigate?.('familyEdit', { id: f.id })} className="text-left font-medium hover:text-heritage">{f.head}</button>
                    <p className="text-xs text-ink-mute">{f.address.replace(', TP. Hà Nội', '')}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{f.kind}</td>
                  <td className="px-4 py-3 text-ink-soft">{f.honoured}</td>
                  <td className="px-4 py-3">
                    {NO_COORD.has(f.id) ? <span className="text-[13px] text-heritage">Chưa có</span> : <MapPin className="size-4 text-jade" aria-label="Đã có toạ độ" />}
                  </td>
                  <td className="px-4 py-3"><Status s={STATUS[f.id] ?? 'published'} /></td>
                  <td className="px-4 py-3 text-right">
                    <button aria-label="Sửa" onClick={() => onNavigate?.('familyEdit', { id: f.id })} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><Pencil className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </Table>
            <Pager from={1} to={rows.length} total={286} pages={18} />
          </>
        ) : (
          <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
            <ul className="max-h-[520px] divide-y divide-line overflow-y-auto border-b border-line lg:border-b-0 lg:border-r">
              {rows.map((f) => (
                <li key={f.id}>
                  <button onClick={() => setFocus(f.id)} className={`block w-full px-4 py-3 text-left transition-colors duration-150 ${focus === f.id ? 'bg-gold-pale/40' : 'hover:bg-canvas/60'}`}>
                    <span className="block text-sm font-medium">{f.head}</span>
                    <span className="block text-xs text-ink-mute">{f.address.split(',')[0]} · {f.kind}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="grid-paper relative h-[420px] overflow-hidden lg:h-[520px]">
              <div className="absolute left-[12%] top-0 h-full w-4 bg-sky/20" />
              <div className="absolute left-0 top-[55%] h-2 w-full bg-line-strong/60" />
              {MAP_POINTS.filter((p) => p.kind === 'family').map((p) => (
                <button key={p.id} onClick={() => setFocus(p.id)} style={{ left: `${p.x}%`, top: `${p.y + 20}%` }} className="absolute -translate-x-1/2 -translate-y-full" aria-label={p.name}>
                  <MapPin className={`size-7 drop-shadow ${focus === p.id ? 'fill-heritage text-white' : 'fill-gold text-white'}`} />
                </button>
              ))}
              {(() => {
                const f = FAMILIES.find((x) => x.id === focus)
                const p = MAP_POINTS.find((x) => x.id === focus)
                if (!f) return null
                return (
                  <div className="absolute bottom-3 left-3 right-3 rounded-md border border-line bg-surface p-3 shadow-sm sm:right-auto sm:w-80">
                    <p className="text-sm font-medium">{f.head}</p>
                    <p className="text-xs text-ink-mute">{f.address}</p>
                    {!p && <p className="mt-1 text-xs text-heritage">Gia đình này chưa có toạ độ trên bản đồ.</p>}
                    <Btn size="sm" className="mt-2" onClick={() => onNavigate?.('familyEdit', { id: f.id })}>Sửa thông tin</Btn>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </Panel>
    </AdminShell>
  )
}
