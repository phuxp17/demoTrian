import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { SiteHeader } from '../shared/components/SiteHeader'
import { SiteFooter } from '../shared/components/SiteFooter'
import { PageHeader } from '../shared/components/PageHeader'
import { Button, Container, Pagination, Portrait, SelectField } from '../shared/components/ui'
import { CEMETERIES, SOLDIERS } from '../shared/data'
import type { Navigate } from '../shared/nav'
import { ContributeButton } from '../shared/components/Contribute'
import { inYearRange, matches } from '../shared/text'

const PAGE_SIZE = 5
const ANY = 'Tất cả'
const villageOf = (hometown: string) => hometown.split(',')[0].trim()
const VILLAGES = [ANY, ...Array.from(new Set(SOLDIERS.map((s) => villageOf(s.hometown))))]
const UNITS = [ANY, ...Array.from(new Set(SOLDIERS.map((s) => s.unit))).sort((a, b) => a.localeCompare(b, 'vi'))]

export const args = {
  state: 'results',
  query: '',
}

export const argTypes = {
  state: { control: 'select', options: ['results', 'empty', 'loading'] },
  query: { control: 'text' },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate }

export default function SoldierSearch(props: Props) {
  const { state, query, onNavigate } = { ...args, ...props }
  const [q, setQ] = useState(query)
  const [cems, setCems] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [born, setBorn] = useState(ANY)
  const [died, setDied] = useState(ANY)
  const [rank, setRank] = useState(ANY)
  const [village, setVillage] = useState(ANY)
  const [unit, setUnit] = useState(ANY)
  const [photoOnly, setPhotoOnly] = useState(false)
  const [sort, setSort] = useState('name')
  const [page, setPage] = useState(1)

  const results = useMemo(() => {
    if (state === 'empty') return []
    const list = SOLDIERS.filter(
      (s) =>
        matches(`${s.name} ${s.hometown} ${s.born}`, q) &&
        (cems.length === 0 || cems.includes(s.cemetery)) &&
        inYearRange(s.born, born) &&
        inYearRange(s.died, died) &&
        (rank === ANY || s.rank === rank) &&
        (village === ANY || villageOf(s.hometown) === village) &&
        (unit === ANY || s.unit === unit) &&
        (!photoOnly || s.photo),
    )
    const lastName = (n: string) => n.split(' ').slice(-1)[0]
    return [...list].sort((a, b) =>
      sort === 'died' ? a.died.localeCompare(b.died) : sort === 'recent' ? b.id.localeCompare(a.id) : lastName(a.name).localeCompare(lastName(b.name), 'vi'),
    )
  }, [q, cems, state, born, died, rank, village, unit, photoOnly, sort])

  const pages = Math.ceil(results.length / PAGE_SIZE)
  const current = Math.min(page, Math.max(pages, 1))
  const shown = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const activeFilters = cems.length + [born, died, rank, village, unit].filter((v) => v !== ANY).length + (photoOnly ? 1 : 0)
  const clearAll = () => { setCems([]); setBorn(ANY); setDied(ANY); setRank(ANY); setVillage(ANY); setUnit(ANY); setPhotoOnly(false); setPage(1) }

  const toggleCem = (n: string) => { setCems((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n])); setPage(1) }

  const filters = (
    <div className="flex flex-col gap-6">
      <SelectField label="Thôn" value={village} onChange={(v) => { setVillage(v); setPage(1) }} options={VILLAGES} />
      <SelectField label="Năm sinh" value={born} onChange={(v) => { setBorn(v); setPage(1) }} options={[ANY, 'Trước 1945', '1945 – 1949', '1950 – 1954', 'Sau 1954', 'Không rõ']} />
      <SelectField label="Năm hy sinh" value={died} onChange={(v) => { setDied(v); setPage(1) }} options={[ANY, 'Trước 1965', '1965 – 1969', '1970 – 1975', 'Sau 1975', 'Không rõ']} />
      <fieldset>
        <legend className="text-[0.85rem] font-medium text-ink-soft">Nơi an táng</legend>
        <div className="mt-2 flex flex-col">
          {CEMETERIES.map((c) => (
            <label key={c.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.95rem]">
              <input type="checkbox" checked={cems.includes(c.name)} onChange={() => toggleCem(c.name)} className="h-5 w-5 accent-heritage" />
              <span className="min-w-0 flex-1">{c.name.replace('Nghĩa trang Liệt sĩ ', 'NTLS ')}</span>
              <span className="text-[0.85rem] text-ink-mute">{c.graves}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <SelectField label="Đơn vị" value={unit} onChange={(v) => { setUnit(v); setPage(1) }} options={UNITS} />
      <SelectField label="Cấp bậc" value={rank} onChange={(v) => { setRank(v); setPage(1) }} options={[ANY, 'Binh nhì', 'Binh nhất', 'Hạ sĩ', 'Trung sĩ', 'Thượng sĩ', 'Sĩ quan']} />
      <label className="flex min-h-11 items-center gap-3 text-[0.95rem]">
        <input type="checkbox" checked={photoOnly} onChange={(e) => { setPhotoOnly(e.target.checked); setPage(1) }} className="h-5 w-5 accent-heritage" /> Chỉ hồ sơ có ảnh chân dung
      </label>
    </div>
  )

  return (
    <div className="min-h-full bg-paper font-sans text-ink">
      <SiteHeader active="soldiers" onNavigate={onNavigate} />
      <PageHeader
        crumbs={[{ label: 'Trang chủ', onClick: () => onNavigate?.('home') }, { label: 'Tra cứu liệt sĩ' }]}
        title="Tra cứu thông tin liệt sĩ"
        lead="Tìm theo họ tên, năm sinh, năm hy sinh hoặc nơi an táng. Có thể nhập tên không dấu, ví dụ: nguyen van thanh."
      >
        <form onSubmit={(e) => e.preventDefault()} className="flex max-w-3xl flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Họ tên liệt sĩ</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-mute" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Nhập họ tên liệt sĩ" className="h-14 w-full rounded-md border border-line-strong bg-paper pr-4 pl-12 text-[1.05rem] placeholder:text-ink-mute focus:border-heritage focus:outline-none" />
          </label>
          <Button type="submit" size="lg" className="h-14">Tra cứu</Button>
        </form>
      </PageHeader>

      <Container className="grid gap-10 py-12 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl">Bộ lọc</h2>
              {activeFilters > 0 && <button onClick={clearAll} className="min-h-11 text-[0.9rem] text-heritage underline underline-offset-4">Xoá lọc ({activeFilters})</button>}
            </div>
            {filters}
          </div>
        </aside>

        <section className="min-w-0 lg:col-span-9" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-ink-soft">
              {state === 'loading' ? 'Đang tìm kiếm…' : <>Tìm thấy <strong className="text-ink">{results.length}</strong> hồ sơ{q && <> cho “{q}”</>}</>}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="lg:hidden" onClick={() => setFiltersOpen(true)}><SlidersHorizontal className="h-4 w-4" /> Bộ lọc{activeFilters > 0 && ` (${activeFilters})`}</Button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 rounded-md border border-line-strong bg-paper px-3 text-[0.95rem]" aria-label="Sắp xếp">
                <option value="name">Sắp xếp theo tên A–Z</option>
                <option value="died">Năm hy sinh</option>
                <option value="recent">Mới cập nhật</option>
              </select>
            </div>
          </div>

          {state === 'loading' ? (
            <ul className="divide-y divide-line">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex animate-pulse gap-5 py-5">
                  <div className="h-20 w-16 rounded-sm bg-parchment" />
                  <div className="flex-1 space-y-3 pt-1"><div className="h-5 w-1/3 rounded bg-parchment" /><div className="h-4 w-2/3 rounded bg-parchment" /></div>
                </li>
              ))}
            </ul>
          ) : results.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-2xl text-heritage-ink">Chưa tìm thấy hồ sơ phù hợp</p>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">Hãy thử nhập ít từ hơn, bỏ bớt bộ lọc hoặc kiểm tra cách viết tên. Nếu gia đình có thông tin chưa được ghi nhận, xin vui lòng gửi cho Ban quản lý.</p>
              <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button variant="secondary" onClick={() => { setQ(''); clearAll() }}>Xoá điều kiện tìm</Button>
                <ContributeButton topic="Bổ sung thông tin" subject={q.trim() ? `Liệt sĩ “${q.trim()}”` : undefined}>Gửi thông tin bổ sung</ContributeButton>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {shown.map((s) => (
                <li key={s.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 gap-5">
                    <Portrait name={s.name} arch={false} className="h-20 w-16 shrink-0 [&_span]:hidden" />
                    <div className="min-w-0">
                      <button onClick={() => onNavigate?.('soldier', { id: s.id })} className="text-left font-serif text-[1.35rem] leading-snug text-ink hover:text-heritage">
                        Liệt sĩ {s.name}
                      </button>
                      <p className="mt-1 text-[0.95rem] text-ink-soft">{s.born} – {s.died} · {s.rank} · Quê quán {s.hometown}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-[0.9rem] text-ink-mute"><MapPin className="h-4 w-4 text-gold" />{s.cemetery} · {s.plot}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:shrink-0">
                    <Button variant="secondary" className="flex-1 sm:flex-none" onClick={() => onNavigate?.('graveMap', { id: s.id })}>Vị trí mộ</Button>
                    <Button className="flex-1 sm:flex-none" onClick={() => onNavigate?.('soldier', { id: s.id })}>Xem hồ sơ</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {state === 'results' && results.length > 0 && <div className="mt-10"><Pagination page={current} total={pages} onChange={setPage} /></div>}
        </section>
      </Container>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-paper"
              role="dialog" aria-label="Bộ lọc"
            >
              <div className="flex items-center justify-between border-b border-line p-5">
                <h2 className="font-serif text-xl">Bộ lọc</h2>
                <button onClick={() => setFiltersOpen(false)} className="flex h-11 w-11 items-center justify-center" aria-label="Đóng"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{filters}</div>
              <div className="border-t border-line p-5"><Button className="w-full" onClick={() => setFiltersOpen(false)}>Xem {results.length} kết quả</Button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
