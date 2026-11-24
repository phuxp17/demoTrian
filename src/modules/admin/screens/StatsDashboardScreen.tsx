import React from 'react'
import { Download } from 'lucide-react'
import { AdminShell } from '@/modules/admin/layout'
import { Btn, Filter, Panel } from '@/modules/admin/components'
import { AREAS } from '@/data/admin.mock'
import type { AdminNavigate } from '@/config/adminNav'

const args = {
  area: 'Toàn xã',
  period: 'Năm 2025',
}

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate }

export default function StatsDashboard(props: Props) {
  const { area, period, onNavigate } = { ...args, ...props }
  const rows = area === 'Toàn xã' ? BY_AREA : BY_AREA.filter((r) => r.area === area)
  const total = rows.reduce((s, r) => s + r.verified + r.verifying + r.missing, 0)
  const verified = rows.reduce((s, r) => s + r.verified, 0)
  const verifying = rows.reduce((s, r) => s + r.verifying, 0)
  const pct = ((verified / total) * 100).toFixed(1)

  return (
    <AdminShell
      active="stats"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Tổng quan' }, { label: 'Thống kê' }]}
      title="Thống kê hồ sơ"
      subtitle={`Số liệu cập nhật lúc 10:45, 17/09/2025 · ${area}`}
      actions={
        <>
          <Filter label="Địa bàn" value={area} options={AREAS} />
          <Filter label="Kỳ" value={period} options={['Năm 2025', 'Quý III/2025', '30 ngày qua']} />
          <Btn icon={<Download className="size-4" />} onClick={() => onNavigate?.('export')}>
            Xuất báo cáo
          </Btn>
        </>
      }
    >
      {/* Headline: verification is the number leadership asks about */}
      <section className="rounded-lg border border-line bg-surface p-3.5 sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-ink-soft">Phần mộ đã xác minh danh tính</p>
            <p className="mt-1 text-5xl font-semibold tracking-tight tabular-nums">
              {pct}
              <span className="text-2xl text-ink-mute">%</span>
            </p>
            <p className="mt-1 text-sm text-ink-mute tabular-nums">
              {verified.toLocaleString('vi-VN')} / {total.toLocaleString('vi-VN')} phần mộ · tăng 4,2 điểm so với đầu năm
            </p>
          </div>
          <dl className="grid w-full grid-cols-3 gap-x-4 gap-y-2 text-sm sm:w-auto sm:gap-x-8">
            {[
              { k: 'Đang xác minh', v: verifying },
              { k: 'Người có công', v: 186 },
              { k: 'Bài viết công khai', v: 42 },
            ].map((d) => (
              <div key={d.k}>
                <dt className="text-ink-mute">{d.k}</dt>
                <dd className="mt-0.5 text-xl font-semibold tabular-nums">{d.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-canvas">
          <div className="bg-jade" style={{ width: `${(verified / total) * 100}%` }} />
          <div className="bg-amber" style={{ width: `${(verifying / total) * 100}%` }} />
        </div>
        <Legend />
      </section>

      <div className="mt-2.5 grid gap-2.5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel title="Tiến độ xác minh theo địa bàn" description="Nghĩa trang thuộc xã cũ trước sáp nhập 16/6/2025">
          <ul className="space-y-2.5">
            {rows.map((r) => {
              const t = r.verified + r.verifying + r.missing
              return (
                <li key={r.area}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium">{r.cemetery}</span>
                    <span className="tabular-nums text-ink-mute">
                      <b className="font-semibold text-ink">{Math.round((r.verified / t) * 100)}%</b> · {r.verified}/{t}
                    </span>
                  </div>
                  <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-canvas">
                    <div className="bg-jade" style={{ width: `${(r.verified / t) * 100}%` }} />
                    <div className="bg-amber" style={{ width: `${(r.verifying / t) * 100}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-ink-mute">
                    {r.verifying} đang xác minh · {r.missing} chưa rõ danh tính
                  </p>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel title="Theo nhóm đối tượng" flush>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-mute">
                <th className="px-5 py-2.5 font-medium">Nhóm</th>
                <th className="px-3 py-2.5 text-right font-medium">Hồ sơ</th>
                <th className="px-5 py-2.5 text-right font-medium">Công khai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {GROUPS.map((g) => (
                <tr key={g.name}>
                  <td className="px-5 py-2.5">{g.name}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{g.n}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-ink-soft">{Math.round((g.pub / g.n) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel className="mt-2.5" title="Hồ sơ cập nhật theo tháng" description={`${period} · tạo mới và chỉnh sửa đã duyệt`}>
        <div className="flex h-48 items-end gap-2 sm:gap-2.5">
          {MONTHS.map((m) => (
            <div key={m.m} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] tabular-nums text-ink-mute">{m.n}</span>
              <div className={`w-full max-w-10 rounded-t ${m.m === 'T9' ? 'bg-heritage' : 'bg-gold-soft'}`} style={{ height: `${(m.n / 160) * 150}px` }} />
              <span className="text-xs text-ink-mute">{m.m}</span>
            </div>
          ))}
        </div>
      </Panel>
    </AdminShell>
  )
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap gap-2.5 text-xs text-ink-soft">
      <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-jade" />Đã xác minh</span>
      <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber" />Đang xác minh</span>
      <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-canvas ring-1 ring-line" />Chưa rõ danh tính</span>
    </div>
  )
}

const BY_AREA = [
  { area: 'Xã Thụy Lâm cũ', cemetery: 'NTLS Thụy Lâm', verified: 241, verifying: 12, missing: 11 },
  { area: 'Xã Vân Hà cũ', cemetery: 'NTLS Vân Hà', verified: 157, verifying: 6, missing: 5 },
  { area: 'Xã Liên Hà cũ', cemetery: 'NTLS Liên Hà', verified: 176, verifying: 9, missing: 7 },
  { area: 'Xã Xuân Nộn cũ', cemetery: 'NTLS Xuân Nộn', verified: 109, verifying: 4, missing: 7 },
]

const GROUPS = [
  { name: 'Liệt sĩ', n: 744, pub: 683 },
  { name: 'Bà mẹ Việt Nam Anh hùng', n: 23, pub: 23 },
  { name: 'Thương binh', n: 78, pub: 51 },
  { name: 'Bệnh binh', n: 34, pub: 19 },
  { name: 'Người HĐ kháng chiến', n: 41, pub: 22 },
  { name: 'Có công giúp đỡ CM', n: 10, pub: 6 },
  { name: 'Địa chỉ gia đình', n: 312, pub: 188 },
]

const MONTHS = [
  { m: 'T1', n: 24 }, { m: 'T2', n: 18 }, { m: 'T3', n: 41 }, { m: 'T4', n: 37 }, { m: 'T5', n: 52 },
  { m: 'T6', n: 88 }, { m: 'T7', n: 146 }, { m: 'T8', n: 121 }, { m: 'T9', n: 97 },
]
