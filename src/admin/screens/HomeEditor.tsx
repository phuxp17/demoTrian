import React, { useState } from 'react'
import { Eye, EyeOff, GripVertical, ImagePlus, Monitor, Plus, Smartphone } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Callout, Field, FormFooter, Input, Panel, Select, Textarea, Toggle } from '../../shared/admin/ui'
import { IMG } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  selected: 'hero',
  dirty: true,
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

type Block = { id: string; name: string; summary: string; visible: boolean }

const BLOCKS: Block[] = [
  { id: 'hero', name: 'Ảnh bìa & lời tri ân', summary: 'Ảnh toàn cảnh, tiêu đề, lời dẫn', visible: true },
  { id: 'search', name: 'Ô tra cứu', summary: 'Tìm liệt sĩ, người có công, địa danh', visible: true },
  { id: 'stats', name: 'Số liệu tri ân', summary: '4 chỉ số, lấy tự động', visible: true },
  { id: 'map', name: 'Bản đồ tri ân', summary: 'Nghĩa trang, địa chỉ đỏ, gia đình', visible: true },
  { id: 'red', name: 'Địa chỉ đỏ nổi bật', summary: '4 địa điểm chọn tay', visible: true },
  { id: 'news', name: 'Tin tức mới', summary: '3 bài mới nhất', visible: true },
  { id: 'library', name: 'Thư viện tư liệu', summary: '6 ảnh từ album chọn', visible: false },
  { id: 'tour', name: 'Tham quan 360°', summary: 'NTLS Thụy Lâm', visible: true },
]

