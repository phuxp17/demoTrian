import React, { useId } from 'react'
import { GiltDefs } from './GiltDefs'

/** A short ornamental rule: hairline, a lotus-diamond, hairline. */
export function OrnamentRule({ className = '', gilt = true }: { className?: string; gilt?: boolean }) {
  const id = `or-${useId().replace(/:/g, '')}`
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-11" style={{ background: gilt ? 'var(--portal-gold-foil, currentColor)' : 'currentColor', opacity: gilt ? 0.85 : 0.6 }} />
      <svg viewBox="0 0 24 12" className="h-3 w-6" fill="none" stroke={gilt ? `url(#${id})` : 'currentColor'} strokeWidth="1.25">
        {gilt && <GiltDefs id={id} />}
        <path d="M12 1 L17 6 L12 11 L7 6 Z" />
        <circle cx="2.5" cy="6" r="1.4" fill={gilt ? `url(#${id})` : 'none'} />
        <circle cx="21.5" cy="6" r="1.4" fill={gilt ? `url(#${id})` : 'none'} />
      </svg>
      <span className="h-px w-11" style={{ background: gilt ? 'var(--portal-gold-foil, currentColor)' : 'currentColor', opacity: gilt ? 0.85 : 0.6 }} />
    </div>
  )
}
