import React, { useState } from 'react'
import { ChevronRight, Download } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Filter, Initials, Input, Pager, Panel, SearchBox } from '@/modules/admin/components'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  query: '',
  user: 'Tất cả',
  action: 'Tất cả',
  expanded: 'L-20418',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

type Act = 'Sửa' | 'Tạo' | 'Duyệt' | 'Trả sửa' | 'Ẩn' | 'Xuất' | 'Đăng nhập' | 'Nhập'
type Log = { id: string; at: string; day: string; user: string; role: string; act: Act; target: string; ref?: string; ip: string; diff?: { f: string; from: string; to: string }[]; note?: string }

const LOGS: Log[] = [
  { id: 'L-20418', day: 'Hôm nay, 18/11/2026', at: '14:52', user: 'Trần Văn Quang', role: 'Biên tập viên', act: 'Sửa', target: 'Hồ sơ liệt sĩ Nguyễn Văn Đông', ref: 'LS-0231', ip: '10.12.4.21',
    diff: [{ f: 'Vị trí mộ', from: 'Khu B · Hàng 5 · Mộ 03', to: 'Khu B · Hàng 5 · Mộ 01' }, { f: 'Đơn vị', from: 'E48', to: 'E48, F320' }, { f: 'Ảnh chân dung', from: '—', to: 'chan-dung-dong.jpg' }] },
  { id: 'L-20417', day: 'Hôm nay, 18/11/2026', at: '14:31', user: 'Nguyễn Thị Hằng', role: 'Kiểm duyệt', act: 'Duyệt', target: 'Bài viết “Mẹ Việt Nam anh hùng Nguyễn Thị Lựu”', ref: 'BV-0088', ip: '10.12.4.8' },
  { id: 'L-20416', day: 'Hôm nay, 18/11/2026', at: '11:05', user: 'Nguyễn Thị Hằng', role: 'Kiểm duyệt', act: 'Trả sửa', target: 'Hồ sơ người có công Phạm Văn Kỳ', ref: 'NCC-0412', ip: '10.12.4.8', note: 'Thiếu quyết định công nhận thương binh, đề nghị bổ sung bản scan.' },
  { id: 'L-20415', day: 'Hôm nay, 18/11/2026', at: '09:47', user: 'Lê Minh Đức', role: 'Cán bộ thôn', act: 'Nhập', target: '44 hồ sơ liệt sĩ từ lietsi_vanha_dot3.xlsx', ip: '10.12.6.40', note: '3 dòng lỗi, 1 dòng trùng đã bỏ qua.' },
  { id: 'L-20414', day: 'Hôm nay, 18/11/2026', at: '08:02', user: 'Phạm Thu Trang', role: 'Quản trị', act: 'Đăng nhập', target: 'Đăng nhập thành công', ip: '113.190.22.7' },
  { id: 'L-20409', day: 'Hôm qua, 17/11/2026', at: '16:40', user: 'Trần Văn Quang', role: 'Biên tập viên', act: 'Ẩn', target: 'Hồ sơ liệt sĩ Ngô Văn Sinh (bản trùng)', ref: 'LS-0389', ip: '10.12.4.21', note: 'Trùng với LS-0014, đã gộp tư liệu.' },
  { id: 'L-20406', day: 'Hôm qua, 17/11/2026', at: '15:12', user: 'Phạm Thu Trang', role: 'Quản trị', act: 'Sửa', target: 'Tài khoản Lê Minh Đức', ref: 'TK-019', ip: '113.190.22.7',
    diff: [{ f: 'Phạm vi phụ trách', from: 'Thôn Vân Hà', to: 'Thôn Vân Hà, Thôn Liên Hà' }] },
  { id: 'L-20401', day: 'Hôm qua, 17/11/2026', at: '10:26', user: 'Nguyễn Thị Hằng', role: 'Kiểm duyệt', act: 'Xuất', target: 'Liệt sĩ & phần mộ · toàn xã · 3.471 dòng (.xlsx)', ip: '10.12.4.8', note: 'Lý do: Báo cáo Phòng LĐ-TB&XH quý IV.' },
  { id: 'L-20398', day: 'Hôm qua, 17/11/2026', at: '09:15', user: 'Lê Minh Đức', role: 'Cán bộ thôn', act: 'Tạo', target: 'Địa chỉ gia đình ông Nguyễn Văn Tấn', ref: 'GD-0207', ip: '10.12.6.40' },
]

const ACT_CLS: Record<Act, string> = {
  'Sửa': 'text-sky-ink', 'Tạo': 'text-jade-deep', 'Nhập': 'text-jade-deep', 'Duyệt': 'text-jade-deep',
  'Trả sửa': 'text-heritage-ink', 'Ẩn': 'text-heritage-ink', 'Xuất': 'text-amber-ink', 'Đăng nhập': 'text-ink-mute',
}

