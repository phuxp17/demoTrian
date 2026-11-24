import React, { useId } from 'react'
import { GiltDefs } from './GiltDefs'

/**
 * Mái đình — a curved temple-roof crest that rises out of a panel's top edge.
 * Place it centred, with its bottom 12px overlapping the panel: `absolute left-1/2 -top-12 -translate-x-1/2`.
 */
export function RoofCrest({ className = '', fill = 'var(--color-paper)', gilt = true }: { className?: string; fill?: string; gilt?: boolean }) {
  const id = `rc-${useId().replace(/:/g, '')}`
  const strokeRef = gilt ? `url(#${id})` : 'var(--color-gold-soft)'
  return (
    <svg viewBox="0 0 300 60" width="300" height="60" fill="none" className={className} aria-hidden="true">
      {gilt && <GiltDefs id={id} />}
      <path d="M0 48.5 C20 48.5 34 43 42 31 Q62 35 86 23 L102 13 H198 L214 23 Q238 35 258 31 C266 43 280 48.5 300 48.5 V60 H0 Z" fill={fill} />
      <g stroke={strokeRef} strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 48.5 C20 48.5 34 43 42 31 Q62 35 86 23 L102 13 H198 L214 23 Q238 35 258 31 C266 43 280 48.5 300 48.5" strokeWidth="1.45" />
        <path d="M8 56.5 C26 56.5 40 52 48 40 Q66 43 90 31 L106 21 H194 L210 31 Q234 43 252 40 C260 52 274 56.5 292 56.5" strokeWidth="1.15" opacity="0.78" />
        <path d="M42 31 Q38 26 32 25 M258 31 Q262 26 268 25" strokeWidth="1.3" />
        <path d="M102 13 Q98 7 92 6 M198 13 Q202 7 208 6" strokeWidth="1.3" />
        <path d="M118 21 V13 M134 21 V13 M166 21 V13 M182 21 V13" strokeWidth="0.9" opacity="0.58" />
      </g>
      <path d="M150 4 L155 9 L150 14 L145 9 Z" fill={fill} stroke={gilt ? `url(#${id})` : 'var(--color-gold)'} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="150" cy="9" r="1.5" fill={gilt ? `url(#${id})` : 'var(--color-gold)'} />
      <rect x="138" y="28" width="24" height="12" rx="2" stroke={gilt ? `url(#${id})` : 'var(--color-gold)'} strokeWidth="1.1" opacity="0.9" />
      <path d="M143 34 H157" stroke={gilt ? `url(#${id})` : 'var(--color-gold)'} strokeWidth="1" opacity="0.8" />
    </svg>
  )
}
