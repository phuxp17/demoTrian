import React, { useState } from 'react'
import {
  AlignLeft, Bold, Check, Clock, FileText, Heading2, ImagePlus, Italic, Link2, List, ListOrdered, Paperclip, Quote, Redo2, Undo2, UserRound, X,
} from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Callout, Chip, Field, FormFooter, Input, Panel, Select, Status, Textarea, Toggle } from '../../shared/admin/ui'
import { ARTICLES } from '../../shared/admin/data'
import { IMG, MEDIA } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  state: 'draft',
  mode: 'edit',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

export default function ArticleEditor(props: Props) {
  const { state, mode, onNavigate, recordId } = { ...args, ...props }
  const isNew = mode === 'new' || recordId === 'new'
  const a = ARTICLES.find((x) => x.id === recordId) ?? ARTICLES[6]
  const [phase, setPhase] = useState(state)
  const [schedule, setSchedule] = useState(false)
  const statusKey = phase === 'submitted' ? 'pending' : phase === 'returned' ? 'returned' : 'draft'

  return (
    <AdminShell
      active="articleEdit"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Nội dung' }, { label: 'Bài viết', page: 'articles' }, { label: isNew ? 'Bài mới' : 'Biên tập' }]}
      title={isNew ? 'Bài viết mới' : 'Biên tập bài viết'}
      subtitle={<span className="inline-flex items-center gap-2"><Status s={statusKey} /> {isNew ? 'Chưa lưu' : `Lưu tự động lúc 10:48 · phiên bản 3`}</span>}
      actions={<Btn icon={<FileText className="size-4" />}>Xem trước</Btn>}
    >
      {phase === 'returned' && (
        <Callout tone="danger" title="Phạm Quang Huy trả sửa · 17/09/2025 09:20">
          Cần ghi rõ nguồn trích dẫn các lá thư và xin phép gia đình trước khi đăng ảnh chân dung. Bổ sung văn bản đồng ý vào mục Tư liệu đính kèm.
        </Callout>
      )}
      {phase === 'submitted' && (
        <Callout tone="ok" title="Đã gửi duyệt">
          Bài viết đang chờ Lãnh đạo phê duyệt. Bạn vẫn có thể rút lại để sửa tiếp.
        </Callout>
      )}

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-2.5">
          <section className="rounded-lg border border-line bg-surface">
            <div className="px-5 pt-5 sm:px-8 sm:pt-7">
              <textarea
                rows={2}
                defaultValue={isNew ? '' : a.title}
                placeholder="Tiêu đề bài viết"
                className="w-full resize-none border-0 bg-transparent font-serif text-2xl font-semibold leading-snug text-ink placeholder:text-ink-mute/60 focus:outline-none sm:text-[28px]"
              />
              <textarea
                rows={2}
                defaultValue={isNew ? '' : 'Những lá thư gửi về từ Thành cổ năm 1972 là phần ký ức còn lại của gia đình liệt sĩ Nguyễn Văn Thành, nay được gia đình đồng ý chia sẻ.'}
                placeholder="Sa-pô: một đến hai câu tóm tắt"
                className="mt-2 w-full resize-none border-0 bg-transparent text-[15px] leading-relaxed text-ink-soft placeholder:text-ink-mute/60 focus:outline-none"
              />
            </div>

            <div className="sticky top-0 z-10 mt-3 flex flex-wrap items-center gap-0.5 border-y border-line bg-surface/95 px-3 py-1.5 backdrop-blur sm:px-6">
              {[Undo2, Redo2].map((I, i) => <ToolBtn key={i} I={I} />)}
              <Sep />
              <button className="flex h-8 items-center gap-1 rounded px-2 text-[13px] text-ink-soft hover:bg-canvas"><AlignLeft className="size-4" /> Đoạn văn</button>
              <Sep />
              {[Bold, Italic, Heading2, Quote, List, ListOrdered, Link2].map((I, i) => <ToolBtn key={i} I={I} />)}
              <Sep />
              <button className="flex h-8 items-center gap-1.5 rounded px-2 text-[13px] text-ink-soft hover:bg-canvas"><ImagePlus className="size-4" /> Ảnh</button>
              <button className="flex h-8 items-center gap-1.5 rounded px-2 text-[13px] text-ink-soft hover:bg-canvas"><Paperclip className="size-4" /> Tư liệu</button>
              <button className="flex h-8 items-center gap-1.5 rounded px-2 text-[13px] text-ink-soft hover:bg-canvas"><UserRound className="size-4" /> Gắn hồ sơ</button>
            </div>

            {isNew ? (
              <p className="min-h-80 px-5 py-6 text-[15px] text-ink-mute/70 sm:px-8">Bắt đầu viết nội dung…</p>
            ) : (
              <article className="mx-auto max-w-[68ch] space-y-2.5 px-5 py-6 text-[15px] leading-[1.75] text-ink sm:px-8">
                <p>
                  Mùa hè năm 1972, Hạ sĩ <mark className="rounded bg-gold-pale/70 px-0.5 text-ink">Nguyễn Văn Thành</mark> cùng đồng đội Trung đoàn 48 vượt sông Thạch Hãn vào Thành cổ Quảng Trị. Trong 81 ngày đêm, anh gửi về thôn Thụy Lôi bốn lá thư — lá cuối cùng đề ngày 2 tháng 9.
                </p>
                <h2 className="pt-2 font-serif text-xl font-semibold">“Mẹ đừng lo cho con”</h2>
                <p>Lá thư được viết bằng bút chì trên giấy học trò, gấp làm tư. Chị gái anh, bà Nguyễn Thị Hảo, giữ nó suốt hơn năm mươi năm trong chiếc hộp gỗ thờ.</p>
                <figure className="my-2">
                  <img src={IMG.letters} alt="" className="aspect-[16/9] w-full rounded-md object-cover" />
                  <figcaption className="mt-2 text-[13px] text-ink-mute">Thư liệt sĩ Nguyễn Văn Thành gửi gia đình, 1972. Nguồn: gia đình hiến tặng.</figcaption>
                </figure>
                <blockquote className="border-l-2 border-gold pl-4 font-serif italic text-ink-soft">
                  Ở đây anh em đùm bọc nhau như ruột thịt. Con chỉ mong ngày về được thắp nén hương cho bố.
                </blockquote>
                <p>Năm 2015, hài cốt của anh được quy tập về Nghĩa trang Liệt sĩ Thụy Lâm, an táng tại Khu A, hàng 2, mộ số 7.</p>
              </article>
            )}
            <div className="flex items-center justify-between border-t border-line px-5 py-2 text-xs text-ink-mute sm:px-8">
              <span>{isNew ? '0 từ' : '612 từ · khoảng 3 phút đọc'}</span>
              <span>Tiếng Việt</span>
            </div>
          </section>

          <Panel title="Tư liệu đính kèm" description="Hiển thị cuối bài, người đọc có thể xem hoặc tải về" action={<Btn size="sm" icon={<Paperclip className="size-3.5" />}>Đính kèm</Btn>}>
            {isNew ? (
              <p className="text-[13px] text-ink-mute">Chưa có tư liệu.</p>
            ) : (
              <ul className="divide-y divide-line">
                {[MEDIA[1], MEDIA[5]].map((m) => (
                  <li key={m.id} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                    <img src={m.image} alt="" className="size-10 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-ink-mute">{m.kind} · {m.source}</p>
                    </div>
                    <button aria-label="Gỡ" className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-heritage"><X className="size-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <aside className="min-w-0 space-y-2.5 xl:sticky xl:top-2.5 xl:self-start">
          <Panel title="Xuất bản">
            <div className="space-y-2.5">
              <Toggle on={schedule} onChange={setSchedule} label="Hẹn giờ đăng" description="Bài sẽ tự đăng sau khi được duyệt" />
              {schedule && (
                <div className="grid grid-cols-2 gap-2">
                  <Input defaultValue="20/09/2025" className="tabular-nums" />
                  <Input defaultValue="07:00" className="tabular-nums" />
                </div>
              )}
              <dl className="space-y-1.5 border-t border-line pt-3 text-[13px]">
                <div className="flex justify-between gap-2"><dt className="text-ink-mute">Tác giả</dt><dd>{a.author}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink-mute">Người duyệt</dt><dd>Phạm Quang Huy</dd></div>
              </dl>
            </div>
          </Panel>

          <Panel title="Phân loại">
            <div className="space-y-2.5">
              <Field label="Chuyên mục" required><Select options={['Câu chuyện', 'Hoạt động', 'Sự kiện', 'Thông báo', 'Hướng dẫn']} value={isNew ? undefined : a.category} /></Field>
              <Field label="Hồ sơ liên quan" hint="Bài viết sẽ hiện trên trang hồ sơ này">
                <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-line-strong px-2 py-1.5">
                  {!isNew && <Chip className="gap-1 bg-heritage-tint text-heritage-ink">Liệt sĩ Nguyễn Văn Thành <X className="size-3" /></Chip>}
                  <input placeholder="Tìm hồ sơ…" className="min-w-20 flex-1 bg-transparent text-sm focus:outline-none" />
                </div>
              </Field>
            </div>
          </Panel>

          <Panel title="Ảnh đại diện">
            {isNew ? (
              <button className="grid aspect-[16/9] w-full place-items-center rounded-md border border-dashed border-line-strong text-[13px] text-ink-mute hover:bg-canvas">
                <span className="flex flex-col items-center gap-1"><ImagePlus className="size-5" /> Chọn từ thư viện</span>
              </button>
            ) : (
              <div>
                <img src={IMG.letters} alt="" className="aspect-[16/9] w-full rounded-md object-cover" />
                <div className="mt-2 flex gap-2"><Btn size="sm">Đổi ảnh</Btn><Btn size="sm" variant="ghost">Gỡ</Btn></div>
              </div>
            )}
          </Panel>

          <Panel title="Mô tả chia sẻ">
            <Field label="Mô tả ngắn" hint="Hiện khi chia sẻ lên mạng xã hội · 148/160 ký tự">
              <Textarea defaultValue={isNew ? '' : 'Bốn lá thư từ Thành cổ Quảng Trị năm 1972 của liệt sĩ Nguyễn Văn Thành, người con thôn Thụy Lôi, xã Thư Lâm.'} className="min-h-20" />
            </Field>
          </Panel>
        </aside>
      </div>

      <FormFooter note={<span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-jade" /> Đã lưu nháp lúc 10:48</span>}>
        <Btn variant="ghost" onClick={() => onNavigate?.('articles')}>Đóng</Btn>
        {phase === 'submitted' ? (
          <Btn onClick={() => setPhase('draft')}>Rút lại để sửa</Btn>
        ) : (
          <>
            <Btn>Lưu nháp</Btn>
            <Btn variant="primary" icon={schedule ? <Clock className="size-4" /> : undefined} onClick={() => setPhase('submitted')}>
              {phase === 'returned' ? 'Gửi duyệt lại' : 'Gửi duyệt'}
            </Btn>
          </>
        )}
      </FormFooter>
    </AdminShell>
  )
}

function ToolBtn({ I }: { I: React.ComponentType<{ className?: string }> }) {
  return (
    <button className="grid size-8 place-items-center rounded text-ink-soft hover:bg-canvas hover:text-ink">
      <I className="size-4" />
    </button>
  )
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-line" />
}
