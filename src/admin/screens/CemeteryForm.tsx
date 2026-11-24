import React, { useState } from 'react'
import { Crosshair, ImagePlus, MapPin, Trash2 } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Field, FormFooter, Input, Panel, Select, Status, Textarea, Toggle } from '../../shared/admin/ui'
import { CEMETERIES } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  mode: 'edit',
  lat: '21.1532',
  lng: '105.8417',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

export default function CemeteryForm(props: Props) {
  const { mode, lat, lng, onNavigate, recordId } = { ...args, ...props }
  const isNew = mode === 'new' || recordId === 'new'
  const c = CEMETERIES.find((x) => x.id === recordId) ?? CEMETERIES[0]
  const [cfg, setCfg] = useState({ map: true, plot: true, tour: c.has360, contribute: true, stats: false })
  const set = (k: keyof typeof cfg) => (v: boolean) => setCfg((s) => ({ ...s, [k]: v }))

  return (
    <AdminShell
      active="cemeteryEdit"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Nghĩa trang', page: 'cemeteries' }, { label: isNew ? 'Thêm mới' : c.name }]}
      title={isNew ? 'Thêm nghĩa trang' : c.name}
      subtitle={isNew ? 'Sau khi lưu, tiếp tục dựng sơ đồ khu – hàng – mộ.' : <span className="inline-flex items-center gap-2"><Status s="published" /> {c.graves} phần mộ · cập nhật 10/09/2025</span>}
      actions={!isNew && <Btn onClick={() => onNavigate?.('mapEditor', { id: c.id })}>Mở sơ đồ</Btn>}
    >
      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-2.5">
          <Panel title="Thông tin chung">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="Tên nghĩa trang" required className="sm:col-span-2"><Input defaultValue={isNew ? '' : c.name} placeholder="Nghĩa trang Liệt sĩ …" /></Field>
              <Field label="Địa bàn (xã cũ)" required><Select options={['Xã Thụy Lâm cũ', 'Xã Vân Hà cũ', 'Xã Liên Hà cũ', 'Xã Xuân Nộn cũ']} value={isNew ? undefined : c.area} /></Field>
              <Field label="Đơn vị quản lý"><Input defaultValue={isNew ? '' : 'Ban quản lý nghĩa trang xã'} /></Field>
              <Field label="Địa chỉ" required className="sm:col-span-2"><Input defaultValue={isNew ? '' : c.address} /></Field>
              <Field label="Năm xây dựng / tôn tạo"><Input defaultValue={isNew ? '' : c.built} /></Field>
              <Field label="Diện tích (m²)"><Input defaultValue={isNew ? '' : '6.400'} /></Field>
              <Field label="Giới thiệu" hint="Hiển thị ở trang chi tiết nghĩa trang trên cổng công khai" className="sm:col-span-2">
                <Textarea defaultValue={isNew ? '' : 'Nghĩa trang được xây dựng năm 1976 trên khu đất cao phía bắc thôn Thụy Lôi, là nơi an nghỉ của các liệt sĩ quê hương hy sinh trong hai cuộc kháng chiến và chiến tranh bảo vệ biên giới.'} />
              </Field>
            </div>
          </Panel>

          <Panel title="Vị trí trên bản đồ" description="Nhập toạ độ hoặc kéo ghim trên bản đồ" action={<Btn size="sm" icon={<Crosshair className="size-3.5" />}>Lấy vị trí hiện tại</Btn>}>
            <div className="grid gap-2.5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="space-y-2.5">
                <Field label="Vĩ độ"><Input defaultValue={lat} className="tabular-nums" /></Field>
                <Field label="Kinh độ"><Input defaultValue={lng} className="tabular-nums" /></Field>
                <Field label="Lối vào chính" hint="Dùng cho chỉ đường"><Input defaultValue="Cổng phía nam, đường liên thôn" /></Field>
              </div>
              <div className="grid-paper relative h-64 overflow-hidden rounded-md border border-line">
                <div className="absolute left-[8%] top-0 h-full w-3 bg-sky/25" />
                <div className="absolute left-0 top-[62%] h-2 w-full bg-line-strong/70" />
                <div className="absolute left-[46%] top-[20%] h-28 w-36 rounded border-2 border-dashed border-heritage/40 bg-heritage/5" />
                <MapPin className="absolute left-[52%] top-[30%] size-8 -translate-x-1/2 -translate-y-full fill-heritage text-white drop-shadow" />
                <span className="absolute bottom-2 right-2 rounded bg-surface/90 px-2 py-1 text-[11px] tabular-nums text-ink-soft">{lat}, {lng}</span>
              </div>
            </div>
          </Panel>

          <Panel title="Hình ảnh" description="Ảnh đầu tiên là ảnh đại diện">
            <div className="flex flex-wrap gap-2.5">
              {!isNew &&
                [c.image, CEMETERIES[1].image, CEMETERIES[2].image].map((src, i) => (
                  <div key={i} className="group relative">
                    <img src={src} alt="" className="h-24 w-36 rounded-md object-cover" />
                    {i === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-ink/70 px-1.5 text-[11px] text-white">Đại diện</span>}
                    <button aria-label="Xoá ảnh" className="absolute right-1.5 top-1.5 rounded bg-surface/90 p-1 text-heritage opacity-0 transition-opacity duration-150 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
                  </div>
                ))}
              <button className="flex h-24 w-36 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line-strong text-[13px] text-ink-mute hover:border-gold hover:text-ink">
                <ImagePlus className="size-5" /> Thêm ảnh
              </button>
            </div>
          </Panel>
        </div>

        <div className="space-y-2.5 xl:sticky xl:top-2.5 xl:self-start">
          <Panel title="Cấu hình hiển thị">
            <div className="space-y-2.5">
              <Toggle on={cfg.map} onChange={set('map')} label="Hiện trên Bản đồ tri ân" />
              <Toggle on={cfg.plot} onChange={set('plot')} label="Công khai sơ đồ phần mộ" description="Thân nhân tra được vị trí khu – hàng – mộ" />
              <Toggle on={cfg.tour} onChange={set('tour')} label="Bật tham quan 360°" description={cfg.tour ? '3 cảnh đã cấu hình' : 'Chưa có cảnh nào'} />
              <Toggle on={cfg.contribute} onChange={set('contribute')} label="Nhận đóng góp tư liệu" />
              <Toggle on={cfg.stats} onChange={set('stats')} label="Hiện số mộ chưa rõ danh tính" />
            </div>
          </Panel>
          <Panel title="Thứ tự hiển thị">
            <Field label="Vị trí trong danh sách công khai"><Select options={['1', '2', '3', '4']} value="1" /></Field>
          </Panel>
          {!isNew && (
            <Panel title="Vùng nguy hiểm">
              <p className="text-[13px] text-ink-soft">Ẩn nghĩa trang sẽ ẩn cả {c.graves} hồ sơ phần mộ khỏi cổng công khai. Có thể khôi phục.</p>
              <Btn variant="danger" size="sm" className="mt-3">Ẩn nghĩa trang</Btn>
            </Panel>
          )}
        </div>
      </div>

      <FormFooter note={isNew ? 'Chưa lưu' : 'Tự động lưu nháp lúc 10:41'}>
        <Btn onClick={() => onNavigate?.('cemeteries')}>Huỷ</Btn>
        <Btn variant="primary" onClick={() => onNavigate?.(isNew ? 'mapEditor' : 'cemeteries')}>{isNew ? 'Lưu và dựng sơ đồ' : 'Lưu thay đổi'}</Btn>
      </FormFooter>
    </AdminShell>
  )
}
