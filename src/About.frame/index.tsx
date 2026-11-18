import React from 'react'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { PageHeader } from '../shared/components/PageHeader'
import { ArchImage } from '../shared/components/Ornaments'
import { Button, Container, SampleNotice, SectionTitle } from '../shared/components/ui'
import { CEMETERIES, IMG } from '../shared/data'
import type { Navigate } from '../shared/nav'

export const args = {
  showContact: true,
}

export const argTypes = {
  showContact: { control: 'boolean' },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

const MILESTONES = [
  { when: '2024', what: 'Khảo sát, lập danh sách nghĩa trang và phần mộ liệt sĩ trên địa bàn xã.' },
  { when: 'Đầu 2025', what: 'Số hoá sơ đồ khu, hàng, mộ; chụp ảnh toàn cảnh 360° hai nghĩa trang chính.' },
  { when: '07/2025', what: 'Ra mắt cổng thông tin, mở tra cứu liệt sĩ và tiếp nhận tư liệu từ thân nhân.' },
  { when: 'Tiếp theo', what: 'Đối chiếu hồ sơ với cơ quan chức năng, bổ sung ảnh chân dung và lời kể của gia đình.' },
]

export default function About(props: Props) {
  const { showContact, onNavigate } = { ...args, ...props }
  const graves = CEMETERIES.reduce((s, c) => s + c.graves, 0)
  const identified = CEMETERIES.reduce((s, c) => s + c.identified, 0)

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="about" onNavigate={onNavigate} />
      <PageHeader
        crumbs={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Giới thiệu' }]}
        title="Để không một ai bị lãng quên"
        lead="Cổng thông tin Tri ân Thư Lâm gìn giữ tên tuổi, phần mộ và câu chuyện của các anh hùng liệt sĩ, người có công cùng những địa chỉ đỏ của quê hương — mở cho mọi người dân và thân nhân tra cứu."
      />

      <Container className="py-16">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
          <div className="max-w-[60ch] text-[1.08rem] leading-[1.8] text-ink-soft">
            <h2 className="font-serif text-[2rem] leading-tight text-heritage-ink">Vì sao có cổng thông tin này</h2>
            <p className="mt-5">Nhiều thân nhân liệt sĩ đã cao tuổi hoặc sống xa quê. Việc tìm đúng phần mộ, biết thêm về người đã khuất thường phụ thuộc vào trí nhớ của một vài người trong làng.</p>
            <p className="mt-4">Cổng thông tin tập hợp những gì địa phương đang lưu giữ vào một nơi: danh sách liệt sĩ, sơ đồ phần mộ, hồ sơ người có công, tư liệu và các điểm di tích — để ai cũng có thể tìm, và để thế hệ sau tiếp tục bồi đắp.</p>
          </div>
          <ArchImage src={IMG.cemetery} alt="Hàng bia mộ tại Nghĩa trang Liệt sĩ Thụy Lâm" className="aspect-[4/5] w-full" />
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-y-10 border-y border-line py-10 md:grid-cols-[2fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <dt className="text-[0.95rem] text-ink-mute">Phần mộ liệt sĩ đã số hoá</dt>
            <dd className="mt-1 font-serif text-[3.5rem] leading-none text-heritage md:text-[4.5rem]">{graves.toLocaleString('vi-VN')}</dd>
            <dd className="mt-2 text-[0.95rem] text-ink-soft">{identified.toLocaleString('vi-VN')} phần mộ đã xác định được danh tính</dd>
          </div>
          <div>
            <dt className="text-[0.95rem] text-ink-mute">Nghĩa trang</dt>
            <dd className="mt-1 font-serif text-[2.4rem] leading-none text-heritage-ink">{CEMETERIES.length}</dd>
          </div>
          <div>
            <dt className="text-[0.95rem] text-ink-mute">Địa chỉ đỏ</dt>
            <dd className="mt-1 font-serif text-[2.4rem] leading-none text-heritage-ink">6</dd>
          </div>
        </dl>

        <section className="mt-20">
          <SectionTitle title="Chặng đường xây dựng" lead="Cổng thông tin được làm dần, theo từng phần dữ liệu đã được kiểm chứng." />
          <ol className="relative mt-10 border-l border-gold-soft pl-8 md:ml-2">
            {MILESTONES.map((m) => (
              <li key={m.when} className="relative pb-10 last:pb-0">
                <span className="absolute top-1.5 -left-[37px] h-3 w-3 rotate-45 border border-gold bg-paper" aria-hidden />
                <p className="font-serif text-[1.3rem] text-heritage">{m.when}</p>
                <p className="mt-1 max-w-[60ch] text-[1.02rem] leading-relaxed text-ink-soft">{m.what}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 grid gap-10 border-t border-line pt-14 md:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-serif text-[1.8rem] leading-tight text-heritage-ink">Về độ chính xác của dữ liệu</h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">Mọi thông tin đều ghi rõ nguồn và tình trạng xác minh. Khi phát hiện sai sót, thân nhân có thể gửi đính chính kèm giấy tờ — Ban biên tập phản hồi trong vòng 10 ngày làm việc.</p>
            <SampleNotice className="mt-6" />
          </div>
          {showContact && (
            <div className="rounded-md bg-ivory p-6 md:p-8">
              <h2 className="font-serif text-[1.5rem] text-heritage-ink">Ban quản lý cổng thông tin</h2>
              <ul className="mt-5 flex flex-col gap-4 text-[1rem]">
                <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> UBND xã Thư Lâm, TP. Hà Nội</li>
                <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> Đang cập nhật số điện thoại</li>
                <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> Đang cập nhật địa chỉ thư</li>
              </ul>
              <Button className="mt-7" onClick={() => onNavigate?.('library')}>Góp tư liệu <ArrowRight className="h-4 w-4" /></Button>
            </div>
          )}
        </section>
      </Container>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
