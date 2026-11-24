import React, { useState } from 'react'
import { ArrowUpRight, Info, MapPin, Plus, Save, UserRound } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Field, Input, Select, Textarea, Toggle } from '../../shared/admin/ui'
import { IMG } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  scene: 'gate',
  hotspot: 'h2',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

type Kind = 'scene' | 'record' | 'info'
type Hotspot = { id: string; kind: Kind; label: string; x: number; y: number; target: string }

const SCENES = [
  { id: 'gate', name: 'Cổng chính', img: IMG.panorama, spots: 4 },
  { id: 'altar', name: 'Đài Tổ quốc ghi công', img: IMG.hero, spots: 3 },
  { id: 'zoneA', name: 'Khu A – lối giữa', img: IMG.cemetery, spots: 6 },
  { id: 'zoneC', name: 'Khu C – hàng 1', img: IMG.incense, spots: 2 },
]

const SPOTS: Hotspot[] = [
  { id: 'h1', kind: 'scene', label: 'Đi tới Đài Tổ quốc ghi công', x: 52, y: 54, target: 'Đài Tổ quốc ghi công' },
  { id: 'h2', kind: 'record', label: 'Phần mộ LS Nguyễn Văn Thành', x: 28, y: 64, target: 'Liệt sĩ Nguyễn Văn Thành · Khu A · Hàng 2 · Mộ 07' },
  { id: 'h3', kind: 'info', label: 'Lịch sử xây dựng nghĩa trang', x: 74, y: 40, target: '' },
  { id: 'h4', kind: 'scene', label: 'Rẽ sang Khu A', x: 14, y: 50, target: 'Khu A – lối giữa' },
]

const KIND_LABEL: Record<Kind, string> = { scene: 'Chuyển cảnh', record: 'Liên kết hồ sơ', info: 'Thông tin' }
const KIND_ICON: Record<Kind, React.ComponentType<{ className?: string }>> = { scene: ArrowUpRight, record: UserRound, info: Info }

