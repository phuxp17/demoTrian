import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ExternalLink, History, Undo2 } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Callout, Check, Chip, Field, Panel, Status, Tabs, Textarea } from '../../shared/admin/ui'
import { REVIEWS } from '../../shared/admin/data'
import { IMG } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  state: 'default',
  view: 'changes',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

const DIFF = [
  { field: 'Ảnh chân dung', before: null, after: 'portrait' },
  { field: 'Đơn vị', before: 'Trung đoàn 48', after: 'Trung đoàn 48, Sư đoàn 320' },
  { field: 'Nơi hy sinh', before: 'Quảng Trị', after: 'Thành cổ Quảng Trị' },
  { field: 'Ngày hy sinh', before: '1972', after: '02/09/1972' },
]

const VERSIONS = [
  { v: 'Bản đề xuất', at: '14/09/2025 09:20', by: 'Lê Văn Bình', note: 'Cập nhật ảnh chân dung, đơn vị', s: 'pending' as const },
  { v: 'Phiên bản 3', at: '02/03/2025 14:10', by: 'Phạm Quang Huy', note: 'Duyệt: sửa vị trí mộ theo sơ đồ mới', s: 'published' as const },
  { v: 'Phiên bản 2', at: '18/11/2024 08:30', by: 'Phạm Quang Huy', note: 'Duyệt: bổ sung cấp bậc', s: 'published' as const },
  { v: 'Phiên bản 1', at: '05/06/2024 10:02', by: 'Nhập Excel', note: 'Khởi tạo từ sổ quy tập 2015', s: 'published' as const },
]

const REASONS = ['Thiếu giấy tờ chứng minh', 'Ảnh chưa được gia đình đồng ý', 'Thông tin mâu thuẫn với sổ quy tập', 'Nghi trùng hồ sơ khác']

