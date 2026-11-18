import React from 'react'
import { Home, Upload } from 'lucide-react'
import { ContributeButton } from '../shared/components/Contribute'
import { PrintButton, ShareButton } from '../shared/components/Actions'
import { familyOf } from '../shared/links'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { Breadcrumb, Button, Container, Portrait, SampleNotice, Tag } from '../shared/components/ui'
import { OrnamentRule } from '../shared/components/Ornaments'
import { IMG, MERIT } from '../shared/data'
import type { Navigate } from '../shared/nav'

export const args = {
  personIndex: 0,
}

export const argTypes = {
  personIndex: { control: 'range', min: 0, max: 5, step: 1 },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate; recordId?: string }

export default function Biography(props: Props) {
  const { personIndex, onNavigate, recordId } = { ...args, ...props }
  const m = MERIT.find((x) => x.id === recordId) ?? MERIT[Math.min(Math.max(personIndex, 0), MERIT.length - 1)]
  const family = familyOf(m.name)

  const timeline = [
    { when: m.years.split(' – ')[0], what: `Sinh tại ${m.hometown}.` },
    { when: 'Đang xác minh', what: 'Các mốc tham gia kháng chiến, công tác tại địa phương — chờ đối chiếu hồ sơ lưu trữ.' },
    { when: 'Đang xác minh', what: `Được Nhà nước ghi nhận danh hiệu “${m.title}”. Số và ngày quyết định sẽ được cập nhật.` },
    { when: m.years.split(' – ')[1], what: 'Qua đời tại quê nhà.' },
  ]

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="biography" onNavigate={onNavigate} />

      <Container className="pt-8">
        <Breadcrumb items={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Người có công', onClick: () => onNavigate?.('merit') }, { label: m.name }]} />
      </Container>

      <Container className="grid gap-10 py-10 md:grid-cols-12 md:gap-10 lg:gap-16">
        <aside className="md:col-span-5 lg:col-span-4">
          <div className="md:sticky md:top-28">
            <Portrait name={m.name} className="mx-auto aspect-[3/4] w-44 sm:w-52 md:w-full" />
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {[
                ['Danh hiệu', m.title],
                ['Năm sinh – mất', m.years],
                ['Quê quán', m.hometown],
                ['Quyết định công nhận', 'Đang cập nhật'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3.5">
                  <dt className="text-[0.9rem] text-ink-mute">{k}</dt>
                  <dd className={`text-right ${v === 'Đang cập nhật' ? 'text-ink-mute italic' : ''}`}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex gap-2">
              <PrintButton className="flex-1" />
              <ShareButton className="flex-1" title={m.name} />
            </div>
          </div>
        </aside>

        <article className="min-w-0 md:col-span-7 lg:col-span-8">
          <Tag tone="red">{m.category}</Tag>
          <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.1] font-medium text-heritage-ink lg:text-[3.4rem]">
            {m.category === 'Bà mẹ Việt Nam Anh hùng' ? `Mẹ ${m.name}` : m.name}
          </h1>
          <p className="mt-3 text-[1.15rem] text-ink-soft">{m.years} · {m.hometown}</p>
          <OrnamentRule className="mt-8 text-gold" />

          <div className="mt-8 max-w-[68ch] space-y-5 text-[1.1rem] leading-[1.8] text-ink">
            <p className="font-serif text-[1.35rem] leading-relaxed text-ink-soft italic">
              Tiểu sử chi tiết đang được gia đình và Ban biên tập sưu tầm, đối chiếu với hồ sơ chính thức trước khi công bố.
            </p>
            <p>Trang này sẽ ghi lại cuộc đời, những đóng góp và kỷ niệm về {m.name} qua lời kể của thân nhân, đồng đội và tư liệu lưu trữ tại địa phương. Các thông tin chưa được xác minh sẽ không được đăng tải.</p>
          </div>

          <h2 className="mt-14 font-serif text-[1.8rem]">Các mốc cuộc đời</h2>
          <ol className="relative mt-8 border-l border-gold-soft pl-8">
            {timeline.map((t, i) => (
              <li key={i} className="relative pb-8 last:pb-0">
                <span className="absolute top-1.5 -left-[38px] h-3.5 w-3.5 rotate-45 border border-gold bg-paper" aria-hidden />
                <p className={`font-serif text-lg ${t.when === 'Đang xác minh' ? 'text-ink-mute italic' : 'text-heritage-ink'}`}>{t.when}</p>
                <p className="mt-1 leading-relaxed text-ink-soft">{t.what}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-14 font-serif text-[1.8rem]">Tư liệu gia đình</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <img src={IMG.home} alt="Ngôi nhà gia đình" className="aspect-[4/3] w-full rounded-sm object-cover" />
            <img src={IMG.letters} alt="Thư từ gia đình lưu giữ" className="aspect-[4/3] w-full rounded-sm object-cover" />
          </div>
          <SampleNotice className="mt-8" />

          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row">
            {family ? (
              <Button onClick={() => onNavigate?.('family', { id: family.id })}><Home className="h-4 w-4" /> Thông tin gia đình</Button>
            ) : (
              <Button onClick={() => onNavigate?.('families')}><Home className="h-4 w-4" /> Địa chỉ gia đình</Button>
            )}
            <ContributeButton variant="secondary" subject={m.name}><Upload className="h-4 w-4" /> Góp tư liệu</ContributeButton>
          </div>
        </article>
      </Container>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
