import React, { useState } from 'react'
import { ArrowLeft, Check, Facebook, Link2, Printer } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { OrnamentRule } from '../shared/components/Ornaments'
import { Breadcrumb, Container } from '../shared/components/ui'
import { IMG, NEWS } from '../shared/data'
import type { Navigate } from '../shared/nav'

export const args = {
  title: 'Lễ dâng hương tri ân nhân Ngày Thương binh – Liệt sĩ 27/7',
  date: '27/07/2025',
  category: 'Sự kiện',
}

export const argTypes = {
  title: { control: 'text' },
  date: { control: 'text' },
  category: { control: 'select', options: ['Hoạt động', 'Sự kiện', 'Thông báo', 'Hướng dẫn'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate; recordId?: string }

export default function Article(props: Props) {
  const merged = { ...args, ...props }
  const { onNavigate } = merged
  const item = NEWS.find((n) => n.id === merged.recordId) ?? NEWS.find((n) => n.title === merged.title)
  const title = item && merged.recordId ? item.title : merged.title
  const date = item && merged.recordId ? item.date : merged.date
  const category = item && merged.recordId ? item.category : merged.category
  const lede = item?.excerpt ?? 'Chính quyền, các đoàn thể và nhân dân xã Thư Lâm dâng hương, thắp nến tri ân tại các nghĩa trang liệt sĩ trên địa bàn.'
  const cover = item?.image ?? IMG.incense
  const related = NEWS.filter((n) => n.title !== title).sort((a, b) => Number(b.category === category) - Number(a.category === category)).slice(0, 3)
  const [copied, setCopied] = useState(false)
  const copyLink = async () => {
    try { await navigator.clipboard?.writeText(window.location.href) } catch { /* not allowed here */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener')

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="article" onNavigate={onNavigate} />

      <article>
        <header className="paper-grain border-b border-line">
          <Container className="max-w-3xl pt-8 pb-10 md:pt-10 md:pb-14">
            <Breadcrumb items={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Tin tức', onClick: () => onNavigate?.('news') }, { label: category }]} />
            <h1 className="mt-6 font-serif text-[2.1rem] leading-[1.15] font-medium text-heritage-ink md:text-[3rem]">{title}</h1>
            <p className="mt-5 text-[1.12rem] leading-relaxed text-ink-soft">{lede}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-[0.92rem] text-ink-mute">
              <p>{date} · Ban biên tập Cổng thông tin</p>
              <div className="flex items-center gap-1">
                {copied && <span role="status" className="mr-2 text-[0.88rem] text-jade">Đã sao chép liên kết</span>}
                <IconBtn label="Chia sẻ Facebook" onClick={shareFacebook}><Facebook className="h-4 w-4" /></IconBtn>
                <IconBtn label="Sao chép liên kết" onClick={copyLink}>{copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}</IconBtn>
                <IconBtn label="In bài viết" onClick={() => window.print()}><Printer className="h-4 w-4" /></IconBtn>
              </div>
            </div>
          </Container>
        </header>

        <Container className="max-w-4xl pt-10">
          <figure>
            <img src={cover} alt={title} className="aspect-[16/9] w-full rounded-sm object-cover" />
            <figcaption className="mt-3 text-[0.88rem] text-ink-mute">{item && item.id !== 'n2' ? 'Ảnh minh hoạ. Ảnh: Ban biên tập Cổng thông tin.' : 'Nén hương tri ân tại Nghĩa trang Liệt sĩ Thụy Lâm. Ảnh: Ban quản lý nghĩa trang.'}</figcaption>
          </figure>
        </Container>

        <Container className="max-w-[68ch] py-12 text-[1.1rem] leading-[1.8] text-ink">
          <p>Sáng ngày 27/7, trong không khí trang nghiêm, đại diện chính quyền địa phương, các đoàn thể, thân nhân liệt sĩ và đông đảo người dân đã đến dâng hương, dâng hoa tại các nghĩa trang liệt sĩ trên địa bàn xã.</p>
          <p className="mt-6">Tại Nghĩa trang Liệt sĩ Thụy Lâm (thôn Thụy Lôi), đoàn đã dành phút mặc niệm tưởng nhớ các anh hùng liệt sĩ đã hy sinh vì độc lập, tự do của Tổ quốc. Mỗi phần mộ đều được thắp nén hương và đặt một bông hoa.</p>

          <OrnamentRule className="my-10 justify-center text-gold" />
          <blockquote className="font-serif text-[1.55rem] leading-snug text-heritage-ink">
            “Mỗi nén hương hôm nay là lời nhắc thế hệ sau về sự hy sinh của cha ông, để không một ai bị lãng quên.”
            <footer className="mt-3 font-sans text-[0.95rem] text-ink-mute">— Đại diện Ban quản lý nghĩa trang</footer>
          </blockquote>
          <OrnamentRule className="my-10 justify-center text-gold" />

          <h2 className="font-serif text-[1.6rem] text-heritage-ink">Thắp nến tri ân buổi tối</h2>
          <p className="mt-4">Buổi tối cùng ngày, đoàn viên thanh niên tổ chức thắp nến tại các phần mộ. Đây là hoạt động được duy trì nhiều năm, trở thành nét đẹp trong đời sống văn hoá của địa phương.</p>
          <p className="mt-6">Thân nhân ở xa có thể tra cứu vị trí phần mộ và gửi lời tri ân trực tuyến trên cổng thông tin.</p>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-8">
            <button onClick={() => onNavigate?.('soldiers')} className="rounded-md bg-heritage px-5 py-3 text-[0.95rem] font-semibold text-white transition-colors duration-150 hover:bg-heritage-deep">Tra cứu liệt sĩ</button>
            <button onClick={() => onNavigate?.('news')} className="inline-flex items-center gap-2 rounded-md px-4 py-3 text-[0.95rem] font-semibold text-heritage transition-colors duration-150 hover:bg-heritage-tint"><ArrowLeft className="h-4 w-4" /> Tất cả tin tức</button>
          </div>
        </Container>
      </article>

      <section className="border-t border-line bg-ivory py-14">
        <Container>
          <h2 className="font-serif text-[1.8rem] text-heritage-ink">Bài viết liên quan</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((n) => (
              <article key={n.id} className="flex flex-col">
                <button onClick={() => onNavigate?.('article', { id: n.id })} className="group text-left">
                  <div className="overflow-hidden rounded-sm">
                    <img src={n.image} alt="" className="aspect-[3/2] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                  </div>
                  <p className="mt-4 text-[0.85rem] text-gold"><span className="font-medium">{n.category}</span> · {n.date}</p>
                  <h3 className="mt-1 font-serif text-[1.3rem] leading-snug group-hover:text-heritage">{n.title}</h3>
                </button>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function IconBtn({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex h-11 w-11 items-center justify-center rounded-md text-ink-soft transition-colors duration-150 hover:bg-heritage-tint hover:text-heritage">
      {children}
    </button>
  )
}
