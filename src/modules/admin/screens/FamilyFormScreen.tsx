import React from 'react'
import { Crosshair, ImagePlus, Link2, MapPin, Trash2, X } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Field, FormFooter, Input, Panel, Select, Status, Textarea, Toggle } from '@/modules/admin/components'
import { soldierCode } from '@/data/admin.mock'
import { FAMILIES, IMG } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  mode: 'edit',
  showAddress: true,
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

export default function FamilyForm(props: Props) {
  const { mode, showAddress, onNavigate, recordId } = { ...args, ...props }
  const isNew = mode === 'new' || recordId === 'new'
  const f = FAMILIES.find((x) => x.id === recordId) ?? FAMILIES[0]
  const v = (x: string) => (isNew ? '' : x)
  const links = isNew ? [] : [
    { kind: 'Liệt sĩ', name: 'Nguyễn Văn Thành', meta: `${soldierCode('s1')} · Anh trai`, page: 'soldierEdit' as const, id: 's1' },
    { kind: 'Người có công', name: 'Nguyễn Thị Lan', meta: 'Bà mẹ VNAH · Mẹ', page: 'meritEdit' as const, id: 'm1' },
  ]

  return (
    <AdminShell
      active="familyEdit"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Địa chỉ gia đình', page: 'families' }, { label: isNew ? 'Thêm mới' : f.head }]}
      title={isNew ? 'Thêm địa chỉ gia đình' : f.head}
      subtitle={isNew ? 'Gia đình có thể liên kết nhiều liệt sĩ và người có công.' : <span className="inline-flex items-center gap-2"><Status s="published" /> {f.kind}</span>}
    >
      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-2.5">
          <Panel title="Thông tin gia đình">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="Chủ hộ / người đại diện" required><Input defaultValue={v(f.head.replace('Gia đình ', ''))} /></Field>
              <Field label="Loại gia đình" required><Select options={['Gia đình liệt sĩ', 'Gia đình Bà mẹ Việt Nam Anh hùng', 'Gia đình có công với cách mạng', 'Gia đình thương binh, bệnh binh']} value={isNew ? undefined : f.kind} /></Field>
              <Field label="Số điện thoại liên hệ" hint="Chỉ hiển thị nội bộ"><Input defaultValue={v('0912 *** 468')} className="tabular-nums" /></Field>
              <Field label="Thôn" required><Select options={['Thụy Lôi 1', 'Thụy Lôi 2', 'Hà Lâm', 'Đào Thục', 'Biểu Khê', 'Cổ Miếu', 'Mạnh Tân']} value={isNew ? undefined : 'Thụy Lôi 1'} /></Field>
              <Field label="Địa chỉ chi tiết" required className="sm:col-span-2"><Input defaultValue={v(f.address)} /></Field>
              <Field label="Giới thiệu" className="sm:col-span-2"><Textarea defaultValue={v('Gia đình có hai thế hệ tham gia kháng chiến. Ngôi nhà ba gian được giữ gần như nguyên vẹn, nơi lưu giữ di ảnh và những lá thư của liệt sĩ Nguyễn Văn Thành.')} /></Field>
            </div>
          </Panel>

          <Panel title="Vị trí" description="Kéo ghim để chỉnh vị trí chính xác" action={<Btn size="sm" icon={<Crosshair className="size-3.5" />}>Lấy vị trí hiện tại</Btn>}>
            <div className="grid gap-2.5 lg:grid-cols-[200px_minmax(0,1fr)]">
              <div className="space-y-2.5">
                <Field label="Vĩ độ"><Input defaultValue={v('21.1561')} className="tabular-nums" /></Field>
                <Field label="Kinh độ"><Input defaultValue={v('105.8389')} className="tabular-nums" /></Field>
              </div>
              <div className="grid-paper relative h-56 overflow-hidden rounded-md border border-line">
                <div className="absolute left-0 top-[48%] h-2 w-full bg-line-strong/70" />
                <div className="absolute left-[30%] top-0 h-full w-1.5 bg-line-strong/50" />
                {!isNew && <MapPin className="absolute left-[56%] top-[44%] size-8 -translate-x-1/2 -translate-y-full fill-heritage text-white drop-shadow" />}
                {isNew && <span className="absolute inset-0 grid place-items-center text-[13px] text-ink-mute">Nhập địa chỉ hoặc bấm lên bản đồ để đặt ghim</span>}
              </div>
            </div>
          </Panel>

          <Panel title="Nhân vật liên kết" description="Hồ sơ liệt sĩ, người có công thuộc gia đình này" action={<Btn size="sm" icon={<Link2 className="size-3.5" />}>Liên kết hồ sơ</Btn>}>
            {links.length === 0 ? (
              <p className="text-[13px] text-ink-mute">Chưa có nhân vật nào được liên kết.</p>
            ) : (
              <ul className="divide-y divide-line">
                {links.map((l) => (
                  <li key={l.id} className="flex items-center gap-2.5 py-2">
                    <span className="w-28 shrink-0 text-xs text-ink-mute">{l.kind}</span>
                    <span className="min-w-0 flex-1">
                      <button onClick={() => onNavigate?.(l.page, { id: l.id })} className="text-left text-sm font-medium hover:text-heritage">{l.name}</button>
                      <span className="block text-xs text-ink-mute">{l.meta}</span>
                    </span>
                    <button aria-label="Bỏ liên kết" className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-heritage"><X className="size-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-2.5 xl:sticky xl:top-2.5 xl:self-start">
          <Panel title="Hình ảnh">
            <div className="grid grid-cols-2 gap-2">
              {!isNew && [IMG.home, IMG.letters, IMG.artifacts].map((src, i) => (
                <div key={src} className="group relative">
                  <img src={src} alt="" className="aspect-square w-full rounded-md object-cover" />
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-ink/70 px-1.5 text-[11px] text-white">Đại diện</span>}
                  <button aria-label="Xoá ảnh" className="absolute right-1.5 top-1.5 rounded bg-surface/90 p-1 text-heritage opacity-0 transition-opacity duration-150 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
                </div>
              ))}
              <button className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line-strong text-[13px] text-ink-mute hover:border-gold hover:text-ink"><ImagePlus className="size-5" />Thêm</button>
            </div>
          </Panel>
          <Panel title="Quyền riêng tư">
            <div className="space-y-2.5">
              <Toggle on={showAddress} label="Hiện địa chỉ chính xác" description={showAddress ? 'Người xem thấy số nhà và ghim bản đồ' : 'Chỉ hiện tên thôn, ghim lệch ~200m'} />
              <Toggle on={true} label="Hiện trên Bản đồ tri ân" />
              <Toggle on={false} label="Cho phép liên hệ qua cổng" description="Gia đình chưa đồng ý" />
            </div>
          </Panel>
        </div>
      </div>

      <FormFooter note={isNew ? 'Chưa lưu' : 'Đã lưu lúc 09:12'}>
        <Btn onClick={() => onNavigate?.('families')}>Huỷ</Btn>
        <Btn variant="primary" onClick={() => onNavigate?.('families')}>Gửi duyệt</Btn>
      </FormFooter>
    </AdminShell>
  )
}
