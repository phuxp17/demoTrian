import React from 'react'
import { SiteFooter, SiteHeader } from '@/components/layout'
import type { Navigate } from '@/config/portalNav'
import { usePortalSettings } from '@/services/settings'
import { ContributeSection } from './ContributeSection'
import { FeaturedMemorialSection } from './FeaturedMemorialSection'
import { HeroSearchSection } from './HeroSearchSection'
import { MemorialMapSection } from './MemorialMapSection'
import { MemorialSpacesSection } from './MemorialSpacesSection'
import { StoriesSection } from './StoriesSection'

type Props = {
  heroTitle?: string
  onNavigate?: Navigate
}

export default function HomePage({ heroTitle = 'Uống nước nhớ nguồn', onNavigate }: Props) {
  const { display } = usePortalSettings()
  const gilt = display.metallicGold && display.theme !== 'current-reference'
  const soft = display.softStyle && display.theme !== 'current-reference'

  return (
    <div className="min-h-full overflow-x-clip bg-paper font-sans text-ink">
      <SiteHeader active="home" onNavigate={onNavigate} />
      <HeroSearchSection heroTitle={heroTitle} gilt={gilt} soft={soft} onNavigate={onNavigate} />
      <FeaturedMemorialSection gilt={gilt} soft={soft} showCandle={display.candle} onNavigate={onNavigate} />
      <MemorialSpacesSection gilt={gilt} soft={soft} onNavigate={onNavigate} />
      <StoriesSection gilt={gilt} soft={soft} onNavigate={onNavigate} />
      <MemorialMapSection soft={soft} onNavigate={onNavigate} />
      <ContributeSection soft={soft} />
      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}