export default function ActivityLog(props: Props) {
  const { query, user, action, expanded, onNavigate } = { ...args, ...props }
  const [q, setQ] = useState(query)
  const [u, setU] = useState(user)
  const [a, setA] = useState(action)
  const [open, setOpen] = useState<string | null>(expanded || null)

  const rows = LOGS.filter(
    (l) =>
      (u === 'Tất cả' || l.user === u) &&
      (a === 'Tất cả' || l.act === a) &&
      (!q || `${l.target} ${l.ref ?? ''}`.toLowerCase().includes(q.toLowerCase())),
  )
  const days = Array.from(new Set(rows.map((r) => r.day)))

  return (
    <AdminShell
      active="logs"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Dữ liệu' }, { label: 'Nhật ký hoạt động' }]}
      title="Nhật ký hoạt động"
      subtitle="Lưu 24 tháng, không chỉnh sửa hay xóa được"
      actions={<Btn icon={<Download className="size-4" />}>Xuất nhật ký</Btn>}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBox className="w-full sm:w-72" value={q} onChange={setQ} placeholder="Tìm theo hồ sơ hoặc mã (LS-0231)" />
        <Filter label="Người dùng" value={u} onChange={setU} options={['Tất cả', 'Nguyễn Thị Hằng', 'Trần Văn Quang', 'Lê Minh Đức', 'Phạm Thu Trang']} />
        <Filter label="Thao tác" value={a} onChange={setA} options={['Tất cả', 'Sửa', 'Tạo', 'Nhập', 'Duyệt', 'Trả sửa', 'Ẩn', 'Xuất', 'Đăng nhập']} />
        <span className="flex items-center gap-1.5">
          <Input type="date" defaultValue="2026-11-01" className="w-36" aria-label="Từ ngày" />
          <span className="text-ink-mute">–</span>
          <Input type="date" defaultValue="2026-11-18" className="w-36" aria-label="Đến ngày" />
        </span>
      </div>

      <Panel flush>
        {days.length === 0 && <p className="px-5 py-12 text-center text-sm text-ink-mute">Không có hoạt động nào khớp bộ lọc.</p>}
        {days.map((d) => (
          <section key={d}>
            <h3 className="sticky top-0 z-[1] border-b border-line bg-canvas/80 px-4 py-2 text-xs font-medium text-ink-mute backdrop-blur sm:px-5">{d}</h3>
            <ul className="divide-y divide-line">
              {rows.filter((r) => r.day === d).map((l) => {
                const canOpen = !!(l.diff || l.note)
                const isOpen = open === l.id
                return (
                  <li key={l.id}>
                    <button
                      disabled={!canOpen}
                      onClick={() => setOpen(isOpen ? null : l.id)}
                      className="grid w-full grid-cols-[3rem_minmax(0,1fr)_1rem] items-start gap-2.5 px-4 py-3 text-left transition-colors duration-150 enabled:hover:bg-canvas/60 sm:grid-cols-[3rem_13rem_minmax(0,1fr)_7rem_1rem] sm:px-5"
                    >
                      <span className="pt-0.5 text-[13px] tabular-nums text-ink-mute">{l.at}</span>
                      <span className="hidden min-w-0 items-center gap-2 sm:flex">
                        <Initials name={l.user} className="size-7 text-[11px]" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{l.user}</span>
                          <span className="block text-xs text-ink-mute">{l.role}</span>
                        </span>
                      </span>
                      <span className="min-w-0 text-sm">
                        <span className={`font-semibold ${ACT_CLS[l.act]}`}>{l.act}</span> <span className="text-ink">{l.target}</span>
                        {l.ref && <span className="ml-1.5 text-xs tabular-nums text-ink-mute">{l.ref}</span>}
                        <span className="mt-0.5 block text-xs text-ink-mute sm:hidden">{l.user}</span>
                      </span>
                      <span className="hidden pt-0.5 text-xs tabular-nums text-ink-mute sm:block">{l.ip}</span>
                      {canOpen ? <ChevronRight className={`mt-0.5 size-4 text-ink-mute transition-transform duration-150 ease-out ${isOpen ? 'rotate-90' : ''}`} /> : <span />}
                    </button>
                    {isOpen && (
                      <div className="pb-4 pl-[4.75rem] pr-4 sm:pl-[17.5rem] sm:pr-5">
                        {l.diff && (
                          <dl className="overflow-hidden rounded-md border border-line text-[13px]">
                            {l.diff.map((x) => (
                              <div key={x.f} className="grid gap-1 border-b border-line px-3 py-2 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-2.5">
                                <dt className="font-medium text-ink-soft">{x.f}</dt>
                                <dd className="text-heritage-ink line-through decoration-heritage/40">{x.from}</dd>
                                <dd className="text-jade-deep">{x.to}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {l.note && <p className={`text-[13px] text-ink-soft ${l.diff ? 'mt-2' : ''}`}>{l.note}</p>}
                        {l.ref && (
                          <Btn size="sm" variant="ghost" className="-ml-2.5 mt-2" onClick={() => onNavigate?.(l.ref!.startsWith('LS') ? 'soldierEdit' : l.ref!.startsWith('BV') ? 'articleEdit' : l.ref!.startsWith('NCC') ? 'meritEdit' : l.ref!.startsWith('GD') ? 'familyEdit' : 'accountEdit', { id: l.ref })}>
                            Mở hồ sơ {l.ref}
                          </Btn>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
        <Pager from={1} to={rows.length} total={1284} page={1} pages={143} />
      </Panel>
    </AdminShell>
  )
}
