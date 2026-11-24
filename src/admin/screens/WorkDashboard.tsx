import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, Clock, FilePlus2, FileText, ImagePlus, Map, Upload, UserPlus } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Chip, Panel, Status, Tabs } from '../../shared/admin/ui'
import { LOGS, REVIEWS } from '../../shared/admin/data'
import type { AdminNavigate, AdminPage } from '../../shared/admin/nav'

const args = {
  state: 'default',
  userName: 'Trần Thu Hà',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }
type Tab = 'pending' | 'returned' | 'drafts'

export default function WorkDashboard(props: Props) {
  const { state, userName, onNavigate } = { ...args, ...props }
  const [tab, setTab] = useState<Tab>('pending')
  const empty = state === 'empty'
  const pending = empty ? [] : REVIEWS.filter((r) => r.status === 'pending')
  const returned = empty ? [] : REVIEWS.filter((r) => r.status === 'returned')
  const drafts = empty
    ? []
    : [
        { id: 'd1', title: 'Ký ức Thành cổ qua những lá thư…', kind: 'Bài viết', change: 'Sửa lần cuối 17/09 10:05', page: 'articleEdit' as AdminPage },
        { id: 'd2', title: 'Liệt sĩ Trần Văn Kiên', kind: 'Liệt sĩ', change: 'Thiếu ảnh, thiếu mã mộ', page: 'soldierEdit' as AdminPage },
      ]
  const rows = tab === 'pending' ? pending : tab === 'returned' ? returned : drafts
  const overdue = pending.filter((r) => r.waitDays >= 3).length

  return (
    <AdminShell
      active="work"
      onNavigate={onNavigate}
      title={`Chào ${userName.split(' ').pop()}, hôm nay có ${pending.length + returned.length} việc cần xử lý`}
      subtitle={empty ? 'Không còn hồ sơ tồn đọng.' : <>Trong đó <b className="font-medium text-heritage">{overdue} hồ sơ</b> đã chờ quá 3 ngày — hạn xử lý theo quy chế là 5 ngày làm việc.</>}
      actions={
        <Btn variant="primary" icon={<FilePlus2 className="size-4" />} onClick={() => onNavigate?.('soldierEdit', { id: 'new' })}>
          Thêm hồ sơ
        </Btn>
      }
    >
      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel flush>
          <Tabs<Tab>
            className="px-3"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'pending', label: 'Chờ duyệt', count: pending.length },
              { id: 'returned', label: 'Cần bổ sung', count: returned.length },
              { id: 'drafts', label: 'Nháp của tôi', count: drafts.length },
            ]}
          />
          {rows.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <CheckCircle2 className="size-8 text-jade" />
              <p className="mt-3 font-medium">Đã xử lý hết</p>
              <p className="mt-1 max-w-xs text-sm text-ink-mute">Hồ sơ mới gửi duyệt sẽ xuất hiện ở đây. Bạn sẽ nhận thông báo khi có.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {rows.map((r) => {
                const wait = 'waitDays' in r ? r.waitDays : 0
                const target: AdminPage = 'page' in r ? r.page : 'reviewDetail'
                const open = () => onNavigate?.(target, 'page' in r ? undefined : { id: r.id })
                return (
                  <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:px-5">
                    <div className="min-w-0 flex-1 basis-64">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip>{r.kind}</Chip>
                        <button onClick={open} className="truncate text-left font-medium hover:text-heritage">
                          {r.title}
                        </button>
                      </div>
                      <p className="mt-1 truncate text-[13px] text-ink-mute">
                        {r.change}
                        {'by' in r && <> · gửi bởi {r.by}</>}
                      </p>
                    </div>
                    {'waitDays' in r && (
                      <span className={`inline-flex items-center gap-1 text-[13px] tabular-nums ${wait >= 3 ? 'font-medium text-heritage' : 'text-ink-mute'}`}>
                        <Clock className="size-3.5" />
                        {wait} ngày
                      </span>
                    )}
                    <Btn size="sm" variant={tab === 'pending' ? 'primary' : 'secondary'} onClick={open}>
                      {tab === 'pending' ? 'Xem & duyệt' : tab === 'returned' ? 'Bổ sung' : 'Tiếp tục'}
                    </Btn>
                  </li>
                )
              })}
            </ul>
          )}
          {rows.length > 0 && (
            <button onClick={() => onNavigate?.('reviews')} className="flex w-full items-center justify-center gap-1.5 border-t border-line py-2.5 text-[13px] font-medium text-heritage hover:bg-canvas">
              Mở hàng chờ đầy đủ <ArrowRight className="size-3.5" />
            </button>
          )}
        </Panel>

        <div className="space-y-2.5">
          <Panel title="Lối tắt">
            <div className="grid grid-cols-2 gap-2">
              {SHORTCUTS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => onNavigate?.(s.page, s.params)}
                  className="flex flex-col items-start gap-2 rounded-md border border-line p-3 text-left text-[13px] font-medium transition-colors duration-150 hover:border-gold hover:bg-paper"
                >
                  <s.icon className="size-4 text-heritage" />
                  {s.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Hồ sơ còn thiếu" description="Ảnh hưởng tới độ đầy đủ khi công khai">
            <ul className="space-y-2.5 text-sm">
              {GAPS.map((g) => (
                <li key={g.label}>
                  <div className="flex justify-between">
                    <span>{g.label}</span>
                    <span className="tabular-nums text-ink-mute">{empty ? 0 : g.n}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-canvas">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${empty ? 0 : (g.n / 120) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Hoạt động gần đây" action={<button onClick={() => onNavigate?.('logs')} className="text-[13px] text-heritage hover:underline">Nhật ký</button>}>
            <ol className="space-y-2.5">
              {LOGS.slice(0, 4).map((l) => (
                <li key={l.id} className="text-[13px] leading-snug">
                  <p>
                    <span className="font-medium">{l.user}</span> <span className="text-ink-mute">{l.action.toLowerCase()}</span> {l.target}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-mute">{l.at}</p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </AdminShell>
  )
}

const SHORTCUTS: { label: string; page: AdminPage; params?: { id: string }; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Thêm liệt sĩ', page: 'soldierEdit', params: { id: 'new' }, icon: UserPlus },
  { label: 'Nhập từ Excel', page: 'import', icon: Upload },
  { label: 'Viết bài', page: 'articleEdit', params: { id: 'new' }, icon: FileText },
  { label: 'Tải ảnh lên', page: 'media', icon: ImagePlus },
  { label: 'Gán mộ trên sơ đồ', page: 'mapEditor', icon: Map },
  { label: 'Thêm người có công', page: 'meritEdit', params: { id: 'new' }, icon: UserPlus },
]

const GAPS = [
  { label: 'Thiếu ảnh chân dung', n: 112 },
  { label: 'Chưa gán vị trí mộ', n: 38 },
  { label: 'Chưa xác minh quê quán', n: 21 },
]