export default function HomeEditor(props: Props) {
  const { selected, dirty, onNavigate } = { ...args, ...props }
  const [sel, setSel] = useState(selected)
  const [vis, setVis] = useState<Record<string, boolean>>(() => Object.fromEntries(BLOCKS.map((b) => [b.id, b.visible])))
  const block = BLOCKS.find((b) => b.id === sel) ?? BLOCKS[0]

  return (
    <AdminShell
      active="homeEditor"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Nội dung' }, { label: 'Trang chủ' }]}
      title="Biên tập trang chủ"
      subtitle="Sắp xếp các khối nội dung và thiết lập cách hiển thị trên cổng"
      actions={<Btn icon={<Eye className="size-4" />}>Xem trước</Btn>}
    >
      <div className="grid gap-2.5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Panel title="Các khối" description="Kéo để đổi thứ tự hiển thị" flush action={<Btn size="sm" variant="ghost" icon={<Plus className="size-3.5" />}>Thêm khối</Btn>}>
          <ol className="p-2">
            {BLOCKS.map((b, i) => {
              const on = b.id === sel
              const shown = vis[b.id]
              return (
                <li key={b.id}>
                  <div
                    onClick={() => setSel(b.id)}
                    className={`group flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition-colors duration-150 ${on ? 'bg-heritage-tint' : 'hover:bg-canvas'}`}
                  >
                    <GripVertical className="size-4 shrink-0 cursor-grab text-ink-mute" />
                    <span className="w-5 shrink-0 text-xs tabular-nums text-ink-mute">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${on ? 'font-semibold text-heritage-ink' : 'font-medium'} ${shown ? '' : 'text-ink-mute line-through decoration-ink-mute/40'}`}>{b.name}</p>
                      <p className="truncate text-xs text-ink-mute">{b.summary}</p>
                    </div>
                    <button
                      aria-label={shown ? 'Ẩn khối' : 'Hiện khối'}
                      onClick={(e) => {
                        e.stopPropagation()
                        setVis((v) => ({ ...v, [b.id]: !v[b.id] }))
                      }}
                      className="rounded p-1.5 text-ink-mute hover:bg-surface hover:text-ink"
                    >
                      {shown ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>
        </Panel>

        <div className="min-w-0 space-y-2.5">
          <Panel
            title={block.name}
            description={vis[block.id] ? 'Đang hiển thị trên trang chủ' : 'Đang ẩn khỏi trang chủ'}
            action={<Toggle on={!!vis[block.id]} onChange={(v) => setVis((s) => ({ ...s, [block.id]: v }))} />}
          >
            <BlockSettings id={block.id} />
          </Panel>

          <Panel title="Xem nhanh" flush action={<div className="flex rounded-md border border-line p-0.5"><span className="grid size-7 place-items-center rounded bg-canvas"><Monitor className="size-4" /></span><span className="grid size-7 place-items-center text-ink-mute"><Smartphone className="size-4" /></span></div>}>
            <div className="bg-canvas p-3 sm:p-4">
              <div className="mx-auto max-w-2xl overflow-hidden rounded-md border border-line bg-paper shadow-sm">
                <div className="relative aspect-[21/8]">
                  <img src={IMG.heroSunrise} alt="" className="absolute inset-0 size-full object-cover" />
                  <div className="absolute inset-0 bg-ink/45" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                    <p className="font-serif text-xl font-semibold sm:text-2xl">Tri ân những người con Thư Lâm</p>
                    <p className="mt-1 max-w-md text-[13px] text-ivory/85">Nơi lưu giữ tên tuổi, phần mộ và ký ức về các anh hùng liệt sĩ, người có công của xã.</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 divide-x divide-line border-t border-line text-center">
                  {[['744', 'Phần mộ'], ['683', 'Đã xác định'], ['58', 'Người có công'], ['12', 'Địa chỉ đỏ']].map(([n, l]) => (
                    <div key={l} className="py-3">
                      <p className="font-serif text-lg font-semibold text-heritage">{n}</p>
                      <p className="text-[11px] text-ink-mute">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <FormFooter note={dirty ? 'Có 2 thay đổi chưa áp dụng' : 'Trang chủ đang khớp với bản công khai'}>
        <Btn variant="ghost" disabled={!dirty}>Hoàn tác</Btn>
        <Btn variant="primary" disabled={!dirty}>Áp dụng lên cổng</Btn>
      </FormFooter>
    </AdminShell>
  )
}

function BlockSettings({ id }: { id: string }) {
  if (id === 'hero')
    return (
      <div className="grid gap-2.5 md:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <img src={IMG.heroSunrise} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
          <Btn size="sm" className="mt-2 w-full" icon={<ImagePlus className="size-3.5" />}>Đổi ảnh bìa</Btn>
        </div>
        <div className="space-y-2.5">
          <Field label="Tiêu đề" required><Input defaultValue="Tri ân những người con Thư Lâm" /></Field>
          <Field label="Lời dẫn" hint="Tối đa 160 ký tự"><Textarea defaultValue="Nơi lưu giữ tên tuổi, phần mộ và ký ức về các anh hùng liệt sĩ, người có công của xã." className="min-h-20" /></Field>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="Nút chính"><Input defaultValue="Tra cứu liệt sĩ" /></Field>
            <Field label="Dẫn tới"><Select options={['Tra cứu liệt sĩ', 'Bản đồ tri ân', 'Tham quan 360°']} /></Field>
          </div>
        </div>
      </div>
    )
  if (id === 'stats')
    return (
      <div className="space-y-2.5">
        <Callout tone="info">Số liệu lấy tự động từ hồ sơ đã công khai, cập nhật mỗi đêm.</Callout>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {['Tổng số phần mộ', 'Phần mộ đã xác định danh tính', 'Người có công', 'Địa chỉ đỏ'].map((l) => (
            <Toggle key={l} on label={l} />
          ))}
        </div>
      </div>
    )
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <Field label="Tiêu đề khối"><Input defaultValue={BLOCKS.find((b) => b.id === id)?.name} /></Field>
      <Field label="Nguồn nội dung"><Select options={['Tự động, mới nhất', 'Chọn thủ công']} /></Field>
      <Field label="Số mục hiển thị"><Input type="number" defaultValue={id === 'news' ? 3 : 4} /></Field>
      <Field label="Nền khối"><Select options={['Giấy', 'Trắng', 'Đỏ di sản']} /></Field>
    </div>
  )
}
