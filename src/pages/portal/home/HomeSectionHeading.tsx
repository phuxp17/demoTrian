import React from 'react'
import { OrnamentRule } from '@/components/ornaments'

export function HomeSectionHeading({ title, lead, gilt }: { title: string; lead: string; gilt: boolean }) {
  return (
    <div className="max-w-2xl">
      <OrnamentRule gilt={gilt} className="mb-3 text-gold" />
      <h2 className="font-serif text-[2rem] leading-tight font-semibold text-heritage-ink sm:text-[2.45rem] md:text-[2.85rem]">{title}</h2>
      <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">{lead}</p>
    </div>
  )
}
