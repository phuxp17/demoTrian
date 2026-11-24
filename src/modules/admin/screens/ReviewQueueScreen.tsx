import React, { useState } from 'react'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Check, Chip, Filter, Panel, SearchBox, Status, Table, Tabs } from '@/modules/admin/components'
import { REVIEWS, type ReviewItem } from '@/data/admin.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  tab: 'pending',
  kind: 'Tất cả',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }
type Tab = ReviewItem['status']

const DONE: ReviewItem[] = [
  { id: 'p1', title: 'Liệt sĩ Nguyễn Văn Quý', kind: 'Liệt sĩ', change: 'Bổ sung đơn vị, nơi hy sinh', by: 'Lê Văn Bình', at: '17/09/2025 10:42', status: 'published', waitDays: 0 },
  { id: 'p2', title: 'Hướng dẫn tra cứu thông tin liệt sĩ', kind: 'Bài viết', change: 'Sửa ảnh minh hoạ', by: 'Trần Thu Hà', at: '16/09/2025 15:20', status: 'published', waitDays: 0 },
  { id: 'p3', title: 'Đình Đào Thục', kind: 'Địa chỉ đỏ', change: 'Thêm 4 mốc lịch sử', by: 'Trần Thu Hà', at: '15/09/2025 09:05', status: 'published', waitDays: 0 },
]

export default function ReviewQueue(props: Props) {
  const { tab, kind, onNavigate } = { ...args, ...props }
  const [t, setT] = useState<Tab>(tab as Tab)
  const [picked, setPicked] = useState<string[]>([])
  const all = [...REVIEWS, ...DONE]
  const rows = all.filter((r) => r.status === t).filter((r) => kind === 'Tất cả' || r.kind === kind).sort((a, b) => b.waitDays - a.waitDays)
  const n = (s: Tab) => all.filter((r) => r.status === s).length
  const overdue = REVIEWS.filter((r) => r.status === 'pending' && r.waitDays >= 3).length

  return (
    <AdminShell
      active="reviews"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Kiểm duyệt' }, { label: 'Hàng chờ duyệt' }]}
      title="Hàng chờ duyệt"
      subtitle="Hồ sơ và nội dung chỉ hiện trên cổng sau khi được phê duyệt"
    >
      {t === 'pending' && overdue > 0 && (
        <p className="mb-4 flex items-center gap-2 text-[13px] text-amber-ink">
          <AlertTriangle className="size-4" /> {overdue} mục đã chờ từ 3 ngày trở lên, được xếp lên đầu.
        </p>
      )}
      <Panel flush>
        <Tabs<Tab>
          className="px-2"
          value={t}
          onChange={(v) => { setT(v); setPicked([]) }}
          tabs={[
            { id: 'pending', label: 'Chờ xác nhận', count: n('pending') },
            { id: 'returned', label: 'Đã trả sửa', count: n('returned') },
            { id: 'published', label: 'Đã công khai', count: n('published') },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          {picked.length > 0 ? (
            <>
              <span className="text-sm font-medium">Đã chọn {picked.length}</span>
              <Btn size="sm" variant="success">Duyệt & công khai</Btn>
              <Btn size="sm" onClick={() => setPicked([])}>Bỏ chọn</Btn>
            </>
          ) : (
            <>
              <SearchBox placeholder="Tên hồ sơ, người gửi" className="w-full sm:w-64" />
              <Filter label="Loại" value={kind} options={['Tất cả', 'Liệt sĩ', 'Người có công', 'Địa chỉ đỏ', 'Bài viết', 'Gia đình', 'Media']} />
              <Filter label="Người gửi" value="Tất cả" options={['Tất cả', 'Lê Văn Bình', 'Đỗ Thị Mai', 'Trần Thu Hà', 'Hoàng Thị Yến']} />
            </>
          )}
        </div>
        <Table head={[{ label: '', className: 'w-10' }, 'Hồ sơ', 'Thay đổi', 'Người gửi', t === 'published' ? 'Duyệt lúc' : 'Gửi lúc', 'Trạng thái', { label: '', className: 'w-24' }]}>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-canvas/50">
              <td className="px-4 py-3">
                {t === 'pending' && <Check checked={picked.includes(r.id)} onChange={(v) => setPicked((p) => (v ? [...p, r.id] : p.filter((x) => x !== r.id)))} />}
              </td>
              <td className="px-4 py-3">
                <button onClick={() => onNavigate?.('reviewDetail', { id: r.id })} className="text-left font-medium hover:text-heritage">{r.title}</button>
                <div className="mt-0.5"><Chip>{r.kind}</Chip></div>
              </td>
              <td className="max-w-xs px-4 py-3 text-[13px] text-ink-soft">
                {r.change.includes('nghi trùng') ? (
                  <span>{r.change.replace(' · nghi trùng', '')} · <b className="font-medium text-heritage">nghi trùng</b></span>
                ) : r.change}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{r.by}</td>
              <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink-soft">
                {r.at}
                {r.status === 'pending' && <p className={`text-xs ${r.waitDays >= 3 ? 'font-medium text-amber-ink' : 'text-ink-mute'}`}>Chờ {r.waitDays} ngày</p>}
              </td>
              <td className="px-4 py-3"><Status s={r.status} label={r.status === 'returned' ? 'Đã trả sửa' : undefined} /></td>
              <td className="px-4 py-3 text-right">
                <Btn size="sm" variant={t === 'pending' ? 'secondary' : 'ghost'} onClick={() => onNavigate?.('reviewDetail', { id: r.id })}>
                  {t === 'pending' ? 'Xem xét' : 'Xem'} <ArrowRight className="size-3.5" />
                </Btn>
              </td>
            </tr>
          ))}
        </Table>
        {rows.length === 0 && <p className="px-4 py-12 text-center text-sm text-ink-mute">Không còn mục nào cần xử lý.</p>}
      </Panel>
    </AdminShell>
  )
}
