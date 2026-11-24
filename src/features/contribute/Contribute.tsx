import React, { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Paperclip, X } from 'lucide-react'
import { Button } from '@/components/ui'

export type ContributeTopic = 'Góp tư liệu' | 'Đính chính thông tin' | 'Bổ sung thông tin'

type ButtonProps = React.ComponentProps<typeof Button>

/** A button that opens the contribution form. Owns its dialog, so any page can drop it in. */
export function ContributeButton({
  topic = 'Góp tư liệu',
  subject,
  children,
  asLink,
  className,
  ...rest
}: Omit<ButtonProps, 'onClick'> & { topic?: ContributeTopic; subject?: string; asLink?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {asLink ? (
        <button type="button" onClick={() => setOpen(true)} className={className ?? 'flex items-center gap-2 font-medium text-heritage underline underline-offset-4 hover:text-heritage-deep'}>
          {children}
        </button>
      ) : (
        <Button type="button" {...rest} className={className} onClick={() => setOpen(true)}>
          {children}
        </Button>
      )}
      <ContributeDialog open={open} onClose={() => setOpen(false)} topic={topic} subject={subject} />
    </>
  )
}

export function ContributeDialog({ open, onClose, topic, subject }: { open: boolean; onClose: () => void; topic: ContributeTopic; subject?: string }) {
  const reduce = useReducedMotion()
  const ids = useId()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [relation, setRelation] = useState('Thân nhân trong gia đình')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const [agree, setAgree] = useState(false)
  const [tried, setTried] = useState(false)
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    const t = setTimeout(() => {
      setTried(false)
      setCode(null)
    }, 250)
    return () => clearTimeout(t)
  }, [open])

  const errors = {
    name: !name.trim() ? 'Xin nhập họ tên người gửi.' : '',
    phone: !/^0\d{9,10}$/.test(phone.replace(/\s/g, '')) ? 'Số điện thoại gồm 10–11 chữ số, bắt đầu bằng 0.' : '',
    content: content.trim().length < 10 ? 'Xin mô tả ngắn gọn nội dung (ít nhất 10 ký tự).' : '',
    agree: !agree ? 'Cần đồng ý để Ban biên tập liên hệ đối chiếu.' : '',
  }
  const valid = Object.values(errors).every((e) => !e)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!valid) return
    setCode(`TL-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`)
  }

  const err = (k: keyof typeof errors) => (tried && errors[k] ? <span id={`${ids}-${k}`} className="text-[0.88rem] text-heritage">{errors[k]}</span> : null)
  const field = 'w-full rounded-md border bg-paper px-3.5 text-[1rem] text-ink placeholder:text-ink-mute focus:border-heritage focus:outline-none'
  const border = (k: keyof typeof errors) => (tried && errors[k] ? 'border-heritage' : 'border-line-strong')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#18100d]/75 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${ids}-title`}
            className="flex max-h-[92%] w-full max-w-xl flex-col overflow-hidden rounded-t-lg bg-paper sm:rounded-lg"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 pt-5 pb-4">
              <div className="min-w-0">
                <h2 id={`${ids}-title`} className="font-serif text-[1.6rem] leading-tight text-heritage-ink">{topic}</h2>
                {subject && <p className="mt-1 text-[0.95rem] text-ink-soft">Cho hồ sơ: <span className="font-medium text-ink">{subject}</span></p>}
              </div>
              <button onClick={onClose} aria-label="Đóng" className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-heritage-tint hover:text-heritage">
                <X className="h-5 w-5" />
              </button>
            </div>

            {code ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-jade" strokeWidth={1.5} />
                <p className="mt-4 font-serif text-[1.5rem] text-heritage-ink">Đã tiếp nhận, xin cảm ơn gia đình</p>
                <p className="mt-2 max-w-sm leading-relaxed text-ink-soft">Ban biên tập sẽ liên hệ qua số {phone} trong vòng 10 ngày làm việc để đối chiếu thông tin.</p>
                <p className="mt-6 rounded-md bg-gold-pale px-4 py-2 text-[0.95rem] text-heritage-ink">Mã tiếp nhận: <strong className="tracking-wide">{code}</strong></p>
                <Button className="mt-8" onClick={onClose}>Đóng</Button>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="flex flex-col gap-5 overflow-y-auto px-6 py-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[0.92rem] font-medium text-ink-soft">Họ tên người gửi</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} aria-invalid={tried && !!errors.name} aria-describedby={`${ids}-name`} className={`${field} ${border('name')} h-12`} />
                    {err('name')}
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[0.92rem] font-medium text-ink-soft">Số điện thoại</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="09xx xxx xxx" aria-invalid={tried && !!errors.phone} aria-describedby={`${ids}-phone`} className={`${field} ${border('phone')} h-12`} />
                    {err('phone')}
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.92rem] font-medium text-ink-soft">Quan hệ với người được nhắc đến</span>
                  <select value={relation} onChange={(e) => setRelation(e.target.value)} className={`${field} border-line-strong h-12`}>
                    {['Thân nhân trong gia đình', 'Đồng đội', 'Người cùng làng, xã', 'Cán bộ địa phương', 'Khác'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.92rem] font-medium text-ink-soft">{topic === 'Đính chính thông tin' ? 'Thông tin cần đính chính' : 'Nội dung'}</span>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder={topic === 'Đính chính thông tin' ? 'Ví dụ: năm sinh đúng là 1950, theo giấy báo tử gia đình đang lưu giữ.' : 'Mô tả ảnh, thư từ, kỷ vật hoặc câu chuyện gia đình muốn gửi.'}
                    aria-invalid={tried && !!errors.content}
                    aria-describedby={`${ids}-content`}
                    className={`${field} ${border('content')} py-3 leading-relaxed`}
                  />
                  {err('content')}
                </label>
                <div>
                  <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-dashed border-line-strong px-4 text-[0.95rem] text-ink-soft hover:border-heritage hover:text-heritage">
                    <Paperclip className="h-4 w-4" /> Đính kèm ảnh chụp, bản quét
                    <input type="file" multiple accept="image/*,.pdf" className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
                  </label>
                  {files.length > 0 && <p className="mt-2 text-[0.88rem] text-ink-mute">{files.join(', ')}</p>}
                </div>
                <label className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink-soft">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-heritage" />
                  <span>Tôi đồng ý để Ban biên tập liên hệ đối chiếu và ghi nguồn gia đình khi công bố. Bản gốc vẫn thuộc về gia đình.</span>
                </label>
                {err('agree')}
                <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
                  <Button type="button" variant="ghost" onClick={onClose}>Huỷ</Button>
                  <Button type="submit">Gửi cho Ban biên tập</Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