export default function Tour360Config(props: Props) {
  const { scene, hotspot, onNavigate } = { ...args, ...props }
  const [sc, setSc] = useState(scene)
  const [hs, setHs] = useState(hotspot)
  const cur = SCENES.find((s) => s.id === sc) ?? SCENES[0]
  const spot = SPOTS.find((s) => s.id === hs)

  return (
    <AdminShell
      active="tour360"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Nội dung' }, { label: 'Nội dung 360°' }]}
      title="Nghĩa trang Liệt sĩ Thụy Lâm · 360°"
      bleed
      actions={
        <>
          <Select options={['NTLS Thụy Lâm', 'NTLS Vân Hà', 'Cụm di tích đền Sái']} className="w-48" />
          <Btn variant="primary" icon={<Save className="size-4" />}>Lưu thay đổi</Btn>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto border-b border-line bg-surface p-3 lg:w-56 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <p className="hidden px-1 text-xs font-medium text-ink-mute lg:block">Cảnh có sẵn · {SCENES.length}</p>
          {SCENES.map((s) => (
            <button key={s.id} onClick={() => { setSc(s.id); setHs('') }} className={`w-36 shrink-0 rounded-md p-1.5 text-left ring-1 transition-[box-shadow] duration-150 lg:w-full ${s.id === sc ? 'ring-2 ring-heritage' : 'ring-line hover:ring-line-strong'}`}>
              <img src={s.img} alt="" className="aspect-[2/1] w-full rounded object-cover" />
              <span className="mt-1 block truncate text-[13px] font-medium">{s.name}</span>
              <span className="block text-xs text-ink-mute">{s.spots} điểm tương tác</span>
            </button>
          ))}
        </aside>

        <div className="flex min-h-[360px] min-w-0 flex-1 flex-col bg-ink">
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <img src={cur.img} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-ink/15" />
            {SPOTS.map((s) => {
              const I = KIND_ICON[s.kind]
              const on = s.id === hs
              return (
                <button
                  key={s.id}
                  onClick={() => setHs(s.id)}
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  aria-label={s.label}
                >
                  <span className={`grid size-9 place-items-center rounded-full border-2 transition-transform duration-150 ease-out ${on ? 'scale-110 border-gold-soft bg-heritage text-white' : 'border-white/90 bg-ink/55 text-white hover:scale-105'}`}>
                    <I className="size-4" />
                  </span>
                  <span className={`absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded bg-ink/80 px-2 py-0.5 text-xs text-white ${on ? '' : 'hidden group-hover:block'}`}>{s.label}</span>
                </button>
              )
            })}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2 text-xs text-ivory/70">
            <span>Bấm vào ảnh để đặt điểm mới · kéo điểm để di chuyển</span>
            <span className="tabular-nums">Góc nhìn mặc định: 182° · nghiêng −4°</span>
          </div>
        </div>

        <aside className="min-w-0 shrink-0 overflow-y-auto border-t border-line bg-surface lg:w-80 lg:border-l lg:border-t-0">
          {spot ? (
            <div className="space-y-2.5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold">Điểm tương tác</p>
                <button className="text-[13px] text-heritage hover:underline">Xoá điểm</button>
              </div>
              <Field label="Loại điểm"><Select options={Object.values(KIND_LABEL)} value={KIND_LABEL[spot.kind]} /></Field>
              <Field label="Nhãn hiển thị" required><Input defaultValue={spot.label} /></Field>
              {spot.kind === 'record' && (
                <Field label="Hồ sơ liên kết" hint="Mở thẻ hồ sơ khi người xem bấm vào">
                  <div className="flex items-center gap-2 rounded-md border border-line-strong p-2">
                    <img src={IMG.portraitS1} alt="" className="size-9 rounded object-cover" />
                    <div className="min-w-0 text-[13px]">
                      <p className="font-medium">Liệt sĩ Nguyễn Văn Thành</p>
                      <p className="truncate text-xs text-ink-mute">Khu A · Hàng 2 · Mộ 07</p>
                    </div>
                  </div>
                </Field>
              )}
              {spot.kind === 'scene' && <Field label="Chuyển tới cảnh"><Select options={SCENES.map((s) => s.name)} value={spot.target} /></Field>}
              {spot.kind === 'info' && <Field label="Nội dung"><Textarea defaultValue="Nghĩa trang được xây dựng năm 1976, tôn tạo năm 2015 với sự đóng góp của nhân dân và con em xa quê." /></Field>}
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Ngang (°)"><Input defaultValue={Math.round(spot.x * 3.6)} className="tabular-nums" /></Field>
                <Field label="Dọc (°)"><Input defaultValue={Math.round((50 - spot.y) * 0.9)} className="tabular-nums" /></Field>
              </div>
              <Toggle on label="Hiện nhãn khi chưa di chuột" />
            </div>
          ) : (
            <div className="space-y-2.5 p-4">
              <p className="text-[15px] font-semibold">{cur.name}</p>
              <Field label="Tên cảnh"><Input defaultValue={cur.name} /></Field>
              <Field label="Mô tả ngắn"><Textarea defaultValue="Lối vào chính, nhìn thẳng về Đài Tổ quốc ghi công." className="min-h-20" /></Field>
              <Toggle on label="Cảnh mở đầu" description="Người xem bắt đầu tham quan từ đây" />
              <ul className="divide-y divide-line rounded-md border border-line">
                {SPOTS.map((s) => (
                  <li key={s.id}>
                    <button onClick={() => setHs(s.id)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-canvas">
                      <MapPin className="size-3.5 shrink-0 text-heritage" />
                      <span className="min-w-0 flex-1 truncate">{s.label}</span>
                      <span className="text-xs text-ink-mute">{KIND_LABEL[s.kind]}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Btn size="sm" icon={<Plus className="size-3.5" />}>Thêm điểm</Btn>
            </div>
          )}
        </aside>
      </div>
    </AdminShell>
  )
}
