import React, { useState } from 'react'
import { Copy, Eye, MoreHorizontal, Pencil, Plus } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Chip, Filter, Panel, Pager, SearchBox, Status, Table, Tabs, Thumb } from '@/modules/admin/components'
import { ARTICLES, type Article } from '@/data/admin.mock'
import { NEWS, IMG } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  status: 'all',
  query: '',
  category: 'Tất cả',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }
type Tab = 'all' | Article['status']

export default function ArticleList(props: Props) {
  const { status, query, category, onNavigate } = { ...args, ...props }
  const [tab, setTab] = useState<Tab>(status as Tab)
  const count = (s: Article['status']) => ARTICLES.filter((a) => a.status === s).length
  const rows = ARTICLES.filter((a) => tab === 'all' || a.status === tab)
    .filter((a) => category === 'Tất cả' || a.category === category)
    .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <AdminShell
      active="articles"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Nội dung' }, { label: 'Bài viết' }]}
      title="Bài viết"
      subtitle="Tin tức, thông báo và câu chuyện đăng trên cổng thông tin"
      actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => onNavigate?.('articleEdit', { id: 'new' })}>Viết bài mới</Btn>}
    >
      <Panel flush>
        <Tabs<Tab>
          className="px-2"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'all', label: 'Tất cả', count: ARTICLES.length },
            { id: 'draft', label: 'Nháp', count: count('draft') },
            { id: 'pending', label: 'Chờ duyệt', count: count('pending') },
            { id: 'returned', label: 'Cần bổ sung', count: count('returned') },
            { id: 'scheduled', label: 'Hẹn giờ', count: count('scheduled') },
            { id: 'published', label: 'Công khai', count: count('published') },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <SearchBox value={query} placeholder="Tìm theo tiêu đề" className="w-full sm:w-72" />
          <Filter label="Chuyên mục" value={category} options={['Tất cả', 'Hoạt động', 'Sự kiện', 'Thông báo', 'Hướng dẫn', 'Câu chuyện']} />
          <Filter label="Tác giả" value="Tất cả" options={['Tất cả', 'Trần Thu Hà', 'Hoàng Thị Yến', 'Vũ Đình Khang']} />
        </div>
        <Table head={['Bài viết', 'Chuyên mục', 'Tác giả', 'Cập nhật', { label: 'Lượt xem', className: 'text-right' }, 'Trạng thái', { label: '', className: 'w-20' }]}>
          {rows.map((a, i) => (
            <tr key={a.id} className="hover:bg-canvas/50">
              <td className="max-w-[420px] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Thumb src={NEWS[i]?.image ?? IMG.letters} className="h-10 w-14" />
                  <button onClick={() => onNavigate?.('articleEdit', { id: a.id })} className="min-w-0 text-left font-medium leading-snug hover:text-heritage">
                    {a.title}
                  </button>
                </div>
              </td>
              <td className="px-4 py-3"><Chip>{a.category}</Chip></td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{a.author}</td>
              <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink-soft">
                {a.updated}
                {a.status === 'scheduled' && <p className="text-xs text-sky-ink">Đăng 20/09 · 07:00</p>}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-ink-soft">{a.views ? a.views.toLocaleString('vi-VN') : '—'}</td>
              <td className="px-4 py-3"><Status s={a.status} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-0.5">
                  <button aria-label="Sửa" onClick={() => onNavigate?.('articleEdit', { id: a.id })} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><Pencil className="size-4" /></button>
                  <RowMenu />
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {rows.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-ink-mute">Không có bài viết nào ở trạng thái này.</p>
        ) : (
          <Pager from={1} to={rows.length} total={rows.length + 41} pages={3} />
        )}
      </Panel>
    </AdminShell>
  )
}

function RowMenu() {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative">
      <button aria-label="Thêm thao tác" onClick={() => setOpen((o) => !o)} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><MoreHorizontal className="size-4" /></button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 rounded-md border border-line bg-surface py-1 text-left text-[13px] shadow-lg">
          <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-canvas"><Eye className="size-3.5" /> Xem trước</button>
          <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-canvas"><Copy className="size-3.5" /> Nhân bản</button>
          <button className="flex w-full items-center gap-2 px-3 py-1.5 text-heritage hover:bg-heritage-tint">Ẩn khỏi cổng</button>
        </div>
      )}
    </span>
  )
}
