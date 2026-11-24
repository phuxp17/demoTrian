import React from 'react'

/**
 * A line-art illustration drawn on white (or on black, with `light`). Blending drops the
 * background, so only the strokes show on paper (adaptive multiply/screen) or on the red bands (screen).
 */
export function LineArt({ src, className = '', light = false }: { src: string; className?: string; light?: boolean }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none select-none ${light ? 'mix-blend-screen' : 'portal-lineart'} ${className}`}
    />
  )
}
