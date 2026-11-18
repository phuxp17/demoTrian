import React from 'react'
import { TempleGate } from './Ornaments'
import { Breadcrumb } from './ui'

/** Ivory masthead for inner pages: breadcrumb, serif title, lead, optional tools (search, filters). */
export function PageHeader({
  crumbs,
  title,
  lead,
  children,
}: {
  crumbs: { label: string; onClick?: () => void }[]
  title: string
  lead?: string
  children?: React.ReactNode
}) {
  return (
    <section className="paper-grain relative overflow-hidden border-b border-line">
      <TempleGate className="pointer-events-none absolute -right-16 -bottom-6 hidden w-[560px] max-w-[90%] text-gold/15 sm:block" strokeWidth={1} />
      <div className="relative mx-auto max-w-7xl px-5 pt-6 pb-8 md:px-8 md:pt-10 md:pb-14">
        <Breadcrumb items={crumbs} />
        <h1 className="mt-4 max-w-3xl font-serif text-[1.95rem] leading-[1.15] text-balance sm:text-[2.2rem] md:mt-5 font-medium text-heritage-ink md:text-[3.1rem]">{title}</h1>
        {lead && <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed md:mt-4 md:text-[1.08rem] text-ink-soft">{lead}</p>}
        {children && <div className="mt-6 md:mt-8">{children}</div>}
      </div>
    </section>
  )
}
