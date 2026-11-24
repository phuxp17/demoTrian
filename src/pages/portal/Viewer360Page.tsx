import React, { useRef, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Info, Maximize2, Move } from 'lucide-react'
import { CEMETERIES, IMG } from '@/data/portal.mock'
import { LotusSeal } from '@/components/ornaments'
import type { Navigate } from '@/config/portalNav'

export const args = {
  scene: 0,
  showHint: true,
}

export const argTypes = {
  scene: { control: 'select', options: [0, 1, 2, 3] },
  showHint: { control: 'boolean' },
}

type Props = Partial<typeof args> & { onNavigate?: Navigate; recordId?: string }

const SCENES = [
  { name: 'Cổng chính', image: IMG.panorama, note: 'Lối vào phía Nam, nhìn về Đài tưởng niệm' },
  { name: 'Đài tưởng niệm', image: IMG.hero, note: 'Nơi tổ chức lễ dâng hương các dịp kỷ niệm' },
  { name: 'Khu mộ A', image: IMG.cemetery, note: 'Các hàng mộ phía Tây Đài tưởng niệm' },
  { name: 'Nhà khách', image: IMG.dinh, note: 'Nơi đón tiếp thân nhân đến viếng' },
]

const HOTSPOTS = [
  { x: 22, y: 54, label: 'Khu mộ A', to: 2 },
  { x: 58, y: 46, label: 'Đài tưởng niệm', to: 1 },
  { x: 84, y: 58, label: 'Nhà khách', to: 3 },
]

export default function Viewer360(props: Props) {
  const { scene, showHint, onNavigate, recordId } = { ...args, ...props }
  const cem = CEMETERIES.find((c) => c.id === recordId && c.has360) ?? CEMETERIES[0]
  const root = useRef<HTMLDivElement>(null)
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else root.current?.requestFullscreen?.().catch(() => {})
  }
  const [i, setI] = useState(scene)
  const [pan, setPan] = useState(0)
  const [hint, setHint] = useState(showHint)
  const drag = useRef<{ x: number; start: number } | null>(null)
  const s = SCENES[i] ?? SCENES[0]

  const go = (n: number) => { setI((n + SCENES.length) % SCENES.length); setPan(0) }

  return (
    <div ref={root} className="flex h-screen min-h-[600px] flex-col bg-[#14100d] font-sans text-[#f8f1e1]">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 md:px-6">
        <button onClick={() => onNavigate?.('cemetery', { id: cem.id })} className="flex h-11 items-center gap-2 rounded-md px-2 text-gold-pale hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" /> <span className="hidden sm:inline">Về trang nghĩa trang</span>
        </button>
        <div className="min-w-0 text-center">
          <p className="truncate font-serif text-lg">{cem.name}</p>
          <p className="text-[0.8rem] text-gold-soft">Tham quan 360° · {s.name}</p>
        </div>
        <button onClick={toggleFullscreen} className="flex h-11 w-11 items-center justify-center rounded-md text-gold-pale hover:bg-white/10" aria-label="Toàn màn hình"><Maximize2 className="h-5 w-5" /></button>
      </header>

      <div
        className="relative flex-1 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
        onPointerDown={(e) => { drag.current = { x: e.clientX, start: pan }; setHint(false) }}
        onPointerMove={(e) => { if (drag.current) setPan(drag.current.start + (e.clientX - drag.current.x) * 0.15) }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        role="img"
        aria-label={`Ảnh toàn cảnh 360°: ${s.name}. ${s.note}`}
      >
        <div
          className="absolute inset-y-0 -left-1/4 w-[150%] bg-cover bg-center"
          style={{ backgroundImage: `url(${s.image})`, backgroundPositionX: `${50 + pan}%` }}
        />
        <div className="absolute inset-0 bg-black/15" />

        {HOTSPOTS.filter((h) => h.to !== i).map((h) => (
          <button
            key={h.label}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => go(h.to)}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper/90 bg-heritage/85 transition-transform duration-150 ease-out group-hover:scale-105">
              <ChevronRight className="h-5 w-5" />
            </span>
            <span className="rounded-sm bg-black/70 px-2.5 py-1 text-[0.85rem] whitespace-nowrap">{h.label}</span>
          </button>
        ))}

        {hint && (
          <div className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-md bg-black/70 px-4 py-3 text-[0.92rem] w-[min(22rem,calc(100%-2rem))] sm:w-max sm:px-5 sm:text-base">
            <Move className="h-5 w-5 shrink-0 text-gold-soft" /> Kéo để xoay góc nhìn · Bấm điểm đỏ để di chuyển
          </div>
        )}

        <div className="absolute top-3 right-3 left-3 rounded-md bg-black/65 px-3 py-2.5 backdrop-blur-sm sm:top-4 sm:right-auto sm:left-4 sm:max-w-xs sm:p-4">
          <p className="flex items-center gap-2 font-serif text-base sm:text-lg"><Info className="h-4 w-4 shrink-0 text-gold-soft" />{s.name}</p>
          <p className="mt-0.5 text-[0.85rem] leading-relaxed text-[#f8f1e1]/85 sm:mt-1 sm:text-[0.9rem]">{s.note}</p>
        </div>
      </div>

      <footer className="border-t border-white/10 bg-[#1c1612] px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => go(i - 1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/15 hover:bg-white/10" aria-label="Điểm trước"><ChevronLeft className="h-5 w-5" /></button>
          <ol className="no-scrollbar flex flex-1 gap-3 overflow-x-auto">
            {SCENES.map((sc, n) => (
              <li key={sc.name} className="shrink-0">
                <button onClick={() => go(n)} aria-current={n === i ? 'true' : undefined} className={`flex items-center gap-3 rounded-md border p-1.5 pr-4 transition-colors duration-150 ${n === i ? 'border-gold bg-white/10' : 'border-white/10 hover:border-white/30'}`}>
                  <img src={sc.image} alt="" className="h-12 w-18 rounded-sm object-cover" />
                  <span className="text-[0.92rem] whitespace-nowrap">{sc.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <button onClick={() => go(i + 1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/15 hover:bg-white/10" aria-label="Điểm tiếp theo"><ChevronRight className="h-5 w-5" /></button>
          <LotusSeal className="hidden h-10 w-10 shrink-0 text-gold/60 md:block" />
        </div>
      </footer>
    </div>
  )
}
