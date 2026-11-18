import React, { useState } from 'react'
import { Flame, MapPin, Upload } from 'lucide-react'
import { ContributeButton } from '../shared/components/Contribute'
import { DirectionsButton, PrintButton, ShareButton } from '../shared/components/Actions'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { Breadcrumb, Button, Container, Portrait, SampleNotice, SectionTitle, Tag } from '../shared/components/ui'
import { OrnamentRule, TempleGate } from '../shared/components/Ornaments'
import { CEMETERIES, IMG, SOLDIERS } from '../shared/data'
import type { Navigate } from '../shared/nav'

export const args = {
  soldierIndex: 0,
  candles: 1286,
}

export const argTypes = {
  soldierIndex: { control: 'range', min: 0, max: 7, step: 1 },
  candles: { control: 'number' },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate; recordId?: string }

export default function SoldierProfile(props: Props) {
  const { soldierIndex, candles, onNavigate, recordId } = { ...args, ...props }
  const s = SOLDIERS.find((x) => x.id === recordId) ?? SOLDIERS[Math.min(Math.max(soldierIndex, 0), SOLDIERS.length - 1)]
  const cemeteryId = CEMETERIES.find((c) => c.name === s.cemetery)?.id
  const [lit, setLit] = useState(false)
  const related = SOLDIERS.filter((x) => x.id !== s.id && x.cemetery === s.cemetery).slice(0, 3)

  const facts: [string, string][] = [
    ['Họ và tên', s.name],
    ['Năm sinh', s.born],
    ['Quê quán', s.hometown],
    ['Cấp bậc', s.rank],
    ['Đơn vị', s.unit],
    ['Năm hy sinh', s.died],
    ['Nơi hy sinh', s.diedAt],
    ['Nơi an táng', s.cemetery],
    ['Vị trí mộ', s.plot],
  ]

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="soldier" onNavigate={onNavigate} />

      <section className="paper-grain relative overflow-hidden border-b border-line">
        <TempleGate className="pointer-events-none absolute -bottom-4 left-1/2 w-[720px] max-w-[120%] -translate-x-1/2 text-gold/12" strokeWidth={1} />
        <Container className="relative pt-8 pb-12 md:pb-16">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', onClick: () => onNavigate?.('home') },
              { label: 'Tra cứu liệt sĩ', onClick: () => onNavigate?.('soldiers') },
              { label: s.name },
            ]}
          />
          <div className="mt-10 grid items-end gap-10 md:grid-cols-[minmax(0,260px)_1fr] lg:gap-16">
            <Portrait name={s.name} className="mx-auto aspect-[3/4] w-48 md:mx-0 md:w-full" />
            <div className="text-center md:text-left">
              <p className="font-serif text-lg text-gold italic">Tổ quốc ghi công</p>
              <h1 className="mt-2 font-serif text-[2.6rem] leading-[1.1] font-medium text-heritage-ink md:text-[3.6rem]">Liệt sĩ {s.name}</h1>
              <p className="mt-4 text-[1.15rem] text-ink-soft">
                {s.born} – {s.died} · {s.rank} · Quê quán {s.hometown}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <Button size="lg" onClick={() => setLit(true)} disabled={lit} aria-pressed={lit}>
                  <Flame className="h-5 w-5" /> {lit ? 'Đã thắp nén tâm hương' : 'Thắp nén tâm hương'}
                </Button>
                <Button size="lg" variant="secondary" onClick={() => onNavigate?.('graveMap', { id: s.id })}>
                  <MapPin className="h-5 w-5" /> Xem vị trí phần mộ
                </Button>
              </div>
              <p className="mt-4 text-[0.95rem] text-ink-mute" aria-live="polite">
                {(candles + (lit ? 1 : 0)).toLocaleString('vi-VN')} lượt tưởng niệm trực tuyến
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-8">
          <h2 className="font-serif text-[1.8rem] text-ink">Thông tin hồ sơ</h2>
          <dl className="mt-6 grid border-t border-line sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 border-b border-line py-4 sm:pr-6">
                <dt className="text-[0.88rem] text-ink-mute">{k}</dt>
                <dd className={`text-[1.05rem] ${v === 'Đang xác minh' ? 'text-ink-mute italic' : 'text-ink'}`}>{v}</dd>
              </div>
            ))}
          </dl>
          <SampleNotice className="mt-6" />

          <h2 className="mt-14 font-serif text-[1.8rem] text-ink">Lời tưởng nhớ</h2>
          <div className="mt-5 border-l-2 border-gold pl-6">
            <p className="font-serif text-[1.25rem] leading-relaxed text-ink-soft italic">
              Phần tiểu sử, thư từ và lời kể của thân nhân đang được gia đình và Ban quản lý cùng sưu tầm. Mọi thông tin sẽ được đối chiếu trước khi đăng tải.
            </p>
          </div>

          <h2 className="mt-14 font-serif text-[1.8rem] text-ink">Hình ảnh & kỷ vật</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[IMG.cemetery, IMG.incense, IMG.letters].map((src, i) => (
              <figure key={i} className={i === 0 ? 'col-span-2 sm:col-span-1' : ''}>
                <img src={src} alt="" className="aspect-[4/3] w-full rounded-sm object-cover" />
                <figcaption className="mt-2 text-[0.85rem] text-ink-mute">{['Khu mộ nơi liệt sĩ yên nghỉ', 'Lễ dâng hương 27/7', 'Tư liệu gia đình lưu giữ'][i]}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <ContributeButton asLink subject={`Liệt sĩ ${s.name}`}>
              <Upload className="h-4 w-4" /> Thân nhân góp ảnh, kỷ vật cho hồ sơ này
            </ContributeButton>
            <ContributeButton asLink topic="Đính chính thông tin" subject={`Liệt sĩ ${s.name}`}>
              Báo thông tin chưa chính xác
            </ContributeButton>
          </div>
        </div>

        <aside className="min-w-0 md:grid md:grid-cols-2 md:items-start md:gap-6 lg:col-span-4 lg:block">
          <div className="rounded-md border border-line-strong bg-ivory p-6">
            <h2 className="font-serif text-xl text-heritage-ink">Nơi an nghỉ</h2>
            <p className="mt-3 text-[1.05rem] text-ink">{s.cemetery}</p>
            <p className="mt-1 text-ink-soft">{s.plot}</p>
            <div className="mt-5 grid grid-cols-6 gap-1.5" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className={`h-5 rounded-t-full ${i === 9 ? 'bg-heritage' : 'bg-gold-soft/60'}`} />
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => onNavigate?.('graveMap', { id: s.id })}>Mở sơ đồ phần mộ</Button>
              <DirectionsButton place={s.cemetery}>Chỉ đường đến nghĩa trang</DirectionsButton>
              {cemeteryId && (
                <Button variant="ghost" onClick={() => onNavigate?.('cemetery', { id: cemeteryId })}>Xem thông tin nghĩa trang</Button>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-2 md:mt-0 lg:mt-6">
            <PrintButton className="flex-1">In hồ sơ</PrintButton>
            <ShareButton className="flex-1" title={`Liệt sĩ ${s.name}`} />
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line bg-ivory py-14">
          <Container>
            <SectionTitle title="Cùng yên nghỉ tại nghĩa trang" />
            <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id} className="border-t border-line-strong py-5">
                  <button onClick={() => onNavigate?.('soldier', { id: r.id })} className="text-left font-serif text-[1.25rem] hover:text-heritage">Liệt sĩ {r.name}</button>
                  <p className="mt-1 text-[0.92rem] text-ink-soft">{r.born} – {r.died} · {r.plot}</p>
                </li>
              ))}
            </ul>
            <OrnamentRule className="mt-10 justify-center text-gold" />
          </Container>
        </section>
      )}
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
