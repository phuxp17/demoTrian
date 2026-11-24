import React, { useState } from 'react'
import { FileText, ImagePlus, Link2, Paperclip, X } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Field, FormFooter, Input, Panel, Select, Status, Textarea } from '@/modules/admin/components'
import { FAMILIES, IMG, MEDIA, MERIT } from '@/data/portal.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  mode: 'edit',
  category: 'Bà mẹ Việt Nam Anh hùng',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

const CATEGORIES = ['Bà mẹ Việt Nam Anh hùng', 'Thương binh', 'Bệnh binh', 'Người hoạt động kháng chiến', 'Người có công giúp đỡ cách mạng']

export default function MeritForm(props: Props) {
  const { mode, category: initialCat, onNavigate, recordId } = { ...args, ...props }
  const isNew = mode === 'new' || recordId === 'new'
  const m = MERIT.find((x) => x.id === recordId) ?? MERIT[3]
  const [cat, setCat] = useState(recordId && !isNew ? m.category : initialCat)
  const v = (x: string) => (isNew ? '' : x)

  return (
    <AdminShell
      active="meritEdit"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Người có công', page: 'merit' }, { label: isNew ? 'Thêm hồ sơ' : m.name }]}
      title={isNew ? 'Thêm người có công' : m.name}
      subtitle={isNew ? 'Các trường thay đổi theo diện đối tượng.' : <span className="inline-flex items-center gap-2"><Status s="pending" /> bổ sung bởi Hoàng Thị Yến, 13/09/2025</span>}
    >
      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-2.5">
          <Panel title="Diện đối tượng">
            <div role="radiogroup" className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="radio"
                  aria-checked={cat === c}
                  onClick={() => setCat(c)}
                  className={`h-9 whitespace-nowrap rounded-md border px-3 text-sm transition-colors duration-150 ${cat === c ? 'border-heritage bg-heritage-tint font-medium text-heritage-ink' : 'border-line-strong text-ink-soft hover:bg-canvas'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Thông tin cá nhân">
            <div className="grid gap-2.5 sm:grid-cols-6">
              <Field label="Họ và tên" required className="sm:col-span-4"><Input defaultValue={v(m.name)} /></Field>
              <Field label="Giới tính" className="sm:col-span-2"><Select options={['Nữ', 'Nam']} value={isNew ? undefined : 'Nữ'} /></Field>
              <Field label="Năm sinh" required className="sm:col-span-2"><Input defaultValue={v(m.years.split(' – ')[0])} className="tabular-nums" /></Field>
              <Field label="Năm mất" hint="Để trống nếu còn sống" className="sm:col-span-2"><Input defaultValue={v(m.years.split(' – ')[1] ?? '')} className="tabular-nums" /></Field>
              <Field label="Quê quán" required className="sm:col-span-2"><Input defaultValue={v(m.hometown)} /></Field>
            </div>
          </Panel>

          <Panel title={`Thông tin theo diện: ${cat}`}>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {cat === 'Bà mẹ Việt Nam Anh hùng' && (
                <>
                  <Field label="Quyết định phong tặng" required><Input defaultValue={v('QĐ 394/KT-CTN')} /></Field>
                  <Field label="Ngày phong tặng"><Input defaultValue={v('17/12/1994')} className="tabular-nums" /></Field>
                  <Field label="Số con là liệt sĩ"><Input defaultValue={v('2')} className="tabular-nums" /></Field>
                  <Field label="Số chồng là liệt sĩ"><Input defaultValue={v('1')} className="tabular-nums" /></Field>
                </>
              )}
              {(cat === 'Thương binh' || cat === 'Bệnh binh') && (
                <>
                  <Field label="Hạng" required><Select options={cat === 'Thương binh' ? ['1/4', '2/4', '3/4', '4/4'] : ['1/3', '2/3', '3/3']} /></Field>
                  <Field label="Tỷ lệ tổn thương (%)"><Input className="tabular-nums" /></Field>
                  <Field label="Đơn vị khi bị thương"><Input /></Field>
                  <Field label="Số giấy chứng nhận"><Input /></Field>
                </>
              )}
              {(cat === 'Người hoạt động kháng chiến' || cat === 'Người có công giúp đỡ cách mạng') && (
                <>
                  <Field label="Thời kỳ hoạt động" required><Select options={['Kháng chiến chống Pháp', 'Kháng chiến chống Mỹ', 'Cả hai thời kỳ']} /></Field>
                  <Field label="Hình thức khen thưởng"><Input placeholder="Huân chương, Bằng có công…" /></Field>
                  <Field label="Số quyết định" className="sm:col-span-2"><Input /></Field>
                </>
              )}
            </div>
          </Panel>

          <Panel title="Tiểu sử">
            <Textarea className="min-h-40" defaultValue={v('Mẹ Phạm Thị Nga sinh năm 1915 tại thôn Biểu Khê. Chồng và hai con trai của mẹ lần lượt hy sinh trong kháng chiến chống Pháp và chống Mỹ. Mẹ được Nhà nước truy tặng danh hiệu Bà mẹ Việt Nam Anh hùng năm 1994.')} />
          </Panel>

          <Panel title="Tư liệu" description="Ảnh, thư từ, ghi âm lấy từ Thư viện media" action={<Btn size="sm" icon={<Paperclip className="size-3.5" />} onClick={() => onNavigate?.('media')}>Chọn từ thư viện</Btn>}>
            {isNew ? (
              <p className="text-[13px] text-ink-mute">Chưa có tư liệu.</p>
            ) : (
              <ul className="grid gap-2.5 sm:grid-cols-3">
                {MEDIA.slice(0, 3).map((d) => (
                  <li key={d.id} className="group relative overflow-hidden rounded-md border border-line">
                    <img src={d.image} alt="" className="aspect-[4/3] w-full object-cover" />
                    <div className="p-2">
                      <p className="truncate text-[13px] font-medium">{d.title}</p>
                      <p className="text-xs text-ink-mute">{d.kind} · {d.source}</p>
                    </div>
                    <button aria-label="Gỡ tư liệu" className="absolute right-1.5 top-1.5 rounded bg-surface/90 p-1 text-ink-soft opacity-0 transition-opacity duration-150 group-hover:opacity-100"><X className="size-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-2.5 xl:sticky xl:top-2.5 xl:self-start">
          <Panel title="Ảnh chân dung">
            {isNew ? (
              <button className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line-strong text-[13px] text-ink-mute hover:border-gold hover:text-ink"><ImagePlus className="size-6" /> Tải ảnh lên</button>
            ) : (
              <img src={IMG.home} alt="" className="aspect-[3/4] w-full rounded-md object-cover" />
            )}
          </Panel>
          <Panel title="Liên kết gia đình" action={<Btn size="sm" variant="ghost" icon={<Link2 className="size-3.5" />}>Thêm</Btn>}>
            {isNew ? (
              <p className="text-[13px] text-ink-mute">Liên kết để hồ sơ hiện trên trang Địa chỉ gia đình.</p>
            ) : (
              <div className="rounded-md border border-line px-3 py-2.5">
                <p className="text-sm font-medium">{FAMILIES[3].head}</p>
                <p className="text-xs text-ink-mute">Con gái · {FAMILIES[3].address.split(',')[0]}</p>
                <button onClick={() => onNavigate?.('familyEdit', { id: 'f4' })} className="mt-1.5 text-[13px] text-heritage hover:underline">Mở hồ sơ gia đình</button>
              </div>
            )}
          </Panel>
          <Panel title="Giấy tờ nội bộ">
            <ul className="space-y-2 text-sm">
              {!isNew && <li className="flex items-center gap-2"><FileText className="size-4 text-ink-mute" /> Quyết định phong tặng.pdf</li>}
            </ul>
            <Btn size="sm" className="mt-2" icon={<Paperclip className="size-3.5" />}>Đính kèm</Btn>
          </Panel>
        </div>
      </div>

      <FormFooter note={isNew ? 'Chưa lưu' : 'Đang chờ lãnh đạo duyệt bản bổ sung'}>
        <Btn onClick={() => onNavigate?.('merit')}>Huỷ</Btn>
        <Btn>Lưu nháp</Btn>
        <Btn variant="primary" onClick={() => onNavigate?.('merit')}>Gửi duyệt</Btn>
      </FormFooter>
    </AdminShell>
  )
}