export default function ReviewDetail(props: Props) {
  const { state, view, onNavigate, recordId } = { ...args, ...props }
  const r = REVIEWS.find((x) => x.id === recordId) ?? REVIEWS[0]
  const [phase, setPhase] = useState(state)
  const [tab, setTab] = useState<'changes' | 'history'>(view as 'changes' | 'history')
  const [reasons, setReasons] = useState<string[]>([REASONS[1]])

  return (
    <AdminShell
      active="reviewDetail"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Kiểm duyệt' }, { label: 'Hàng chờ duyệt', page: 'reviews' }, { label: r.title }]}
      title={r.title}
      subtitle={
        <span className="inline-flex flex-wrap items-center gap-2">
          <Chip>{r.kind}</Chip> Gửi bởi <b className="font-medium text-ink">{r.by}</b> · {r.at}
        </span>
      }
      actions={<Btn icon={<ExternalLink className="size-4" />} onClick={() => onNavigate?.('soldierEdit', { id: 's1' })}>Mở hồ sơ</Btn>}
    >
      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <Tabs<'changes' | 'history'>
            className="mb-4"
            value={tab}
            onChange={setTab}
            tabs={[{ id: 'changes', label: 'Thay đổi đề xuất', count: DIFF.length }, { id: 'history', label: 'Lịch sử phiên bản', count: VERSIONS.length - 1 }]}
          />

          {tab === 'changes' ? (
            <Panel flush>
              <div className="hidden grid-cols-[160px_1fr_24px_1fr] gap-2.5 border-b border-line bg-canvas/60 px-5 py-2.5 text-xs font-medium text-ink-mute md:grid">
                <span>Trường</span><span>Đang công khai (v3)</span><span /><span>Đề xuất</span>
              </div>
              <ul className="divide-y divide-line">
                {DIFF.map((d) => (
                  <li key={d.field} className="grid gap-2 px-5 py-4 md:grid-cols-[160px_1fr_24px_1fr] md:items-start md:gap-2.5">
                    <span className="text-[13px] font-medium">{d.field}</span>
                    <div className="text-sm">
                      {d.before ? <span className="rounded bg-heritage-tint px-1.5 py-0.5 text-heritage-ink line-through decoration-heritage/40">{d.before}</span> : <span className="text-ink-mute">Chưa có</span>}
                    </div>
                    <ArrowRight className="hidden size-4 text-ink-mute md:block" />
                    <div className="text-sm">
                      {d.after === 'portrait' ? (
                        <div className="flex items-end gap-2.5">
                          <img src={IMG.portraitS1} alt="" className="h-28 w-22 rounded-md object-cover ring-2 ring-jade/40" />
                          <span className="text-xs text-ink-mute">JPG · 1,2 MB<br />Nguồn: gia đình cung cấp</span>
                        </div>
                      ) : (
                        <span className="rounded bg-jade-tint px-1.5 py-0.5 text-jade-deep">{d.after}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line px-5 py-3 text-[13px] text-ink-mute">
                Ghi chú của người gửi: “Gia đình cung cấp ảnh tại buổi gặp ngày 12/9, đối chiếu theo giấy báo tử bản gốc.”
              </div>
            </Panel>
          ) : (
            <Panel flush>
              <ol className="relative px-5 py-4">
                {VERSIONS.map((v, i) => (
                  <li key={v.v} className="relative flex gap-2.5 pb-5 last:pb-0">
                    {i < VERSIONS.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-line" />}
                    <span className={`relative mt-1.5 size-[11px] shrink-0 rounded-full border-2 ${i === 0 ? 'border-amber bg-amber-tint' : 'border-jade bg-surface'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{v.v}</p>
                        <Status s={v.s} label={i === 1 ? 'Đang công khai' : i > 1 ? 'Đã thay thế' : undefined} />
                      </div>
                      <p className="mt-0.5 text-[13px] text-ink-soft">{v.note}</p>
                      <p className="text-xs text-ink-mute">{v.by} · {v.at}</p>
                    </div>
                    {i > 1 && <Btn size="sm" variant="ghost" icon={<History className="size-3.5" />}>So sánh</Btn>}
                  </li>
                ))}
              </ol>
            </Panel>
          )}
        </div>

        <aside className="min-w-0 xl:sticky xl:top-0 xl:self-start">
          <AnimatePresence mode="wait" initial={false}>
            {phase === 'approved' ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
                <Panel>
                  <div className="flex flex-col items-start gap-2.5">
                    <CheckCircle2 className="size-6 text-jade" />
                    <div>
                      <p className="font-semibold">Đã duyệt, phiên bản 4 đang công khai</p>
                      <p className="mt-1 text-[13px] text-ink-soft">Lê Văn Bình đã nhận thông báo.</p>
                    </div>
                    <div className="flex gap-2">
                      <Btn size="sm" variant="primary" onClick={() => onNavigate?.('reviewDetail', { id: 'v2' })}>Mục tiếp theo</Btn>
                      <Btn size="sm" variant="ghost" icon={<Undo2 className="size-3.5" />} onClick={() => setPhase('default')}>Hoàn tác</Btn>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            ) : phase === 'returning' ? (
              <motion.div key="ret" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
                <Panel title="Trả sửa" description="Người gửi sẽ thấy lý do này trên hồ sơ">
                  <div className="space-y-2.5">
                    <div className="space-y-2">
                      {REASONS.map((x) => (
                        <Check key={x} label={x} checked={reasons.includes(x)} onChange={(v) => setReasons((s) => (v ? [...s, x] : s.filter((y) => y !== x)))} className="flex" />
                      ))}
                    </div>
                    <Field label="Hướng dẫn bổ sung" required>
                      <Textarea defaultValue="Cần bản scan văn bản đồng ý của gia đình cho phép đăng ảnh chân dung trên cổng." />
                    </Field>
                    <div className="flex justify-end gap-2">
                      <Btn variant="ghost" onClick={() => setPhase('default')}>Huỷ</Btn>
                      <Btn variant="primary" onClick={() => onNavigate?.('reviews')}>Gửi trả sửa</Btn>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            ) : (
              <motion.div key="dec" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
                <Panel title="Quyết định">
                  <div className="space-y-2.5">
                    <Callout tone="ok">Không phát hiện hồ sơ trùng. Vị trí mộ khớp sơ đồ Khu A.</Callout>
                    <Field label="Ghi chú duyệt" hint="Lưu vào lịch sử phiên bản">
                      <Textarea placeholder="Không bắt buộc" className="min-h-16" />
                    </Field>
                    <div className="grid gap-2">
                      <Btn variant="success" onClick={() => setPhase('approved')}>Duyệt & công khai</Btn>
                      <Btn variant="danger" onClick={() => setPhase('returning')}>Trả sửa kèm lý do</Btn>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </AdminShell>
  )
}
