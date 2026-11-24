import React, { useEffect, useRef, useState } from 'react'
import { Wrench } from 'lucide-react'
import type { NavParams, PageKey } from '@/config/portalNav'
import { applyPortalAttributes, usePortalSettings } from '@/services/settings'

import HomePage from '@/pages/portal/home/HomePage'
import AboutPage from '@/pages/portal/AboutPage'
import NewsPage from '@/pages/portal/NewsPage'
import ArticlePage from '@/pages/portal/ArticlePage'
import SearchPage from '@/pages/portal/SearchPage'
import CemeteriesPage from '@/pages/portal/CemeteriesPage'
import CemeteryDetailPage from '@/pages/portal/CemeteryDetailPage'
import SoldiersPage from '@/pages/portal/SoldiersPage'
import SoldierProfilePage from '@/pages/portal/SoldierProfilePage'
import GraveMapPage from '@/pages/portal/GraveMapPage'
import Viewer360Page from '@/pages/portal/Viewer360Page'
import MeritPage from '@/pages/portal/MeritPage'
import BiographyPage from '@/pages/portal/BiographyPage'
import FamiliesPage from '@/pages/portal/FamiliesPage'
import FamilyDetailPage from '@/pages/portal/FamilyDetailPage'
import RedAddressesPage from '@/pages/portal/RedAddressesPage'
import RedAddressDetailPage from '@/pages/portal/RedAddressDetailPage'
import MemorialMapPage from '@/pages/portal/MemorialMapPage'
import LibraryPage from '@/pages/portal/LibraryPage'

const PAGES: Record<PageKey, React.ComponentType<any>> = {
  home: HomePage,
  about: AboutPage,
  news: NewsPage,
  article: ArticlePage,
  search: SearchPage,
  cemeteries: CemeteriesPage,
  cemetery: CemeteryDetailPage,
  soldiers: SoldiersPage,
  soldier: SoldierProfilePage,
  graveMap: GraveMapPage,
  viewer360: Viewer360Page,
  merit: MeritPage,
  biography: BiographyPage,
  families: FamiliesPage,
  family: FamilyDetailPage,
  redAddresses: RedAddressesPage,
  redAddress: RedAddressDetailPage,
  memorialMap: MemorialMapPage,
  library: LibraryPage,
}

function initialPortalPage(): PageKey {
  if (typeof window === 'undefined') return 'home'
  const page = new URLSearchParams(window.location.search).get('page') as PageKey | null
  return page && page in PAGES ? page : 'home'
}

export default function PortalApp() {
  const [route, setRoute] = useState<{ page: PageKey; params: NavParams; visit: number }>(() => ({
    page: initialPortalPage(),
    params: {},
    visit: 0,
  }))
  const topRef = useRef<HTMLDivElement>(null)
  const settings = usePortalSettings()

  useEffect(() => {
    applyPortalAttributes(settings.display, true)
    document.title = settings.display.siteTitle
  }, [settings.display])

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start' })
    window.scrollTo({ top: 0 })
  }, [route.visit])

  const navigate = (page: PageKey, params: NavParams = {}) =>
    setRoute((prev) => ({ page, params, visit: prev.visit + 1 }))

  if (settings.data.maintenance) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 py-16 text-center font-sans text-ink">
        <div className="portal-gilt-card max-w-lg rounded-[18px] p-8 sm:p-10">
          <span className="portal-gold-badge mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full">
            <Wrench className="h-6 w-6" />
          </span>
          <h1 className="font-serif text-3xl font-semibold text-heritage-ink">{settings.display.siteTitle} đang bảo trì</h1>
          <p className="mt-3 leading-relaxed text-ink-soft">{settings.data.maintenanceMessage}</p>
          <p className="mt-4 text-sm text-ink-mute">{settings.contact.orgName} · {settings.contact.phone}</p>
          <a href="/admin" className="portal-btn-primary mt-7 inline-flex h-11 items-center rounded-[10px] px-5 text-sm font-semibold">
            Vào trang quản trị
          </a>
        </div>
      </div>
    )
  }

  const extraProps: Record<string, string> = {}
  if (route.params.id) extraProps.recordId = route.params.id
  if (route.params.query !== undefined) extraProps.query = route.params.query

  const PageComponent = PAGES[route.page]
  return (
    <div ref={topRef} className="min-h-full w-full">
      <PageComponent key={route.visit} onNavigate={navigate} {...extraProps} />
    </div>
  )
}
