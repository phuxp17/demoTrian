import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Folder, FolderPlus, Mic, Play, Upload, X } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Chip, Field, Filter, Input, SearchBox, Select, Status, Textarea } from '@/modules/admin/components'
import { MEDIA, type MediaItem } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  album: 'all',
  selected: 'd2',
  uploading: true,
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

const ALBUMS = [
  { id: 'all', name: 'Tất cả tư liệu', n: 1284 },
  { id: 'ntls', name: 'Nghĩa trang Vân Hà 2025', n: 24 },
  { id: 'thu', name: 'Thư từ, kỷ vật liệt sĩ', n: 86 },
  { id: 'le', name: 'Lễ tri ân 27/7', n: 142 },
  { id: 'dinh', name: 'Di tích đình, đền', n: 58 },
]

const LINKS: Record<string, string[]> = {
  d1: ['Nhà truyền thống xã Thụy Lâm'],
  d2: ['Liệt sĩ Nguyễn Văn Thành', 'Bài viết: Ký ức Thành cổ…'],
  d3: ['NTLS Thụy Lâm'],
  d5: ['Đình Thụy Lôi'],
  d6: ['Liệt sĩ Trần Đức Hiển'],
}

export default function MediaLibrary(props: Props) {
  const { album, selected, uploading, onNavigate } = { ...args, ...props }
  const [alb, setAlb] = useState(album)
  const [sel, setSel] = useState(selected)
  const item = MEDIA.find((m) => m.id === sel)

  return (
    <AdminShell
      active="media"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Nội dung' }, { label: 'Thư viện media' }]}
      title="Thư viện media"
      subtitle="Ảnh, video, tài liệu PDF và ghi âm dùng chung cho hồ sơ và bài viết"
      actions={
        <>
          <Btn icon={<FolderPlus className="size-4" />}>Tạo album</Btn>
          <Btn variant="primary" icon={<Upload className="size-4" />}>Tải lên</Btn>
        </>
      }
    >
      <div className="grid gap-2.5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto lg:mx-0 lg:flex-col">
          {ALBUMS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAlb(a.id)}
              className={`flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-2.5 text-left text-[13px] transition-colors duration-150 ${alb === a.id ? 'bg-surface font-medium text-ink shadow-sm ring-1 ring-line' : 'text-ink-soft hover:bg-surface/60'}`}
            >
              <Folder className="size-4 shrink-0 text-gold" />
              <span className="min-w-0 flex-1 truncate">{a.name}</span>
              <span className="text-xs tabular-nums text-ink-mute">{a.n.toLocaleString('vi-VN')}</span>
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 gap-2.5">
          <div className="min-w-0 flex-1 space-y-2.5">
            {uploading && (
              <div className="rounded-lg border border-line bg-surface p-3">
                <div className="flex items-center justify-between gap-2.5 text-[13px]">
                  <span className="font-medium">Đang tải lên 7/12 tệp vào “Nghĩa trang Vân Hà 2025”</span>
                  <button className="text-ink-mute hover:text-heritage">Huỷ</button>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas">
                  <div className="h-full w-[58%] rounded-full bg-jade" />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <SearchBox placeholder="Tên, chú thích, nguồn" className="w-full sm:w-64" />
              <Filter label="Loại" value="Tất cả" options={['Tất cả', 'Ảnh', 'Video', 'Tài liệu', 'Ghi âm']} />
              <Filter label="Gắn hồ sơ" value="Tất cả" options={['Tất cả', 'Đã gắn', 'Chưa gắn']} />
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
              {MEDIA.map((m) => (
                <Tile key={m.id} m={m} on={m.id === sel} onClick={() => setSel(m.id === sel ? '' : m.id)} />
              ))}
            </div>
          </div>

          <AnimatePresence>
            {item && (
              <motion.aside
                key={item.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="fixed inset-y-0 right-0 z-30 w-full max-w-sm overflow-y-auto border-l border-line bg-surface shadow-xl xl:static xl:z-auto xl:w-80 xl:shrink-0 xl:self-start xl:rounded-lg xl:border xl:shadow-none"
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-[15px] font-semibold">Chi tiết tư liệu</p>
                  <button aria-label="Đóng" onClick={() => setSel('')} className="rounded p-1.5 text-ink-mute hover:bg-canvas"><X className="size-4" /></button>
                </div>
                <div className="space-y-2.5 p-4">
                  <img src={item.image} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-mute">
                    <Chip>{item.kind}</Chip>
                    <span>{item.kind === 'Tài liệu' ? 'PDF · 4 trang · 2,1 MB' : 'JPG · 3024×2016 · 1,8 MB'}</span>
                  </div>
                  <Field label="Tiêu đề"><Input defaultValue={item.title} /></Field>
                  <Field label="Chú thích" hint="Hiện dưới ảnh trên cổng"><Textarea defaultValue={`${item.title}. Năm ${item.year}.`} className="min-h-16" /></Field>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Nguồn" required><Input defaultValue={item.source} /></Field>
                    <Field label="Năm"><Input defaultValue={item.year} /></Field>
                  </div>
                  <Field label="Quyền sử dụng"><Select options={['Được phép công khai', 'Chỉ dùng nội bộ', 'Cần xin phép gia đình']} /></Field>
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium">Gắn với hồ sơ</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(LINKS[item.id] ?? []).map((l) => <Chip key={l} className="gap-1 bg-heritage-tint text-heritage-ink">{l} <X className="size-3" /></Chip>)}
                      <button className="rounded border border-dashed border-line-strong px-1.5 py-0.5 text-xs text-ink-soft hover:bg-canvas">+ Gắn hồ sơ</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-3">
                    <Status s={item.id === 'd6' ? 'pending' : 'published'} />
                    <div className="flex gap-2">
                      <Btn size="sm" variant="danger">Xoá</Btn>
                      <Btn size="sm" variant="primary">Lưu</Btn>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminShell>
  )
}

function Tile({ m, on, onClick }: { m: MediaItem; on: boolean; onClick: () => void }) {
  const Badge = m.kind === 'Video' ? Play : m.kind === 'Tài liệu' ? FileText : m.kind === 'Ghi âm' ? Mic : null
  return (
    <button onClick={onClick} className={`group min-w-0 rounded-lg bg-surface p-1.5 text-left ring-1 transition-[box-shadow] duration-150 ${on ? 'ring-2 ring-heritage' : 'ring-line hover:ring-line-strong'}`}>
      <span className="relative block">
        <img src={m.image} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
        {Badge && <span className="absolute left-1.5 top-1.5 grid size-6 place-items-center rounded bg-ink/70 text-white"><Badge className="size-3.5" /></span>}
      </span>
      <span className="mt-1.5 block truncate px-0.5 text-[13px] font-medium">{m.title}</span>
      <span className="block truncate px-0.5 text-xs text-ink-mute">{m.source}</span>
    </button>
  )
}
