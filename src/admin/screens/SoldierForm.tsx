import React from 'react'
import { FileText, ImagePlus, MapPin, Paperclip, Upload } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Callout, Field, FormFooter, Input, Panel, Select, Status, Textarea } from '../../shared/admin/ui'
import { soldierCode } from '../../shared/admin/data'
import { CEMETERIES, IMG, SOLDIERS } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  mode: 'edit',
  duplicate: false,
  plotConflict: false,
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

export default function SoldierForm(props: Props) {
  const { mode, duplicate, plotConflict, onNavigate, recordId } = { ...args, ...props }
  const isNew = mode === 'new' || recordId === 'new'
  const s = SOLDIERS.find((x) => x.id === recordId) ?? SOLDIERS[0]
  const v = (x: string) => (isNew ? '' : x)
  const twin = SOLDIERS[13]

  return (
    <AdminShell
      active="soldierEdit"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Liệt sĩ & phần mộ', page: 'soldiers' }, { label: isNew ? 'Thêm hồ sơ' : s.name }]}
      title={isNew ? 'Thêm hồ sơ liệt sĩ' : `Liệt sĩ ${s.name}`}
      subtitle={isNew ? 'Hồ sơ mới cần được lãnh đạo phê duyệt trước khi công khai.' : <span className="inline-flex flex-wrap items-center gap-2"><span className="tabular-nums">{soldierCode(s.id)}</span><Status s="published" /> phiên bản 4 · cập nhật 10/09/2025</span>}
    >
      {duplicate && (
        <Callout tone="warn" title="Có thể trùng với một hồ sơ đã có">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <span>
              <b className="font-medium">{twin.name}</b> ({twin.born} – {twin.died}, {twin.hometown.replace(', Thư Lâm', '')}) · {soldierCode(twin.id)} · {twin.cemetery}. Trùng họ tên, năm sinh và quê quán.
            </span>
            <span className="flex gap-2">
              <Btn size="sm">So sánh</Btn>
              <Btn size="sm" variant="ghost">Không trùng, tiếp tục</Btn>
            </span>
          </div>
        </Callout>
      )}

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-2.5">
          <Panel title="Thông tin liệt sĩ">
            <div className="grid gap-2.5 sm:grid-cols-6">
              <Field label="Họ và tên" required className="sm:col-span-4"><Input defaultValue={duplicate ? twin.name : v(s.name)} placeholder="Nguyễn Văn A" /></Field>
              <Field label="Tên gọi khác" className="sm:col-span-2"><Input placeholder="Bí danh, tên thường gọi" /></Field>
              <Field label="Năm sinh" required className="sm:col-span-2"><Input defaultValue={duplicate ? twin.born : v(s.born)} className="tabular-nums" /></Field>
              <Field label="Ngày hy sinh" required className="sm:col-span-2"><Input defaultValue={duplicate ? twin.died : v(`12/07/${s.died}`)} className="tabular-nums" /></Field>
              <Field label="Cấp bậc" className="sm:col-span-2"><Select options={['Chiến sĩ', 'Binh nhì', 'Binh nhất', 'Hạ sĩ', 'Trung sĩ', 'Thượng sĩ', 'Tiểu đội trưởng']} value={isNew ? undefined : s.rank} /></Field>
              <Field label="Quê quán" required className="sm:col-span-3"><Input defaultValue={duplicate ? twin.hometown : v(s.hometown)} /></Field>
              <Field label="Đơn vị" className="sm:col-span-3"><Input defaultValue={v(s.unit)} /></Field>
              <Field label="Nơi hy sinh" className="sm:col-span-3"><Input defaultValue={v(s.diedAt)} /></Field>
              <Field label="Số bằng Tổ quốc ghi công" className="sm:col-span-3"><Input defaultValue={v('TQGC 2817/1974')} className="tabular-nums" /></Field>
              <Field label="Tiểu sử, câu chuyện" hint="Hiển thị trên trang hồ sơ công khai" className="sm:col-span-6">
                <Textarea defaultValue={v('Nhập ngũ tháng 4/1968, chiến đấu tại mặt trận Quảng Trị. Anh hy sinh trong 81 ngày đêm bảo vệ Thành cổ khi mới 23 tuổi. Những lá thư anh gửi về cho mẹ vẫn được gia đình lưu giữ.')} />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Vị trí phần mộ"
            description="Chọn nghĩa trang rồi khu – hàng – số mộ, hoặc chọn trực tiếp trên sơ đồ"
            action={<Btn size="sm" icon={<MapPin className="size-3.5" />} onClick={() => onNavigate?.('mapEditor')}>Chọn trên sơ đồ</Btn>}
          >
            <div className="grid gap-2.5 sm:grid-cols-4">
              <Field label="Nghĩa trang" required className="sm:col-span-4"><Select options={CEMETERIES.map((c) => c.name)} value={isNew ? undefined : s.cemetery} /></Field>
              <Field label="Khu"><Select options={['A', 'B', 'C', 'D']} value={isNew ? undefined : 'A'} /></Field>
              <Field label="Hàng"><Select options={['1', '2', '3', '4', '5', '6']} value={isNew ? undefined : '2'} /></Field>
              <Field label="Số mộ" error={plotConflict ? 'Mộ 07 đã gán cho LS-0006' : undefined}><Input defaultValue={isNew ? '' : '07'} invalid={plotConflict} className="tabular-nums" /></Field>
              <Field label="Mã mộ" hint="Tự sinh"><Input value={isNew ? '—' : 'TL-A-02-07'} readOnly className="bg-canvas tabular-nums text-ink-soft" /></Field>
            </div>
            {plotConflict && (
              <Callout tone="danger" className="mt-4">Vị trí này đang thuộc hồ sơ <b className="font-medium">Hoàng Văn Khải</b>. Chọn mộ trống khác, hoặc mở sơ đồ để chuyển hồ sơ kia đi.</Callout>
            )}
          </Panel>

          <Panel title="Giấy tờ đính kèm" description="Chỉ hiển thị nội bộ trừ khi bật trong Cấu hình dữ liệu công khai">
            <ul className="divide-y divide-line">
              {(isNew ? [] : [['Giấy báo tử (bản scan).pdf', '1,2 MB'], ['Bằng Tổ quốc ghi công.jpg', '640 KB']]).map(([n, sz]) => (
                <li key={n} className="flex items-center gap-2.5 py-2.5 text-sm">
                  <FileText className="size-4 text-ink-mute" />
                  <span className="min-w-0 flex-1 truncate">{n}</span>
                  <span className="text-xs tabular-nums text-ink-mute">{sz}</span>
                </li>
              ))}
            </ul>
            <Btn size="sm" icon={<Paperclip className="size-3.5" />} className="mt-2">Đính kèm tệp</Btn>
          </Panel>
        </div>

        <div className="space-y-2.5 xl:sticky xl:top-2.5 xl:self-start">
          <Panel title="Ảnh chân dung">
            {isNew ? (
              <button className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line-strong text-[13px] text-ink-mute hover:border-gold hover:text-ink">
                <ImagePlus className="size-6" /> Tải ảnh lên
                <span className="text-xs">JPG, PNG · tối đa 5 MB</span>
              </button>
            ) : (
              <>
                <img src={IMG.portraitS1} alt="" className="aspect-[3/4] w-full rounded-md object-cover" />
                <div className="mt-3 flex gap-2">
                  <Btn size="sm" icon={<Upload className="size-3.5" />} className="flex-1">Thay ảnh</Btn>
                  <Btn size="sm" variant="danger">Gỡ</Btn>
                </div>
                <Field label="Nguồn ảnh" className="mt-3"><Input defaultValue="Gia đình cung cấp, 2025" /></Field>
              </>
            )}
          </Panel>
          <Panel title="Ảnh phần mộ">
            <div className="grid grid-cols-3 gap-2">
              {!isNew && [IMG.cemetery, IMG.incense].map((src) => <img key={src} src={src} alt="" className="aspect-square w-full rounded-md object-cover" />)}
              <button aria-label="Thêm ảnh mộ" className="grid aspect-square place-items-center rounded-md border border-dashed border-line-strong text-ink-mute hover:border-gold hover:text-ink"><ImagePlus className="size-5" /></button>
            </div>
          </Panel>
          {!isNew && (
            <Panel title="Thân nhân liên kết">
              <p className="text-sm">Gia đình ông Nguyễn Văn Hùng</p>
              <p className="text-xs text-ink-mute">Em trai · Thôn Thụy Lôi 1</p>
              <button onClick={() => onNavigate?.('familyEdit', { id: 'f1' })} className="mt-2 text-[13px] text-heritage hover:underline">Mở hồ sơ gia đình</button>
            </Panel>
          )}
        </div>
      </div>

      <FormFooter note={isNew ? 'Chưa lưu' : 'Tự động lưu nháp lúc 10:41'}>
        <Btn onClick={() => onNavigate?.('soldiers')}>Huỷ</Btn>
        <Btn>Lưu nháp</Btn>
        <Btn variant="primary" disabled={plotConflict} onClick={() => onNavigate?.('soldiers')}>Gửi duyệt</Btn>
      </FormFooter>
    </AdminShell>
  )
}
