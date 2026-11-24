import React from 'react'

/** Shared metallic gold-foil SVG gradient using CSS custom properties so it responds to theme & metallic settings. */
export function GiltDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--gilt-s1, #9a7026)" />
        <stop offset="32%" stopColor="var(--gilt-s2, #f7e5ae)" />
        <stop offset="56%" stopColor="var(--gilt-s3, #d5ab5b)" />
        <stop offset="80%" stopColor="var(--gilt-s4, #fff1c6)" />
        <stop offset="100%" stopColor="var(--gilt-s5, #8b601e)" />
      </linearGradient>
    </defs>
  )
}
