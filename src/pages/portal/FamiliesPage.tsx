import React, { useState } from 'react'
import { MapPin, Users } from 'lucide-react'
import { PageHeader, SiteFooter, SiteHeader } from '@/components/layout'
import { MemorialMap } from '@/features/memorial-map'
import { Button, Container, SelectField, Tag } from '@/components/ui'
import { FAMILIES, MAP_POINTS } from '@/data/portal.mock'
import type { Navigate } from '@/config/portalNav'

export const args = {
  kind: 'Tất cả',
}

export const argTypes = {
  kind: { control: 'select', options: ['Tất cả', 'Gia đình liệt sĩ', 'Gia đình có công với cách mạng', 'Gia đình Bà mẹ Việt Nam Anh hùng', 'Gia đình thương binh, bệnh binh'] },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

export default function Families(props: Props) {
  const { kind: initialKind, onNavigate } = { ...args, ...props }
  const [kind, setKind] = useState(initialKind)
  const [village, setVillage] = useState('Tất cả thôn')
  const [sel, setSel] = useState<string | null>(null)
  const list = FAMILIES.filter((f) => (kind === 'Tất cả' || f.kind === kind) && (village === 'Tất cả thôn' || f.address.startsWith(village)))

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="families" onNavigate={onNavigate} />
      <PageHeader
        crumbs={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Người có công', onClick: () => onNavigate?.('merit') }, { label: 'Địa chỉ gia đình' }]}
        title="Địa chỉ gia đình chính sách"
        lead="Danh sách các gia đình liệt sĩ, gia đình có công trên địa bàn — để cộng đồng, đoàn thể và học sinh có thể đến thăm hỏi, tri ân. Địa chỉ chỉ hiển thị đến cấp thôn để tôn trọng sự riêng tư của gia đình."
      >
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          <SelectField label="Diện gia đình" value={kind} onChange={setKind} options={['Tất cả', 'Gia đình liệt sĩ', 'Gia đình có công với cách mạng', 'Gia đình Bà mẹ Việt Nam Anh hùng', 'Gia đình thương binh, bệnh binh']} />
          <SelectField label="Thôn" value={village} onChange={setVillage} options={['Tất cả thôn', 'Thôn Thụy Lôi', 'Thôn Hà Lâm', 'Thôn Đào Thục', 'Thôn Biểu Khê', 'Thôn Cổ Miếu']} />
        </div>
      </PageHeader>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
        <section className="min-w-0" aria-live="polite">
          <p className="border-b border-line pb-4 text-ink-soft"><strong className="text-ink">{list.length}</strong> gia đình</p>
          <ul className="divide-y divide-line">
            {list.map((f) => (
              <li key={f.id} onMouseEnter={() => setSel(f.id)} className={`flex ${sel === f.id ? 'bg-heritage-tint/40' : ''}`}>
                <div className="flex w-full flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Tag tone={f.kind === 'Gia đình liệt sĩ' ? 'red' : f.kind.includes('Bà mẹ') ? 'gold' : 'jade'}>{f.kind}</Tag>
                  <button onClick={() => onNavigate?.('family', { id: f.id })} className="mt-2 block text-left font-serif text-[1.4rem] leading-snug hover:text-heritage">{f.head}</button>
                  <p className="mt-1 text-ink-soft">Thân nhân của <span className="text-ink">{f.honoured}</span></p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.92rem] text-ink-mute">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gold" />{f.address}</span>
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-gold" />{f.members} người được ghi nhận</span>
                  </p>
                </div>
                <Button variant="secondary" className="self-start sm:self-center" onClick={() => onNavigate?.('family', { id: f.id })}>Xem chi tiết</Button>
                </div>
              </li>
            ))}
          </ul>
          {list.length === 0 && <p className="py-14 text-center text-ink-soft">Không có gia đình nào khớp với bộ lọc đã chọn.</p>}
        </section>
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <MemorialMap points={MAP_POINTS.filter((p) => p.kind === 'family')} selectedId={sel} onSelect={setSel} className="aspect-[4/5] rounded-md border border-line-strong" />
            <p className="mt-3 text-[0.88rem] text-ink-mute">Vị trí hiển thị gần đúng theo thôn.</p>
          </div>
        </aside>
      </Container>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
