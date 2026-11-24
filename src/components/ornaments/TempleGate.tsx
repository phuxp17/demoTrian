import React from 'react'

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
