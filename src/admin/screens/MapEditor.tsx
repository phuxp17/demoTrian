import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Box, Flag, Footprints, Grid3x3, Hand, MousePointer2, Redo2, Rows3, Search, Square, Undo2 } from 'lucide-react'
import { AdminShell } from '../../shared/admin/AdminShell'
import { Btn, Callout, Field, Input, Select } from '../../shared/admin/ui'
import { soldierCode } from '../../shared/admin/data'
import { IsoCemetery, buildSite, wayfinding } from '../../GraveMap.frame/components/IsoCemetery'
import { CEMETERIES, SOLDIERS, type Soldier } from '../../shared/data'
import type { AdminNavigate } from '../../shared/admin/nav'
import { PlanEditor, type PlotState } from './PlanEditor'

type Props = Partial<typeof args> & { onNavigate?: AdminNavigate; recordId?: string }

export default function MapEditor(props: Props) {
  const { view: initialView, tool: initialTool, selectedGrave, showConflicts, onNavigate, recordId } = { ...args, ...props }
  const [cemId, setCemId] = useState(() => (CEMETERIES.find((c) => c.id === recordId) ?? CEMETERIES[0]).id)
  const cem = CEMETERIES.find((c) => c.id === cemId) ?? CEMETERIES[0]
  const [view, setView] = useState(initialView)
  const [tool, setTool] = useState(initialTool)
  const [sel, setSel] = useState<string | null>(selectedGrave === 'none' ? null : selectedGrave)
  const [focusKey, setFocusKey] = useState(0)
  const site = useMemo(() => buildSite(cem.layout), [cem.layout])

  /** Vị trí → hồ sơ, khởi tạo từ dữ liệu công khai để hai sơ đồ luôn khớp nhau. */
  const [assigned, setAssigned] = useState<Record<string, string>>(() => initialAssigned(cem.name))
  const [unplaced, setUnplaced] = useState<string[]>(UNPLACED.map((s) => s.id))
  const [conflict, setConflict] = useState<string[] | null>(cem.id === 'c1' && showConflicts ? CONFLICT_IDS : null)

  const pickCemetery = (name: string) => {
    const next = CEMETERIES.find((c) => c.name === name)
    if (!next) return
    setCemId(next.id)
    setAssigned(initialAssigned(next.name))
    setConflict(next.id === 'c1' && showConflicts ? CONFLICT_IDS : null)
    setSel(null)
  }

  const stateOf = (plot: string): PlotState => {
    if (conflict && plot === CONFLICT) return 'conflict'
    if (assigned[plot]) return 'profile'
    return site.graves.find((g) => g.plot === plot)?.unknown ? 'unknown' : 'known'
  }

  const byPlot = useMemo(() => {
    const m = new Map<string, Soldier>()
    Object.entries(assigned).forEach(([plot, id]) => {
      const s = ALL.find((x) => x.id === id)
      if (s) m.set(plot, s)
    })
    return m
  }, [assigned])

  const total = site.graves.length
  const withProfile = Object.keys(assigned).length
  const selState = sel ? stateOf(sel) : null
  const selSoldier = sel ? byPlot.get(sel) : undefined

  const assign = (id: string) => {
    if (!sel || selState === 'profile' || selState === 'conflict') return
    setAssigned((a) => ({ ...a, [sel]: id }))
    setUnplaced((u) => u.filter((x) => x !== id))
  }
  const unassign = () => {
    if (!sel || !assigned[sel]) return
    const id = assigned[sel]
    setAssigned(({ [sel]: _, ...rest }) => rest)
    setUnplaced((u) => [id, ...u])
  }
  const keep = (id: string) => {
    if (!conflict) return
    setAssigned((a) => ({ ...a, [CONFLICT]: id }))
    setUnplaced((u) => [...conflict.filter((x) => x !== id), ...u])
    setConflict(null)
  }
  const goTo = (plot: string) => {
    setSel(plot)
    setFocusKey((k) => k + 1)
  }

  return (
    <AdminShell
      bleed
      active="mapEditor"
      onNavigate={onNavigate}
      crumbs={[{ label: 'Hồ sơ' }, { label: 'Nghĩa trang', page: 'cemeteries' }, { label: cem.name, page: 'cemeteryEdit' }, { label: 'Sơ đồ' }]}
      title={`Sơ đồ · ${cem.name}`}
      subtitle={`4 khu · ${cem.layout.rows * 4} hàng · ${withProfile}/${total} mộ có hồ sơ · lưu nháp 10:52`}
      actions={
        <>
          <Select options={CEMETERIES.map((c) => c.name)} value={cem.name} onChange={pickCemetery} className="w-full sm:w-64" />
          <Btn variant="primary">Xuất bản sơ đồ</Btn>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-h-[520px] min-w-0 flex-1 flex-col bg-canvas">
          {/* Chế độ xem và công cụ */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface px-3 py-2">
            <div role="tablist" aria-label="Chế độ sơ đồ" className="flex rounded-md bg-canvas p-0.5 ring-1 ring-line">
              {VIEWS.map(({ id, label, hint, I }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={view === id}
                  onClick={() => setView(id)}
                  title={hint}
                  className={`flex h-8 items-center gap-1.5 whitespace-nowrap rounded px-3 text-[13px] transition-colors duration-150 ${view === id ? 'bg-surface font-medium text-ink shadow-sm ring-1 ring-line' : 'text-ink-soft hover:text-ink'}`}
                >
                  <I className="size-4" />
                  {label}
                </button>
              ))}
            </div>

            {view === '2d' ? (
              <div className="ml-auto flex flex-wrap items-center gap-0.5">
                {TOOLS.map(({ id, label, I }) => (
                  <button
                    key={id}
                    onClick={() => setTool(id)}
                    title={label}
                    aria-pressed={tool === id}
                    className={`flex h-8 items-center gap-1.5 rounded-md px-2 text-[13px] transition-colors duration-150 ${tool === id ? 'bg-ink text-white' : 'text-ink-soft hover:bg-canvas'}`}
                  >
                    <I className="size-4" />
                    <span className="hidden 2xl:inline">{label}</span>
                  </button>
                ))}
                <span className="mx-1 h-5 w-px bg-line" />
                <button aria-label="Hoàn tác" className="grid size-8 place-items-center rounded-md text-ink-soft hover:bg-canvas"><Undo2 className="size-4" /></button>
                <button aria-label="Làm lại" className="grid size-8 place-items-center rounded-md text-ink-mute hover:bg-canvas"><Redo2 className="size-4" /></button>
              </div>
            ) : (
              <p className="ml-auto text-[13px] text-ink-mute">Đúng như người dân thấy trên cổng · chỉ xem</p>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="relative flex min-h-0 flex-1 flex-col"
            >
              {view === '2d' ? (
                <PlanEditor site={site} layout={cem.layout} stateOf={stateOf} nameOf={(p) => byPlot.get(p)?.name} selected={sel} onSelect={setSel} tool={tool} focusKey={focusKey} />
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                  <IsoCemetery layout={cem.layout} byPlot={byPlot} selected={sel} focusKey={focusKey} onSelect={setSel} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bảng thuộc tính */}
        <aside className="w-full shrink-0 overflow-y-auto border-t border-line bg-surface lg:w-80 lg:border-l lg:border-t-0">
          {conflict && (
            <div className="border-b border-line p-4">
              <Callout tone="danger" title="1 xung đột cần xử lý">
                Ô {short(CONFLICT)} được gán cho 2 hồ sơ: {conflict.map((id) => ALL.find((s) => s.id === id)?.name).join(' và ')}.
                <button onClick={() => goTo(CONFLICT)} className="mt-1 block font-medium underline">Đi tới ô này</button>
              </Callout>
            </div>
          )}

          <section className="border-b border-line p-4">
            <h2 className="text-sm font-semibold">{sel ? `Ô mộ ${short(sel)}` : 'Chưa chọn ô'}</h2>
            {sel && <p className="mt-0.5 text-xs text-ink-mute">{STATE_LABEL[selState!]}</p>}

            {!sel ? (
              <p className="mt-1 text-[13px] text-ink-mute">Chọn một ô trên sơ đồ để xem hoặc gán hồ sơ. Lựa chọn được giữ khi đổi giữa 2D và 2.5D.</p>
            ) : selState === 'conflict' && conflict ? (
              <div className="mt-3 space-y-2">
                {conflict.map((id) => {
                  const s = ALL.find((x) => x.id === id)!
                  return (
                    <div key={id} className="flex items-center justify-between gap-2 rounded-md border border-heritage/30 bg-heritage-tint/50 px-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{s.name}</span>
                        <span className="text-xs text-ink-mute">{soldierCode(s.id)} · {s.born}–{s.died}</span>
                      </span>
                      <Btn size="sm" variant="ghost" onClick={() => keep(id)}>Giữ</Btn>
                    </div>
                  )
                })}
                <p className="text-xs text-ink-mute">Hồ sơ không được giữ sẽ chuyển sang danh sách chưa gán.</p>
              </div>
            ) : selSoldier ? (
              <div className="mt-3 space-y-2.5">
                <div className="rounded-md border border-line px-3 py-2.5">
                  <p className="text-sm font-medium">{selSoldier.name}</p>
                  <p className="text-xs text-ink-mute">{soldierCode(selSoldier.id)} · {selSoldier.born} – {selSoldier.died} · {selSoldier.rank}</p>
                </div>
                <Field label="Mã mộ"><Input value={plotCode(sel)} readOnly className="bg-canvas tabular-nums" /></Field>
                <div className="flex gap-2">
                  <Btn size="sm" className="flex-1" onClick={() => onNavigate?.('soldierEdit', { id: selSoldier.id })}>Mở hồ sơ</Btn>
                  <Btn size="sm" variant="danger" onClick={unassign}>Bỏ gán</Btn>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-ink-soft">Ô chưa có hồ sơ trực tuyến. Chọn “Gán” ở danh sách bên dưới để gắn một hồ sơ vào ô này.</p>
            )}

            {sel && wayfinding(sel, cem.layout) && (
              <p className="mt-3 flex gap-2 border-l-2 border-line-strong pl-3 text-xs leading-relaxed text-ink-soft">
                <Footprints className="mt-0.5 size-3.5 shrink-0 text-ink-mute" aria-hidden />
                <span><span className="font-medium text-ink">Chỉ đường hiển thị công khai: </span>{wayfinding(sel, cem.layout)}</span>
              </p>
            )}
          </section>

          <section className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Chưa gán vị trí</h2>
              <span className="text-xs tabular-nums text-ink-mute">{unplaced.length} hồ sơ</span>
            </div>
            <label className="relative mt-2 block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-mute" />
              <input placeholder="Tìm hồ sơ" className="h-8 w-full rounded-md border border-line-strong pl-8 pr-2 text-[13px] focus:border-gold focus:outline-none" />
            </label>
            {unplaced.length === 0 ? (
              <p className="mt-3 text-[13px] text-ink-mute">Mọi hồ sơ đã có vị trí.</p>
            ) : (
              <ul className="mt-2 divide-y divide-line">
                {unplaced.map((id) => {
                  const s = ALL.find((x) => x.id === id)!
                  const canAssign = !!sel && (selState === 'known' || selState === 'unknown')
                  return (
                    <li key={id} className="flex items-center gap-2 py-2">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">{s.name}</span>
                        <span className="text-xs text-ink-mute">{s.born} – {s.died}</span>
                      </span>
                      <Btn size="sm" variant="ghost" disabled={!canAssign} onClick={() => assign(id)} title={canAssign ? `Gán vào ${sel ? short(sel) : ''}` : 'Chọn một ô chưa có hồ sơ trước'}>Gán</Btn>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="border-t border-line p-4">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold"><AlertTriangle className="size-4 text-amber" /> Kiểm tra trước khi xuất bản</h2>
            <ul className="mt-2 space-y-1 text-[13px] text-ink-soft">
              {conflict && <li>Còn 1 ô bị gán trùng hồ sơ</li>}
              <li>{site.graves.filter((g) => g.unknown).length} ô chưa xác định danh tính sẽ hiện viền nét đứt</li>
              <li>2 mốc chưa đặt tên</li>
            </ul>
          </section>
        </aside>
      </div>
    </AdminShell>
  )
}

const args = {
  view: '2d',
  tool: 'select',
  selectedGrave: 'Khu A · Hàng 2 · Mộ 07',
  showConflicts: true,
}

const VIEWS = [
  { id: '2d', label: '2D · Chỉnh sửa', hint: 'Mặt bằng nhìn từ trên xuống, dễ chọn và gán từng ô', I: Grid3x3 },
  { id: '2.5d', label: '2.5D · Xem trước', hint: 'Sơ đồ như trên cổng công khai', I: Box },
]

const TOOLS = [
  { id: 'select', label: 'Chọn', I: MousePointer2 },
  { id: 'pan', label: 'Kéo', I: Hand },
  { id: 'zone', label: 'Khu', I: Square },
  { id: 'row', label: 'Hàng', I: Rows3 },
  { id: 'path', label: 'Đường đi', I: Footprints },
  { id: 'landmark', label: 'Mốc', I: Flag },
]

const STATE_LABEL: Record<PlotState, string> = {
  profile: 'Có hồ sơ trực tuyến',
  known: 'Đã xác định · chưa có hồ sơ',
  unknown: 'Chưa xác định danh tính',
  conflict: 'Xung đột · gán trùng 2 hồ sơ',
}

const CONFLICT = 'Khu B · Hàng 3 · Mộ 04'
const CONFLICT_IDS = ['u4', 'u5']

/** Hồ sơ đã nhập nhưng chưa có vị trí trong nghĩa trang. */
const UNPLACED: Soldier[] = [
  { id: 'u1', name: 'Nguyễn Văn Bình', born: '1950', died: '1972', hometown: 'Thôn Thụy Lôi, Thư Lâm', rank: 'Binh nhất', unit: 'Sư đoàn 320', diedAt: 'Quảng Trị', cemetery: '', plot: '', photo: false },
  { id: 'u2', name: 'Trần Văn Hợi', born: '1947', died: '1968', hometown: 'Thôn Hà Lâm, Thư Lâm', rank: 'Hạ sĩ', unit: 'Trung đoàn 9', diedAt: 'Huế', cemetery: '', plot: '', photo: false },
  { id: 'u3', name: 'Lê Thị Mận', born: '1952', died: '1972', hometown: 'Thôn Đào Thục, Thư Lâm', rank: 'Thanh niên xung phong', unit: 'Đội 55, Đoàn 559', diedAt: 'Trường Sơn', cemetery: '', plot: '', photo: false },
]
const CONFLICTING: Soldier[] = [
  { id: 'u4', name: 'Đinh Văn Lực', born: '1949', died: '1971', hometown: 'Thôn Biểu Khê, Thư Lâm', rank: 'Trung sĩ', unit: 'Sư đoàn 308', diedAt: 'Đường 9 – Nam Lào', cemetery: '', plot: '', photo: false },
  { id: 'u5', name: 'Phạm Văn Tư', born: '1951', died: '1972', hometown: 'Thôn Cổ Miếu, Thư Lâm', rank: 'Binh nhì', unit: 'Sư đoàn 304', diedAt: 'Quảng Trị', cemetery: '', plot: '', photo: false },
]
const ALL = [...SOLDIERS, ...UNPLACED, ...CONFLICTING]

function initialAssigned(cemetery: string) {
  const a: Record<string, string> = {}
  SOLDIERS.filter((s) => s.cemetery === cemetery).forEach((s) => (a[s.plot] = s.id))
  return a
}

/** "Khu A · Hàng 2 · Mộ 07" → "A · H2 · 07" */
function short(plot: string) {
  const m = plot.match(/Khu (\w) · Hàng (\d+) · Mộ (\d+)/)
  return m ? `${m[1]} · H${m[2]} · ${m[3]}` : plot
}

function plotCode(plot: string) {
  const m = plot.match(/Khu (\w) · Hàng (\d+) · Mộ (\d+)/)
  return m ? `TL-${m[1]}-${m[2].padStart(2, '0')}-${m[3]}` : plot
}
