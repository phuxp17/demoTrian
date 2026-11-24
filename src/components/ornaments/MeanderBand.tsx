import React, { useId } from 'react'

/** Hồi văn — a band of the square-meander pattern used on beams and stelae. */
export function MeanderBand({ className = '', height = 14, gilt = false }: { className?: string; height?: number; gilt?: boolean }) {
  const id = useId().replace(/:/g, '')
  const gradId = `mg-${id}`
  return (
    <svg className={className} width="100%" height={height} aria-hidden="true">
      <defs>
        {gilt && (
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9b722b" />
            <stop offset="25%" stopColor="#f2dc9f" />
            <stop offset="50%" stopColor="#d4ab5c" />
            <stop offset="75%" stopColor="#f6e7bb" />
            <stop offset="100%" stopColor="#9b722b" />
          </linearGradient>
        )}
        <pattern id={`m-${id}`} width="28" height={height} patternUnits="userSpaceOnUse">
          <path
            d={`M0 ${height - 2} H20 V2 H6 V${height - 6} H14 V7`}
            fill="none"
            stroke={gilt ? `url(#${gradId})` : 'currentColor'}
            strokeOpacity={gilt ? 0.58 : undefined}
            strokeWidth="1.3"
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#m-${id})`} />
    </svg>
  )
}
