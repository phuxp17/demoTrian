import React, { useEffect, useState } from 'react'
import type { AdminNavigate, AdminPage, AdminParams } from '../shared/admin/nav'
import { applyPortalAttributes, DEFAULT_SETTINGS } from '../shared/settings'

import AdminLogin from './screens/AdminLogin'
import WorkDashboard from './screens/WorkDashboard'
import StatsDashboard from './screens/StatsDashboard'
import AccountList from './screens/AccountList'
import AccountForm from './screens/AccountForm'
import CemeteryList from './screens/CemeteryList'
import CemeteryForm from './screens/CemeteryForm'
import SoldierList from './screens/SoldierList'
import SoldierForm from './screens/SoldierForm'
import MapEditor from './screens/MapEditor'
import MeritList from './screens/MeritList'
import MeritForm from './screens/MeritForm'
import FamilyList from './screens/FamilyList'
import FamilyForm from './screens/FamilyForm'
import RedAddressList from './screens/RedAddressList'
import RedAddressForm from './screens/RedAddressForm'
import ArticleList from './screens/ArticleList'
import ArticleEditor from './screens/ArticleEditor'
import HomeEditor from './screens/HomeEditor'
import MediaLibrary from './screens/MediaLibrary'
import Tour360Config from './screens/Tour360Config'
import ReviewQueue from './screens/ReviewQueue'
import ReviewDetail from './screens/ReviewDetail'
import PublicDataConfig from './screens/PublicDataConfig'
import ImportExcel from './screens/ImportExcel'
import ExportData from './screens/ExportData'
import ActivityLog from './screens/ActivityLog'
import Categories from './screens/Categories'
import Settings from './screens/Settings'

const PAGES: Record<AdminPage, React.ComponentType<{ onNavigate: AdminNavigate; recordId?: string }>> = {
  login: AdminLogin,
  work: WorkDashboard,
  stats: StatsDashboard,
  accounts: AccountList,
  accountEdit: AccountForm,
  cemeteries: CemeteryList,
  cemeteryEdit: CemeteryForm,
  soldiers: SoldierList,
  soldierEdit: SoldierForm,
  mapEditor: MapEditor,
  merit: MeritList,
  meritEdit: MeritForm,
  families: FamilyList,
  familyEdit: FamilyForm,
  redAddresses: RedAddressList,
  redAddressEdit: RedAddressForm,
  articles: ArticleList,
  articleEdit: ArticleEditor,
  homeEditor: HomeEditor,
  media: MediaLibrary,
  tour360: Tour360Config,
  reviews: ReviewQueue,
  reviewDetail: ReviewDetail,
  publicConfig: PublicDataConfig,
  import: ImportExcel,
  export: ExportData,
  logs: ActivityLog,
  categories: Categories,
  settings: Settings,
}

function initialAdminPage(): AdminPage {
  if (typeof window === 'undefined') return 'login'
  const p = new URLSearchParams(window.location.search).get('page') as AdminPage | null
  return p && p in PAGES ? p : 'login'
}

export default function AdminDashboard() {
  const [route, setRoute] = useState<{ page: AdminPage; params: AdminParams; visit: number }>(() => ({
    page: initialAdminPage(),
    params: {},
    visit: 0,
  }))

  useEffect(() => {
    // Keep /admin in its clean light workspace palette regardless of public portal dark themes.
    applyPortalAttributes(DEFAULT_SETTINGS.display, false)
  }, [])

  const navigate: AdminNavigate = (page, params = {}) =>
    setRoute((previous) => ({ page, params, visit: previous.visit + 1 }))

  const Screen = PAGES[route.page]
  return <Screen key={route.visit} onNavigate={navigate} recordId={route.params.id} />
}
