import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, MoreHorizontal, Pencil, Unlock, UserPlus } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Field, Filter, Initials, Pager, Panel, SearchBox, Select, Status, Table, Textarea } from '../../shared/admin/ui'
import { ACCOUNTS, ROLES } from '../../shared/admin/data'
import type { AdminNavigate } from '../../shared/admin/nav'

const args = {
  state: 'default',
  query: '',
  role: 'Tất cả',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

export default function AccountList(props: Props) {
  const { state, query, role, onNavigate } = { ...args, ...props }
  const [q, setQ] = useState(query)
  const [r, setR] = useState(role)
  const [locking, setLocking] = useState<string | null>(state === 'lock-dialog' ? 'u5' : null)
  const rows = ACCOUNTS.filter((a) => (r === 'Tất cả' || a.role === r) && (a.name + a.email).toLowerCase().includes(q.toLowerCase()))
  const target = ACCOUNTS.find((a) => a.id === locking)

  return (
    <AdminShell
      active="accounts"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hệ thống' }, { label: 'Tài khoản' }]}
      title="Tài khoản"
      subtitle="8 tài khoản · 6 đang hoạt động. Khóa tài khoản không xoá lịch sử thao tác."
      actions={
        <Btn variant="primary" icon={<UserPlus className="size-4" />} onClick={() => onNavigate?.('accountEdit', { id: 'new' })}>
          Tạo tài khoản
        </Btn>
      }
    >
      <Panel flush>
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <SearchBox value={q} onChange={setQ} placeholder="Tìm theo tên hoặc email" className="w-full sm:w-72" />
          <Filter label="Vai trò" value={r} options={['Tất cả', ...ROLES]} onChange={setR} />
          <Filter label="Trạng thái" value="Tất cả" options={['Tất cả', 'Hoạt động', 'Đã khóa']} />
        </div>
        <Table head={['Người dùng', 'Vai trò', 'Phạm vi phụ trách', 'Truy cập gần nhất', 'Trạng thái', { label: '', className: 'w-24' }]}>
          {rows.map((a) => (
            <tr key={a.id} className="hover:bg-canvas/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Initials name={a.name} />
                  <div className="min-w-0">
                    <button onClick={() => onNavigate?.('accountEdit', { id: a.id })} className="font-medium hover:text-heritage">{a.name}</button>
                    <p className="truncate text-xs text-ink-mute">{a.email}</p>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3">{a.role}</td>
              <td className="px-4 py-3 text-ink-soft">{a.scope}</td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{a.lastSeen}</td>
              <td className="px-4 py-3"><Status s={a.status} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button aria-label="Sửa" onClick={() => onNavigate?.('accountEdit', { id: a.id })} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><Pencil className="size-4" /></button>
                  <button aria-label={a.status === 'locked' ? 'Mở khóa' : 'Khóa'} onClick={() => setLocking(a.id)} className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-heritage">
                    {a.status === 'locked' ? <Unlock className="size-4" /> : <Lock className="size-4" />}
                  </button>
                  <button aria-label="Thêm" className="rounded p-1.5 text-ink-mute hover:bg-canvas hover:text-ink"><MoreHorizontal className="size-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        <Pager from={1} to={rows.length} total={rows.length} />
      </Panel>

      <AnimatePresence>
        {target && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <button aria-label="Đóng" className="absolute inset-0 bg-ink/40" onClick={() => setLocking(null)} />
            <motion.div
              role="dialog"
              className="relative w-full max-w-md rounded-lg bg-surface p-5 shadow-xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <h2 className="text-lg font-semibold">{target.status === 'locked' ? 'Mở khóa' : 'Khóa'} tài khoản {target.name}?</h2>
              <p className="mt-1.5 text-sm text-ink-soft">
                {target.status === 'locked'
                  ? 'Người dùng có thể đăng nhập lại ngay với quyền trước khi bị khóa.'
                  : 'Người dùng bị đăng xuất khỏi mọi thiết bị. Các hồ sơ họ đang soạn được giữ nguyên ở trạng thái nháp.'}
              </p>
              <div className="mt-4 space-y-2.5">
                <Field label="Lý do" required>
                  <Select options={['Chuyển công tác', 'Nghỉ việc', 'Nghi lộ mật khẩu', 'Khác']} />
                </Field>
                <Field label="Ghi chú cho nhật ký">
                  <Textarea className="min-h-20" placeholder="Ví dụ: theo Quyết định số 112/QĐ-UBND" />
                </Field>
              </div>
              <div className="mt-2.5 flex justify-end gap-2">
                <Btn onClick={() => setLocking(null)}>Huỷ</Btn>
                <Btn variant="primary" onClick={() => setLocking(null)}>{target.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'}</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  )
}
