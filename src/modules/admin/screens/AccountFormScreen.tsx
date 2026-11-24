import React, { useState } from 'react'
import { KeyRound, Lock } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Callout, Check, Field, FormFooter, Input, Panel, Select, Status } from '@/modules/admin/components'
import { ACCOUNTS, ROLES } from '@/data/admin.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  mode: 'edit',
  role: 'Cán bộ nhập liệu',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

export default function AccountForm(props: Props) {
  const { mode, role, onNavigate, recordId } = { ...args, ...props }
  const isNew = mode === 'new' || recordId === 'new'
  const account = isNew ? undefined : ACCOUNTS.find((entry) => entry.id === (recordId ?? 'u4'))
  const title = isNew ? 'Tạo tài khoản' : account?.name ?? 'Tài khoản'
  const [r, setR] = useState(account?.role ?? role)
  const [matrix, setMatrix] = useState<Record<string, string[]>>(() => presetFor(r))
  const [scope, setScope] = useState(() => account?.scope.split(', ').map((item) => item.replace(/^Thôn /, '')) ?? [])
  const custom = JSON.stringify(matrix) !== JSON.stringify(presetFor(r))

  const pickRole = (v: string) => {
    setR(v)
    setMatrix(presetFor(v))
  }
  const flip = (mod: string, act: string) =>
    setMatrix((m) => ({ ...m, [mod]: m[mod]?.includes(act) ? m[mod].filter((a) => a !== act) : [...(m[mod] ?? []), act] }))

  return (
    <AdminShell
      active="accountEdit"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hệ thống' }, { label: 'Tài khoản', page: 'accounts' }, { label: title }]}
      title={title}
      subtitle={account && <span className="inline-flex items-center gap-2"><Status s={account.status} /> Đăng nhập gần nhất {account.lastSeen}</span>}
      actions={
        !isNew && (
          <>
            <Btn icon={<KeyRound className="size-4" />}>Đặt lại mật khẩu</Btn>
            <Btn variant="danger" icon={<Lock className="size-4" />}>Khóa</Btn>
          </>
        )
      }
    >
      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-2.5">
          <Panel title="Thông tin tài khoản">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="Họ và tên" required className="sm:col-span-2"><Input defaultValue={account?.name} placeholder="Nguyễn Văn A" /></Field>
              <Field label="Email công vụ" required hint="Dùng làm tên đăng nhập" className="sm:col-span-2"><Input type="email" defaultValue={account?.email} placeholder="ten@thulam.hanoi.gov.vn" /></Field>
              <Field label="Số điện thoại"><Input type="tel" /></Field>
              <Field label="Đơn vị / chức vụ"><Input /></Field>
            </div>
          </Panel>

          <Panel title="Phạm vi phụ trách" description="Người dùng chỉ thấy và sửa hồ sơ trong phạm vi được chọn">
            <div className="space-y-2.5">
              <ScopeGroup title="Nghĩa trang" items={['NTLS Thụy Lâm', 'NTLS Vân Hà', 'NTLS Liên Hà', 'NTLS Xuân Nộn']} value={scope} onChange={setScope} />
              <ScopeGroup title="Thôn" items={['Thụy Lôi', 'Hà Lâm', 'Đào Thục', 'Biểu Khê', 'Cổ Miếu', 'Mạnh Tân', 'Hương Trầm', 'Vân Điềm']} value={scope} onChange={setScope} />
            </div>
          </Panel>
        </div>

        <Panel
          title="Phân quyền"
          description="Chọn vai trò để áp mẫu quyền, rồi tinh chỉnh từng ô nếu cần"
          action={<Select options={ROLES} value={r} onChange={pickRole} className="w-full sm:w-52" />}
          flush
        >
          {custom && <Callout tone="warn" className="m-4 mb-0">Đã tuỳ chỉnh khác mẫu “{r}”. Thay đổi được ghi vào nhật ký hoạt động.</Callout>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-mute">
                  <th className="sticky left-0 z-[1] bg-surface px-4 py-2.5 text-left font-medium">Phân hệ</th>
                  {ACTIONS.map((a) => (
                    <th key={a} className="px-2 py-2.5 text-center font-medium">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {MODULES.map((m) => (
                  <tr key={m}>
                    <td className="sticky left-0 z-[1] whitespace-nowrap bg-surface px-4 py-2.5">{m}</td>
                    {ACTIONS.map((a) => {
                      const na = (a === 'Duyệt' && ['Tài khoản', 'Cấu hình hệ thống'].includes(m)) || (a === 'Xuất' && m === 'Cấu hình hệ thống')
                      return (
                        <td key={a} className="px-2 py-2.5 text-center">
                          {na ? <span className="text-line-strong">—</span> : <input type="checkbox" aria-label={`${a} ${m}`} checked={!!matrix[m]?.includes(a)} onChange={() => flip(m, a)} className="size-4 accent-heritage" />}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <FormFooter note={isNew ? 'Chưa lưu' : 'Lưu lần cuối 12/09/2025 bởi Nguyễn Minh Đức'}>
        <Btn onClick={() => onNavigate?.('accounts')}>Huỷ</Btn>
        <Btn variant="primary" onClick={() => onNavigate?.('accounts')}>{isNew ? 'Tạo và gửi email' : 'Lưu thay đổi'}</Btn>
      </FormFooter>
    </AdminShell>
  )
}

function ScopeGroup({ title, items, value, onChange }: { title: string; items: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const all = items.every((i) => value.includes(i))
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13px] font-medium">{title}</p>
        <button onClick={() => onChange(all ? value.filter((v) => !items.includes(v)) : [...new Set([...value, ...items])])} className="text-xs text-heritage hover:underline">
          {all ? 'Bỏ chọn' : 'Chọn tất cả'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((i) => (
          <Check key={i} label={i} checked={value.includes(i)} onChange={(on) => onChange(on ? [...value, i] : value.filter((v) => v !== i))} />
        ))}
      </div>
    </div>
  )
}

const ACTIONS = ['Xem', 'Tạo', 'Sửa', 'Ẩn', 'Duyệt', 'Xuất']
const MODULES = ['Nghĩa trang & sơ đồ', 'Liệt sĩ & phần mộ', 'Người có công', 'Địa chỉ gia đình', 'Địa chỉ đỏ', 'Bài viết & trang chủ', 'Thư viện media', 'Tài khoản', 'Cấu hình hệ thống']

function presetFor(role: string): Record<string, string[]> {
  const all = (acts: string[]) => Object.fromEntries(MODULES.map((m) => [m, acts]))
  if (role === 'Quản trị hệ thống') return all(ACTIONS)
  if (role === 'Lãnh đạo phê duyệt') return { ...all(['Xem', 'Duyệt', 'Xuất']), 'Tài khoản': ['Xem'], 'Cấu hình hệ thống': ['Xem'] }
  if (role === 'Biên tập viên') return { ...all(['Xem']), 'Bài viết & trang chủ': ['Xem', 'Tạo', 'Sửa', 'Ẩn'], 'Thư viện media': ['Xem', 'Tạo', 'Sửa', 'Ẩn'], 'Địa chỉ đỏ': ['Xem', 'Tạo', 'Sửa'], 'Tài khoản': [], 'Cấu hình hệ thống': [] }
  if (role === 'Cán bộ nhập liệu') return { ...all(['Xem', 'Tạo', 'Sửa']), 'Bài viết & trang chủ': ['Xem'], 'Tài khoản': [], 'Cấu hình hệ thống': [] }
  return { ...all([]), 'Liệt sĩ & phần mộ': ['Xem', 'Sửa'], 'Người có công': ['Xem', 'Sửa'], 'Địa chỉ gia đình': ['Xem', 'Tạo', 'Sửa'] }
}
