import React, { useState } from 'react'
import { Clock, MapPin, Phone, Rotate3d, Search } from 'lucide-react'
import { DirectionsButton } from '../shared/components/Actions'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { Breadcrumb, Button, Container, SectionTitle } from '../shared/components/ui'
import { MeanderBand } from '../shared/components/Ornaments'
import { CEMETERIES, IMG, SOLDIERS } from '../shared/data'
import type { Navigate } from '../shared/nav'

export const args = {
  cemeteryIndex: 0,
}

export const argTypes = {
  cemeteryIndex: { control: 'select', options: [0, 1, 2, 3] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate; recordId?: string }

export default function CemeteryDetail(props: Props) {
  const { cemeteryIndex, onNavigate, recordId } = { ...args, ...props }
  const c = CEMETERIES.find((x) => x.id === recordId) ?? CEMETERIES[cemeteryIndex] ?? CEMETERIES[0]
  const [q, setQ] = useState('')
  const buried = SOLDIERS.filter((s) => s.cemetery === c.name)
  const zones = ['Khu A', 'Khu B', 'Khu C', 'Khu D']

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="cemetery" onNavigate={onNavigate} />

      <section className="relative">
        <img src={c.image} alt={`Toàn cảnh ${c.name}`} className="portal-photo h-[380px] w-full object-cover md:h-[500px]" />
        <div className="absolute inset-0 bg-[#22120f]/60" />
        <Container className="absolute inset-x-0 bottom-0 pb-10 text-[var(--portal-on-dark)]">
          <div className="[&_*]:text-[var(--portal-on-dark-soft)] [&_button:hover]:text-white">
            <Breadcrumb items={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Nghĩa trang', onClick: () => onNavigate?.('cemeteries') }, { label: c.name }]} />
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.4rem] leading-[1.2] font-medium md:text-[3.4rem]">{c.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-[1.05rem] text-[var(--portal-on-dark-soft)]"><MapPin className="h-4 w-4" />{c.address}</p>
        </Container>
      </section>
      <MeanderBand gilt className="text-gold/50" height={12} />

      <Container className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onNavigate?.('soldiers', { query: q.trim() })
            }}
            className="rounded-md border border-line-strong bg-ivory p-5 md:p-6">
            <label htmlFor="cem-q" className="font-serif text-xl text-heritage-ink">Tìm liệt sĩ an táng tại đây</label>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <span className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-mute" />
                <input id="cem-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Họ tên, năm sinh hoặc quê quán" className="h-13 w-full rounded-md border border-line-strong bg-paper pr-4 pl-12 focus:border-heritage focus:outline-none" />
              </span>
              <Button size="lg" type="submit">Tìm kiếm</Button>
            </div>
          </form>

          <h2 className="mt-14 font-serif text-[1.8rem]">Giới thiệu</h2>
          <div className="mt-4 space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
            <p>{c.name} là nơi quy tập, an táng các anh hùng liệt sĩ của địa phương. Nghĩa trang được chia thành các khu mộ, mỗi khu có lối đi và bảng chỉ dẫn để thân nhân dễ dàng tìm viếng.</p>
            <p>Thông tin lịch sử hình thành, các đợt tu bổ và danh sách quy tập đang được Ban quản lý tổng hợp từ hồ sơ lưu trữ và sẽ được cập nhật khi có xác nhận chính thức.</p>
          </div>

          <h2 className="mt-14 font-serif text-[1.8rem]">Các khu mộ</h2>
          <ul className="mt-6 grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
            {zones.map((z, i) => (
              <li key={z} className="border-r border-b border-line">
                <button onClick={() => onNavigate?.('graveMap', { id: c.id })} className="flex w-full flex-col p-5 text-left hover:bg-heritage-tint">
                  <span className="font-serif text-xl text-heritage-ink">{z}</span>
                  <span className="mt-1 text-[0.9rem] text-ink-soft">{Math.round(c.graves / 4) + (i === 0 ? c.graves % 4 : 0)} phần mộ</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => onNavigate?.('graveMap', { id: c.id })}>Mở sơ đồ phần mộ</Button>
            {c.has360 && <Button variant="secondary" onClick={() => onNavigate?.('viewer360', { id: c.id })}><Rotate3d className="h-4 w-4" /> Tham quan 360°</Button>}
          </div>
        </div>

        <aside className="min-w-0 space-y-8 lg:col-span-4">
          <dl className="grid grid-cols-2 gap-6 border-b border-line pb-8">
            <div><dt className="text-[0.88rem] text-ink-mute">Phần mộ</dt><dd className="font-serif text-[2.4rem] leading-none text-heritage-ink">{c.graves}</dd></div>
            <div><dt className="text-[0.88rem] text-ink-mute">Đã xác định</dt><dd className="font-serif text-[2.4rem] leading-none text-ink">{c.identified}</dd></div>
            <div className="col-span-2"><dt className="text-[0.88rem] text-ink-mute">Chưa xác định danh tính</dt><dd className="text-lg">{c.graves - c.identified} phần mộ</dd></div>
          </dl>
          <div>
            <h2 className="font-serif text-xl">Thông tin viếng thăm</h2>
            <ul className="mt-4 space-y-4 text-[0.98rem] text-ink-soft">
              <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span>Mở cửa hằng ngày, 6:00 – 18:00<br /><span className="text-ink-mute">Giờ cụ thể đang chờ Ban quản lý xác nhận</span></span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span>Ban quản lý: đang cập nhật</span></li>
              <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span>{c.address}</span></li>
            </ul>
            <DirectionsButton place={c.name} className="mt-5 w-full" />
          </div>
        </aside>
      </Container>

      <section className="border-t border-line bg-ivory py-14">
        <Container>
          <SectionTitle title="Liệt sĩ an táng tại nghĩa trang" action={<Button variant="ghost" onClick={() => onNavigate?.('soldiers')}>Xem toàn bộ danh sách</Button>} />
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {buried.map((s) => (
              <li key={s.id} className="border-t border-line-strong py-5">
                <button onClick={() => onNavigate?.('soldier', { id: s.id })} className="text-left font-serif text-[1.25rem] hover:text-heritage">Liệt sĩ {s.name}</button>
                <p className="mt-1 text-[0.92rem] text-ink-soft">{s.born} – {s.died} · {s.plot}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionTitle title="Hình ảnh nghĩa trang" />
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[IMG.panorama, IMG.incense, IMG.cemetery, IMG.lotus, IMG.hero].map((src, i) => (
              <img key={i} src={src} alt="" className={`w-full rounded-sm object-cover ${i === 0 ? 'col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto md:h-full' : 'aspect-[4/3]'}`} />
            ))}
          </div>
        </Container>
      </section>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
