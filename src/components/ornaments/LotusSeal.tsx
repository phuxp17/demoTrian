import React, { useId } from 'react'
import { GiltDefs } from './GiltDefs'

/** Lotus seal used as the portal's mark. */
export function LotusSeal({ className = '', gilt = true }: { className?: string; gilt?: boolean }) {
  const id = `ls-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke={gilt ? `url(#${id})` : 'currentColor'} strokeWidth="1.6" strokeLinejoin="round" className={className} aria-hidden="true">
      {gilt && <GiltDefs id={id} />}
      <circle cx="24" cy="24" r="22" />
      <circle cx="24" cy="24" r="18.5" opacity="0.62" />
      <path d="M24 13 C28 18 28 25 24 31 C20 25 20 18 24 13 Z" />
      <path d="M24 31 C19 30 15 26 14 20 C18 21 21 24 24 31 Z" />
      <path d="M24 31 C29 30 33 26 34 20 C30 21 27 24 24 31 Z" />
      <path d="M15 34 H33" />
      <path d="M18 37 H30" opacity="0.75" />
    </svg>
  )
}
