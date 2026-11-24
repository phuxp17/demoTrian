import React from 'react'
import { LineArt } from '@/components/ornaments'
import { Container } from '@/components/ui'
import { IMG, LINE_ART } from '@/data/portal.mock'
import { ContributeButton } from '@/features/contribute'

export function ContributeSection({ soft }: { soft: boolean }) {
  return (
    <section className="paper-grain relative overflow-hidden py-16 md:py-20">
      <LineArt src={LINE_ART.gate} className="absolute right-0 bottom-0 hidden w-80 opacity-30 lg:block" />
      <Container className="relative grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className={`portal-gilt-card overflow-hidden p-2 md:col-span-5 ${soft ? 'rounded-[16px]' : 'rounded-xl'}`}>
          <img src={IMG.letters} alt="Thư từ và ảnh cũ được gia đình lưu giữ" className={`portal-photo aspect-[16/10] w-full object-cover ${soft ? 'rounded-[11px]' : 'rounded-lg'}`} />
        </div>
        <div className="md:col-span-7 lg:col-span-6">
          <h2 className="font-serif text-[1.8rem] leading-tight font-semibold text-balance text-heritage-ink sm:text-[2.2rem] md:text-[2.5rem]">Gia đình còn lưu giữ ảnh, thư từ hay kỷ vật?</h2>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ink-soft">
            Hãy cùng chia sẻ, đóng góp tư liệu để làm giàu thêm kho lưu trữ tri ân. Ban quản lý sẽ liên hệ để số hoá và hoàn trả nguyên vẹn bản gốc cho gia đình.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ContributeButton size="lg">Góp tư liệu</ContributeButton>
            <ContributeButton size="lg" variant="secondary" topic="Đính chính thông tin">Đính chính thông tin</ContributeButton>
          </div>
        </div>
      </Container>
    </section>
  )
}
