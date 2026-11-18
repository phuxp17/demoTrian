import React, { useId } from 'react'

/** Cổng tam quan — line art of a three-door temple gate. */
export function TempleGate({ className = '', strokeWidth = 1.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 240 140" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8 132 H232" />
      <path d="M14 136 H226" opacity="0.5" />
      {/* side gates */}
      <path d="M22 84 Q30 82 34 76 H76 Q80 82 86 84" />
      <path d="M34 76 Q55 70 76 76" />
      <path d="M36 84 V132 M74 84 V132" />
      <path d="M44 132 V104 Q55 93 66 104 V132" />
      <path d="M154 84 Q160 82 164 76 H206 Q210 82 218 84" />
      <path d="M164 76 Q185 70 206 76" />
      <path d="M166 84 V132 M204 84 V132" />
      <path d="M174 132 V104 Q185 93 196 104 V132" />
      {/* central gate */}
      <path d="M64 64 Q76 62 82 54 H158 Q164 62 176 64" />
      <path d="M82 54 Q120 45 158 54" />
      <path d="M92 64 V132 M148 64 V132" />
      <path d="M100 132 V88 Q120 68 140 88 V132" />
      <path d="M104 36 V54 M136 36 V54 M112 40 H128 M112 48 H128" />
      <path d="M84 37 Q92 35 96 28 H144 Q148 35 156 37" />
      <path d="M96 28 Q120 21 144 28" />
      <path d="M120 22 V14" />
      <circle cx="120" cy="11" r="3" />
      <path d="M58 66 Q60 60 64 64 M182 66 Q180 60 176 64 M80 39 Q82 33 84 37 M160 39 Q158 33 156 37" />
    </svg>
  )
}

/** Hồi văn — a band of the square-meander pattern used on beams and stelae. */
export function MeanderBand({ className = '', height = 14 }: { className?: string; height?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} width="100%" height={height} aria-hidden="true">
      <defs>
        <pattern id={`m-${id}`} width="28" height={height} patternUnits="userSpaceOnUse">
          <path
            d={`M0 ${height - 2} H20 V2 H6 V${height - 6} H14 V7`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#m-${id})`} />
    </svg>
  )
}

/** A short ornamental rule: hairline, a lotus-diamond, hairline. */
export function OrnamentRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-10 bg-current opacity-60" />
      <svg viewBox="0 0 24 12" className="h-3 w-6" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 1 L17 6 L12 11 L7 6 Z" />
        <circle cx="2.5" cy="6" r="1.4" />
        <circle cx="21.5" cy="6" r="1.4" />
      </svg>
      <span className="h-px w-10 bg-current opacity-60" />
    </div>
  )
}

/**
 * Mái đình — a curved temple-roof crest that rises out of a panel's top edge.
 * Place it centred, with its bottom 12px overlapping the panel: `absolute left-1/2 -top-12 -translate-x-1/2`.
 * The outer line sits on the panel's 1px edge and the inner one on a line 8px inside it.
 * `fill` must match the panel background so the panel's double border runs on into the roof.
 */
export function RoofCrest({ className = '', fill = 'var(--color-paper)' }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 300 60" width="300" height="60" fill="none" className={className} aria-hidden="true">
      {/* body: covers the panel's two border lines under the roof */}
      <path d="M0 48.5 C20 48.5 34 43 42 31 Q62 35 86 23 L102 13 H198 L214 23 Q238 35 258 31 C266 43 280 48.5 300 48.5 V60 H0 Z" fill={fill} />
      <g stroke="var(--color-gold-soft)" strokeLinecap="round" strokeLinejoin="round">
        {/* outer roof line, continuing the panel border */}
        <path d="M0 48.5 C20 48.5 34 43 42 31 Q62 35 86 23 L102 13 H198 L214 23 Q238 35 258 31 C266 43 280 48.5 300 48.5" strokeWidth="1.2" />
        {/* inner roof line, continuing the inset border */}
        <path d="M8 56.5 C26 56.5 40 52 48 40 Q66 43 90 31 L106 21 H194 L210 31 Q234 43 252 40 C260 52 274 56.5 292 56.5" strokeWidth="1" opacity="0.7" />
        {/* upturned eave tips */}
        <path d="M42 31 Q38 26 32 25 M258 31 Q262 26 268 25" strokeWidth="1.2" />
        {/* ridge horns */}
        <path d="M102 13 Q98 7 92 6 M198 13 Q202 7 208 6" strokeWidth="1.2" />
        {/* tiles on the roof face */}
        <path d="M118 21 V13 M134 21 V13 M166 21 V13 M182 21 V13" strokeWidth="0.8" opacity="0.5" />
      </g>
      {/* ridge pearl */}
      <path d="M150 4 L155 9 L150 14 L145 9 Z" fill={fill} stroke="var(--color-gold)" strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="150" cy="9" r="1.4" fill="var(--color-gold)" />
      {/* plaque under the ridge */}
      <rect x="138" y="28" width="24" height="12" rx="2" stroke="var(--color-gold)" strokeWidth="1" opacity="0.8" />
      <path d="M143 34 H157" stroke="var(--color-gold)" strokeWidth="0.9" opacity="0.7" />
    </svg>
  )
}

/** A corner flourish for framed panels — a stepped bracket with a small curl. Rotate it per corner. */
export function CornerFlourish({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 26 V8 Q2 2 8 2 H26" />
      <path d="M7 26 V12 Q7 7 12 7 H26" opacity="0.55" />
      <path d="M12 14 Q12 12 14 12 Q16 12 16 14 Q16 16 14 16" />
    </svg>
  )
}

/** Lotus seal used as the portal's mark. */
export function LotusSeal({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" />
      <circle cx="24" cy="24" r="18.5" opacity="0.55" />
      <path d="M24 13 C28 18 28 25 24 31 C20 25 20 18 24 13 Z" />
      <path d="M24 31 C19 30 15 26 14 20 C18 21 21 24 24 31 Z" />
      <path d="M24 31 C29 30 33 26 34 20 C30 21 27 24 24 31 Z" />
      <path d="M15 34 H33" />
      <path d="M18 37 H30" opacity="0.7" />
    </svg>
  )
}

/**
 * A line-art illustration drawn on white (or on black, with `light`). Blending drops the
 * background, so only the strokes show on paper (multiply) or on the red bands (screen).
 */
export function LineArt({ src, className = '', light = false }: { src: string; className?: string; light?: boolean }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none select-none ${light ? 'mix-blend-screen' : 'mix-blend-multiply'} ${className}`}
    />
  )
}

/** A photo inside the heritage arch, with a gold hairline frame set inside it. */
export function ArchImage({
  src,
  alt,
  className = '',
  imgClassName = '',
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-t-[999px] bg-parchment ${className}`}>
      <img src={src} alt={alt} className={`h-full w-full object-cover ${imgClassName}`} />
      <div className="pointer-events-none absolute inset-2.5 rounded-t-[999px] border border-white/45" />
    </div>
  )
}
