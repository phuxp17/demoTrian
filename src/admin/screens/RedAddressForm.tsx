import React, { useState } from 'react'
import { Bold, GripVertical, ImagePlus, Italic, Link2, List, MapPin, Paperclip, Plus, Quote, X } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Field, FormFooter, Input, Panel, Select, Status, Tabs, Toggle } from '../../shared/admin/ui'
import { MEDIA, RED_ADDRESSES } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  mode: 'edit',
  section: 'info',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

type Section = 'info' | 'history' | 'content' | 'media' | 'location'

const MILESTONES = [
  ['Thế kỷ XVII', 'Đình được dựng thờ Thành hoàng làng'],
  ['1946 – 1954', 'Nơi họp bí mật của chi bộ, cất giấu cán bộ kháng chiến'],
  ['1986', 'Được Bộ Văn hoá xếp hạng Di tích lịch sử – văn hoá quốc gia'],
  ['2015', 'Tu bổ mái, sân đình và nhà tả vu'],
]

export default function RedAddressForm(props: Props) {
  const { mode, section, onNavigate, recordId } = { ...args, ...props }
  const isNew = mode === 'new' || recordId === 'new'
  const r = RED_ADDRESSES.find((x) => x.id === recordId) ?? RED_ADDRESSES[2]
  const [tab, setTab] = useState<Section>(section as Section)
  const v = (x: string) => (isNew ? '' : x)

  return (
    <AdminShell
      active="redAddressEdit"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Địa chỉ đỏ', page: 'redAddresses' }, { label: isNew ? 'Thêm mới' : r.name }]}
      title={isNew ? 'Thêm địa chỉ đỏ' : r.name}
      subtitle={isNew ? undefined : <span className="inline-flex items-center gap-2"><Status s="pending" /> {r.rank}</span>}
      actions={!isNew && <Btn>Xem trên cổng</Btn>}
    >
      <Tabs<Section>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'info', label: 'Thông tin chung' },
          { id: 'history', label: 'Lịch sử', count: isNew ? undefined : MILESTONES.length },
          { id: 'content', label: 'Nội dung giới thiệu' },
          { id: 'media', label: 'Tư liệu', count: isNew ? undefined : 9 },
          { id: 'location', label: 'Vị trí bản đồ' },
        ]}
      />

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {tab === 'info' && (
            <Panel>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <Field label="Tên địa điểm" required className="sm:col-span-2"><Input defaultValue={v(r.name)} /></Field>
                <Field label="Loại" required><Select options={['Đình, đền', 'Đài tưởng niệm', 'Nhà truyền thống', 'Bia tưởng niệm']} value={isNew ? undefined : r.kind} /></Field>
                <Field label="Xếp hạng di tích"><Select options={['Di tích quốc gia', 'Di tích cấp thành phố', 'Chưa xếp hạng', 'Công trình tưởng niệm']} value={isNew ? undefined : 'Di tích quốc gia'} /></Field>
                <Field label="Năm xếp hạng"><Input defaultValue={v('1986')} className="tabular-nums" /></Field>
                <Field label="Đơn vị quản lý"><Input defaultValue={v('Ban quản lý di tích thôn Thụy Lôi')} /></Field>
                <Field label="Địa chỉ" required className="sm:col-span-2"><Input defaultValue={v(r.address)} /></Field>
                <Field label="Giờ mở cửa"><Input defaultValue={v('Mùng 1, rằm âm lịch và ngày lễ')} /></Field>
                <Field label="Liên hệ" hint="Hiển thị công khai"><Input defaultValue={v('Ông Trần Văn Tư, thủ từ')} /></Field>
              </div>
            </Panel>
          )}

          {tab === 'history' && (
            <Panel title="Các mốc lịch sử" description="Hiển thị dạng dòng thời gian trên trang chi tiết" action={<Btn size="sm" icon={<Plus className="size-3.5" />}>Thêm mốc</Btn>}>
              <ol className="space-y-2">
                {(isNew ? [] : MILESTONES).map(([year, text]) => (
                  <li key={year} className="flex items-start gap-2 rounded-md border border-line bg-surface p-2">
                    <GripVertical className="mt-2 size-4 shrink-0 cursor-grab text-ink-mute" />
                    <Input defaultValue={year} className="w-32 shrink-0" />
                    <Input defaultValue={text} className="min-w-0 flex-1" />
                    <button aria-label="Xoá mốc" className="mt-0.5 rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-heritage"><X className="size-4" /></button>
                  </li>
                ))}
              </ol>
              {isNew && <p className="text-[13px] text-ink-mute">Chưa có mốc nào.</p>}
            </Panel>
          )}

          {tab === 'content' && (
            <Panel flush>
              <div className="flex flex-wrap items-center gap-0.5 border-b border-line px-2 py-1.5">
                {[Bold, Italic, List, Quote, Link2, ImagePlus].map((I, i) => (
                  <button key={i} className="grid size-8 place-items-center rounded text-ink-soft hover:bg-canvas"><I className="size-4" /></button>
                ))}
              </div>
              <div className="prose-sm max-w-none space-y-2.5 p-5 text-[15px] leading-relaxed">
                <p>{v('Đình Thụy Lôi nằm giữa làng, quay hướng nam nhìn ra cánh đồng. Kiến trúc chữ Đinh với toà đại đình năm gian, mái cong lợp ngói mũi hài, các đầu đao chạm rồng mây.')}</p>
                <p>{v('Trong kháng chiến chống Pháp, đình là nơi chi bộ thôn họp bí mật và cất giấu cán bộ. Nhiều thanh niên trong làng đã lên đường nhập ngũ từ sân đình này.')}</p>
                {isNew && <p className="text-ink-mute">Viết phần giới thiệu…</p>}
              </div>
            </Panel>
          )}

          {tab === 'media' && (
            <Panel title="Tư liệu gắn với địa điểm" action={<Btn size="sm" icon={<Paperclip className="size-3.5" />} onClick={() => onNavigate?.('media')}>Chọn từ thư viện</Btn>}>
              <ul className="grid gap-2.5 sm:grid-cols-3">
                {(isNew ? [] : MEDIA.slice(2, 8)).map((d) => (
                  <li key={d.id} className="overflow-hidden rounded-md border border-line">
                    <img src={d.image} alt="" className="aspect-[4/3] w-full object-cover" />
                    <div className="p-2">
                      <p className="truncate text-[13px] font-medium">{d.title}</p>
                      <p className="text-xs text-ink-mute">{d.kind} · {d.year}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {tab === 'location' && (
            <Panel>
              <div className="grid gap-2.5 lg:grid-cols-[200px_minmax(0,1fr)]">
                <div className="space-y-2.5">
                  <Field label="Vĩ độ"><Input defaultValue={v('21.1508')} className="tabular-nums" /></Field>
                  <Field label="Kinh độ"><Input defaultValue={v('105.8452')} className="tabular-nums" /></Field>
                  <Field label="Biểu tượng"><Select options={['Đình, đền', 'Đài tưởng niệm', 'Bia']} /></Field>
                </div>
                <div className="grid-paper relative h-72 overflow-hidden rounded-md border border-line">
                  <div className="absolute left-0 top-[40%] h-2 w-full bg-line-strong/70" />
                  <div className="absolute left-[64%] top-0 h-full w-3 bg-sky/20" />
                  <MapPin className="absolute left-[44%] top-[38%] size-8 -translate-x-1/2 -translate-y-full fill-heritage text-white drop-shadow" />
                </div>
              </div>
            </Panel>
          )}
        </div>

        <div className="space-y-2.5 xl:sticky xl:top-2.5 xl:self-start">
          <Panel title="Ảnh đại diện">
            {isNew ? (
              <button className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line-strong text-[13px] text-ink-mute hover:border-gold"><ImagePlus className="size-5" />Tải ảnh</button>
            ) : (
              <img src={r.image} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
            )}
          </Panel>
          <Panel title="Hiển thị">
            <div className="space-y-2.5">
              <Toggle on label="Hiện trên Bản đồ tri ân" />
              <Toggle on={!isNew} label="Nổi bật ở trang chủ" />
              <Toggle on={false} label="Liên kết tham quan 360°" description="Chưa có cảnh 360°" />
            </div>
          </Panel>
        </div>
      </div>

      <FormFooter note={isNew ? 'Chưa lưu' : 'Tự động lưu nháp lúc 11:47'}>
        <Btn onClick={() => onNavigate?.('redAddresses')}>Huỷ</Btn>
        <Btn>Lưu nháp</Btn>
        <Btn variant="primary" onClick={() => onNavigate?.('redAddresses')}>Gửi duyệt</Btn>
      </FormFooter>
    </AdminShell>
  )
}
