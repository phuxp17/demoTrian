import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock, MapPin, X } from 'lucide-react'
import { DirectionsButton } from '../shared/components/Actions'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { Breadcrumb, Button, Container, SampleNotice, SectionTitle, Tag, TextField } from '../shared/components/ui'
import { MeanderBand } from '../shared/components/Ornaments'
import { MemorialMap } from '../shared/components/MemorialMap'
import { IMG, MAP_POINTS, RED_ADDRESSES } from '../shared/data'
import type { Navigate } from '../shared/nav'

export const args = {
  addressIndex: 1,
}

export const argTypes = {
  addressIndex: { control: 'range', min: 0, max: 5, step: 1 },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate; recordId?: string }

const GALLERY = [
  { src: IMG.dinh, cap: 'Mặt tiền và mái đình' },
  { src: IMG.incense, cap: 'Hương án trong ngày lễ' },
  { src: IMG.artifacts, cap: 'Hiện vật lưu giữ' },
  { src: IMG.lotus, cap: 'Cảnh quan xung quanh' },
]

export default function RedAddressDetail(props: Props) {
  const { addressIndex, onNavigate, recordId } = { ...args, ...props }
  const r = RED_ADDRESSES.find((x) => x.id === recordId) ?? RED_ADDRESSES[Math.min(Math.max(addressIndex, 0), RED_ADDRESSES.length - 1)]
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [booking, setBooking] = useState<'closed' | 'open' | 'sent'>('closed')
  const others = RED_ADDRESSES.filter((x) => x.id !== r.id).slice(0, 3)

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="redAddress" onNavigate={onNavigate} />

      <Container className="pt-8">
        <Breadcrumb items={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Địa chỉ đỏ', onClick: () => onNavigate?.('redAddresses') }, { label: r.name }]} />
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Tag tone="red">{r.kind}</Tag>
            <h1 className="mt-4 font-serif text-[2.4rem] leading-[1.1] font-medium text-heritage-ink md:text-[3.4rem]">{r.name}</h1>
          </div>
          <p className="flex items-center gap-2 text-[1.05rem] text-ink-soft lg:col-span-4 lg:justify-end"><MapPin className="h-5 w-5 text-gold" />{r.address}</p>
        </div>
      </Container>

      <Container className="mt-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 md:h-[480px]">
          {[r.image, ...GALLERY.map((g) => g.src)].slice(0, 5).map((src, i) => (
            <button key={i} onClick={() => setLightbox(i === 0 ? 0 : i - 1)} className={`overflow-hidden rounded-sm ${i === 0 ? 'col-span-4 row-span-2 aspect-[3/2] md:col-span-2 md:aspect-auto' : 'hidden md:block'}`} aria-label="Mở ảnh lớn">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </Container>
      <MeanderBand className="mt-10 text-gold/40" height={12} />

      <Container className="grid gap-12 py-12 lg:grid-cols-12 lg:gap-16">
        <article className="min-w-0 lg:col-span-8">
          <h2 className="font-serif text-[1.8rem]">Giới thiệu địa điểm</h2>
          <div className="mt-5 max-w-[68ch] space-y-5 text-[1.08rem] leading-[1.8] text-ink-soft">
            <p>{r.name} là một trong những địa điểm gắn với đời sống tâm linh và truyền thống của người dân Thư Lâm. Nơi đây thường được chọn làm điểm tổ chức lễ dâng hương, sinh hoạt truyền thống cho đoàn viên, học sinh.</p>
            <p>Lịch sử hình thành, các sự kiện gắn với địa điểm và quyết định xếp hạng (nếu có) đang được Ban biên tập tổng hợp từ tư liệu địa phương và sẽ được công bố sau khi xác minh.</p>
          </div>
          <SampleNotice className="mt-8" />

          <h2 className="mt-14 font-serif text-[1.8rem]">Hoạt động tại địa điểm</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {[
              ['Dâng hương tri ân', 'Các dịp 27/7, 22/12 và ngày lễ lớn'],
              ['Sinh hoạt truyền thống', 'Theo đăng ký của trường học, đoàn thể'],
              ['Tham quan tự do', 'Trong giờ mở cửa'],
            ].map(([t, d]) => (
              <li key={t} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between"><span className="font-medium">{t}</span><span className="text-ink-soft">{d}</span></li>
            ))}
          </ul>
        </article>

        <aside className="min-w-0 space-y-6 lg:col-span-4">
          <div className="rounded-md border border-line-strong bg-ivory p-6">
            <h2 className="font-serif text-xl">Thông tin tham quan</h2>
            <ul className="mt-4 space-y-3 text-ink-soft">
              <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />Giờ mở cửa: đang cập nhật</li>
              <li className="flex gap-3"><CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-gold" />Xếp hạng: {r.rank}</li>
            </ul>
            {booking === 'open' ? (
              <form onSubmit={(e) => { e.preventDefault(); setBooking('sent') }} className="mt-6 flex flex-col gap-4 border-t border-line-strong pt-6">
                <TextField label="Đơn vị, trường học" placeholder="Ví dụ: Trường THCS Thư Lâm" />
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="Số người" placeholder="40" />
                  <TextField label="Ngày dự kiến" placeholder="dd/mm/yyyy" />
                </div>
                <TextField label="Số điện thoại liên hệ" placeholder="09xx xxx xxx" />
                <div className="flex flex-col gap-2">
                  <Button type="submit">Gửi đăng ký</Button>
                  <Button type="button" variant="ghost" onClick={() => setBooking('closed')}>Huỷ</Button>
                </div>
              </form>
            ) : booking === 'sent' ? (
              <div role="status" className="mt-6 border-t border-line-strong pt-6">
                <p className="flex items-center gap-2 font-serif text-xl text-heritage-ink"><CheckCircle2 className="h-5 w-5 text-jade" /> Đã gửi đăng ký</p>
                <p className="mt-1 text-ink-soft">Ban quản lý sẽ gọi lại để xác nhận lịch trong 3 ngày làm việc.</p>
                <DirectionsButton place={r.name} className="mt-5 w-full" />
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={() => setBooking('open')}>Đăng ký tham quan theo đoàn</Button>
                <DirectionsButton place={r.name} />
              </div>
            )}
          </div>
          <MemorialMap points={MAP_POINTS.filter((p) => p.kind === 'red')} selectedId={r.id} onSelect={(id) => onNavigate?.(id === r.id ? 'memorialMap' : 'redAddress', { id })} className="aspect-[4/3] rounded-md border border-line-strong" />
        </aside>
      </Container>

      <section className="border-t border-line bg-ivory py-14">
        <Container>
          <SectionTitle title="Địa chỉ đỏ khác" action={<Button variant="ghost" onClick={() => onNavigate?.('redAddresses')}>Xem tất cả</Button>} />
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {others.map((o) => (
              <button key={o.id} onClick={() => onNavigate?.('redAddress', { id: o.id })} className="group text-left">
                <img src={o.image} alt="" className="aspect-[3/2] w-full rounded-sm object-cover" />
                <p className="mt-3 text-[0.88rem] text-gold">{o.kind}</p>
                <p className="font-serif text-[1.3rem] leading-snug group-hover:text-heritage">{o.name}</p>
              </button>
            ))}
          </div>
        </Container>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div className="fixed inset-0 z-50 flex flex-col bg-[#14100d]/95 text-paper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} role="dialog" aria-label="Thư viện ảnh">
            <div className="flex justify-end p-4"><button onClick={() => setLightbox(null)} className="flex h-12 w-12 items-center justify-center rounded-md hover:bg-white/10" aria-label="Đóng"><X className="h-6 w-6" /></button></div>
            <div className="flex flex-1 items-center gap-4 px-4 pb-8">
              <button onClick={() => setLightbox((l) => ((l ?? 0) + GALLERY.length - 1) % GALLERY.length)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-white/20" aria-label="Ảnh trước"><ChevronLeft className="h-6 w-6" /></button>
              <figure className="mx-auto max-w-4xl flex-1">
                <img src={GALLERY[lightbox].src} alt={GALLERY[lightbox].cap} className="max-h-[70vh] w-full rounded-sm object-contain" />
                <figcaption className="mt-3 text-center text-gold-pale">{GALLERY[lightbox].cap} · {lightbox + 1}/{GALLERY.length}</figcaption>
              </figure>
              <button onClick={() => setLightbox((l) => ((l ?? 0) + 1) % GALLERY.length)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-white/20" aria-label="Ảnh sau"><ChevronRight className="h-6 w-6" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
