import React, { useId } from 'react'
import { GiltDefs } from './GiltDefs'

/** A corner flourish for framed panels — a stepped bracket with a small curl. Rotate it per corner. */
export function CornerFlourish({ className = '', gilt = true }: { className?: string; gilt?: boolean }) {
  const id = `cf-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke={gilt ? `url(#${id})` : 'currentColor'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {gilt && <GiltDefs id={id} />}
      <path d="M2 26 V8 Q2 2 8 2 H26" />
      <path d="M7 26 V12 Q7 7 12 7 H26" opacity="0.6" />
      <path d="M12 14 Q12 12 14 12 Q16 12 16 14 Q16 16 14 16" />
    </svg>
  )
}
