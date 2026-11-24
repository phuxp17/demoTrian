import React from 'react'
import { Lock, Mail } from 'lucide-react'
import { IMG } from '../../shared/data'
import { Btn, Callout, Field, Input } from '../../shared/admin/ui'
import type { AdminNavigate } from '../../shared/admin/nav'

export default function AdminLogin({ onNavigate }: { onNavigate: AdminNavigate }) {
  return (
    <main className="grid min-h-dvh w-full bg-canvas lg:grid-cols-[1fr_minmax(440px,560px)]">
      <aside className="relative hidden overflow-hidden lg:block">
        <img src={IMG.cemetery} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-sidebar/75" />
        <div className="relative flex h-full flex-col justify-between p-12 text-ivory">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-heritage font-serif text-base font-semibold">TL</span>
            <div className="leading-tight">
              <p className="font-semibold">Tri ân Thư Lâm</p>
              <p className="text-sm text-ivory/60">UBND xã Thư Lâm · TP. Hà Nội</p>
            </div>
          </div>
          <div className="max-w-md">
            <p className="font-serif text-3xl leading-snug">Mỗi hồ sơ được cập nhật là một lần ghi nhớ.</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">
              Hệ thống quản lý hồ sơ liệt sĩ, phần mộ, người có công và địa chỉ đỏ trên địa bàn xã.
            </p>
          </div>
          <p className="text-xs text-ivory/50">744 phần mộ · 4 nghĩa trang · 6 địa chỉ đỏ đang được quản lý</p>
        </div>
      </aside>

      <section className="flex items-center justify-center bg-surface px-6 py-10 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-9 place-items-center rounded-md bg-heritage font-serif text-sm font-semibold text-white">TL</span>
            <p className="font-semibold">Tri ân Thư Lâm</p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập quản trị</h1>
          <p className="mt-1.5 text-sm text-ink-soft">Khám phá các màn hình quản trị với dữ liệu mẫu.</p>

          <div className="mt-6 space-y-4">
            <Callout tone="info">Bản demo mô phỏng đăng nhập và các thao tác lưu dữ liệu.</Callout>
            <Field label="Email công vụ">
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
                <Input placeholder="Email công vụ" type="email" disabled className="h-10 bg-canvas pl-9" />
              </span>
            </Field>
            <Field label="Mật khẩu">
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
                <Input placeholder="Mật khẩu" type="password" disabled className="h-10 bg-canvas pl-9" />
              </span>
            </Field>
            <Btn variant="primary" type="button" onClick={() => onNavigate('work')} className="h-10 w-full">
              Vào bản demo
            </Btn>
          </div>
          <a href="/" className="mt-6 inline-block text-sm text-heritage hover:underline">Về cổng công khai</a>
        </div>
      </section>
    </main>
  )
}
