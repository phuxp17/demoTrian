import React, { useState } from 'react'
import { CalendarHeart, MapPin, Send } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { Breadcrumb, Button, Container, Portrait, SampleNotice, Tag, TextField } from '../shared/components/ui'
import { ArchImage, OrnamentRule } from '../shared/components/Ornaments'
import { FAMILIES, IMG } from '../shared/data'
import type { Navigate } from '../shared/nav'
import { honouredLink } from '../shared/links'

export const args = {
  familyIndex: 0,
  state: 'default',
}

export const argTypes = {
  familyIndex: { control: 'range', min: 0, max: 5, step: 1 },
  state: { control: 'radio', options: ['default', 'sent'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate; recordId?: string }

export default function FamilyDetail(props: Props) {
  const { familyIndex, state, onNavigate, recordId } = { ...args, ...props }
  const f = FAMILIES.find((x) => x.id === recordId) ?? FAMILIES[Math.min(Math.max(familyIndex, 0), FAMILIES.length - 1)]
  const profile = honouredLink(f)
  const [sent, setSent] = useState(state === 'sent')

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="family" onNavigate={onNavigate} />

      <section className="paper-grain border-b border-line">
        <Container className="grid items-center gap-10 py-10 md:grid-cols-[1fr_340px] md:py-14">
          <div>
            <Breadcrumb items={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Địa chỉ gia đình', onClick: () => onNavigate?.('families') }, { label: f.head }]} />
            <Tag tone="red" className="mt-6">{f.kind}</Tag>
            <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.2] font-medium text-heritage-ink md:text-[3.2rem]">{f.head}</h1>
            <p className="mt-4 flex items-center gap-2 text-[1.05rem] text-ink-soft"><MapPin className="h-5 w-5 text-gold" />{f.address}</p>
          </div>
          <ArchImage src={IMG.home} alt="Ngôi nhà của gia đình" className="hidden aspect-[4/5] w-full md:block" />
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-7">
          <h2 className="font-serif text-[1.8rem]">Người được tri ân</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {Array.from({ length: f.members }).map((_, i) => (
              <li key={i} className="flex items-center gap-5 py-5">
                <Portrait name={i === 0 ? f.honoured : 'Thân nhân'} className="h-24 w-18 shrink-0 [&_span]:hidden" />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[1.3rem]">{i === 0 ? f.honoured : 'Thông tin đang cập nhật'}</p>
                  <p className="text-ink-soft">{i === 0 ? 'Hồ sơ đã có trên cổng thông tin' : 'Gia đình đang bổ sung hồ sơ'}</p>
                </div>
                {i === 0 && profile && (
                  <Button variant="secondary" onClick={() => onNavigate?.(profile.page, profile.params)}>Xem hồ sơ</Button>
                )}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 font-serif text-[1.8rem]">Về gia đình</h2>
          <p className="mt-4 max-w-[65ch] text-[1.05rem] leading-relaxed text-ink-soft">
            Thông tin về hoàn cảnh, các thế hệ và câu chuyện của gia đình sẽ được đăng khi có sự đồng ý của gia đình và xác nhận của chính quyền địa phương.
          </p>
          <SampleNotice className="mt-6" />
        </div>

        <aside className="min-w-0 lg:col-span-5">
          <div className="rounded-md border border-line-strong bg-ivory p-6 md:p-8">
            <CalendarHeart className="h-7 w-7 text-heritage" />
            <h2 className="mt-3 font-serif text-[1.6rem] text-heritage-ink">Đăng ký thăm hỏi gia đình</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">Dành cho đoàn thể, trường học, cá nhân muốn đến thăm. Ban quản lý sẽ liên hệ với gia đình và phản hồi lịch hẹn.</p>
            {sent ? (
              <div className="mt-6 border-t border-line-strong pt-6" role="status">
                <OrnamentRule className="text-gold" />
                <p className="mt-4 font-serif text-xl">Đã gửi đăng ký</p>
                <p className="mt-1 text-ink-soft">Cảm ơn quý vị. Ban quản lý sẽ liên hệ trong vòng 3 ngày làm việc.</p>
                <Button variant="ghost" className="mt-4 -ml-3" onClick={() => setSent(false)}>Gửi đăng ký khác</Button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="mt-6 flex flex-col gap-4">
                <TextField label="Họ tên người đại diện" placeholder="Ví dụ: Nguyễn Văn An" />
                <TextField label="Đơn vị, tổ chức (nếu có)" placeholder="Ví dụ: Chi đoàn Thôn 1" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Số điện thoại" placeholder="09xx xxx xxx" />
                  <TextField label="Ngày dự kiến" placeholder="dd/mm/yyyy" />
                </div>
                <Button type="submit" size="lg" className="mt-2"><Send className="h-4 w-4" /> Gửi đăng ký</Button>
              </form>
            )}
          </div>
        </aside>
      </Container>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
