import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FileText, Image as ImageIcon, Mic, Play, Upload, X } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { PageHeader } from '../shared/components/PageHeader'
import { Button, Container, Tag } from '../shared/components/ui'
import { MEDIA, type MediaItem } from '../shared/data'
import type { Navigate } from '../shared/nav'
import { ContributeButton } from '../shared/components/Contribute'

export const args = {
  kind: 'Tất cả',
  openItem: false,
}

export const argTypes = {
  kind: { control: 'select', options: ['Tất cả', 'Ảnh', 'Video', 'Tài liệu', 'Ghi âm'] },
  openItem: { control: 'boolean' },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

const KINDS = ['Tất cả', 'Ảnh', 'Video', 'Tài liệu', 'Ghi âm'] as const

export default function Library(props: Props) {
  const { kind: initialKind, openItem, onNavigate } = { ...args, ...props }
  const [kind, setKind] = useState<string>(initialKind)
  const [open, setOpen] = useState<MediaItem | null>(openItem ? MEDIA[0] : null)
  const reduce = useReducedMotion()

  useEffect(() => setKind(initialKind), [initialKind])
  useEffect(() => setOpen(openItem ? MEDIA[0] : null), [openItem])

  const list = MEDIA.filter((m) => kind === 'Tất cả' || m.kind === kind)
  const count = (k: string) => (k === 'Tất cả' ? MEDIA.length : MEDIA.filter((m) => m.kind === k).length)

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="library" onNavigate={onNavigate} />
      <PageHeader
        crumbs={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Thư viện tư liệu' }]}
        title="Thư viện tư liệu"
        lead="Hình ảnh, thư từ, kỷ vật và lời kể được gia đình, nhà truyền thống và ban quản lý nghĩa trang gìn giữ — số hoá để thế hệ sau còn được nhìn thấy, được nghe kể."
      >
        <ContributeButton variant="secondary" topic="Góp tư liệu"><Upload className="h-4 w-4" /> Góp tư liệu của gia đình</ContributeButton>
      </PageHeader>

      <Container className="py-12">
        <div className="flex flex-col-reverse gap-2 border-b border-line md:flex-row md:items-end md:justify-between">
          <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0" role="tablist" aria-label="Loại tư liệu">
            {KINDS.map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={kind === k}
                onClick={() => setKind(k)}
                className={`relative h-11 shrink-0 px-4 text-[0.95rem] whitespace-nowrap transition-colors duration-150 ${kind === k ? 'font-semibold text-heritage' : 'text-ink-soft hover:text-heritage'}`}
              >
                {k} <span className="ml-1 text-[0.82rem] text-ink-mute">{count(k)}</span>
                {kind === k && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-heritage" />}
              </button>
            ))}
          </div>
          <p className="text-[0.9rem] text-ink-mute md:pb-3">Sắp xếp: mới số hoá trước</p>
        </div>

        {list.length > 0 ? (
          <ul className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {list.map((m, i) => (
              <li key={m.id} className="mb-8 break-inside-avoid">
                <button onClick={() => setOpen(m)} className="group block w-full text-left">
                  <div className="relative overflow-hidden rounded-sm bg-parchment">
                    <img
                      src={m.image}
                      alt=""
                      className={`w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] ${i % 3 === 0 ? 'aspect-[4/5]' : i % 3 === 1 ? 'aspect-[3/2]' : 'aspect-square'}`}
                    />
                    <KindBadge kind={m.kind} />
                  </div>
                  <h3 className="mt-3 font-serif text-[1.25rem] leading-snug group-hover:text-heritage">{m.title}</h3>
                </button>
                <p className="mt-1 text-[0.88rem] text-ink-mute">{m.source} · {m.year}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-16 text-center text-ink-soft">Chưa có tư liệu thuộc loại này.</p>
        )}

        <section className="mt-8 grid gap-6 border-t border-line pt-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2 className="font-serif text-[1.8rem] leading-tight text-heritage-ink">Gia đình còn giữ ảnh, thư hay kỷ vật?</h2>
            <p className="mt-2 max-w-[60ch] text-ink-soft">Ban biên tập tiếp nhận bản chụp hoặc bản quét, đối chiếu thông tin và ghi rõ nguồn gia đình khi công bố. Bản gốc vẫn thuộc về gia đình.</p>
          </div>
          <ContributeButton size="lg" topic="Góp tư liệu"><Upload className="h-4 w-4" /> Gửi tư liệu</ContributeButton>
        </section>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-heritage-ink/80 p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={open.title}
              className="grid max-h-full w-full max-w-5xl overflow-auto rounded-md bg-paper md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-ink">
                <img src={open.image} alt={open.title} className="h-full max-h-[70vh] w-full object-contain" />
                {open.kind === 'Video' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 text-heritage"><Play className="ml-1 h-7 w-7" /></span>
                  </span>
                )}
              </div>
              <div className="flex flex-col p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <Tag>{open.kind}</Tag>
                  <button onClick={() => setOpen(null)} aria-label="Đóng" className="-mt-2 -mr-2 flex h-11 w-11 items-center justify-center rounded-md text-ink-soft hover:bg-heritage-tint hover:text-heritage">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <h2 className="mt-3 font-serif text-[1.7rem] leading-snug text-heritage-ink">{open.title}</h2>
                <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-line pt-5 text-[0.95rem]">
                  <dt className="text-ink-mute">Nguồn</dt><dd>{open.source}</dd>
                  <dt className="text-ink-mute">Năm</dt><dd>{open.year}</dd>
                  <dt className="text-ink-mute">Tình trạng</dt><dd>Đang đối chiếu thông tin</dd>
                </dl>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-soft">Mô tả chi tiết và nhân vật liên quan sẽ được bổ sung sau khi Ban biên tập làm việc với gia đình và đơn vị lưu giữ.</p>
                <div className="mt-auto pt-8">
                  <Button variant="secondary" className="w-full" onClick={() => setOpen(null)}>Quay lại thư viện</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

function KindBadge({ kind }: { kind: MediaItem['kind'] }) {
  const Icon = kind === 'Video' ? Play : kind === 'Tài liệu' ? FileText : kind === 'Ghi âm' ? Mic : ImageIcon
  if (kind === 'Ảnh') return null
  return (
    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-paper/95 px-2 py-1 text-[0.8rem] font-medium text-heritage-ink">
      <Icon className="h-3.5 w-3.5" /> {kind}
    </span>
  )
}
