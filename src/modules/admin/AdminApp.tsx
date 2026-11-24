import React, { useEffect, useState } from 'react'
import type { AdminNavigate, AdminPage, AdminParams } from '@/config/adminNav'
import { applyPortalAttributes, DEFAULT_SETTINGS } from '@/services/settings'

import AccountFormScreen from './screens/AccountFormScreen'
import AccountListScreen from './screens/AccountListScreen'
import ActivityLogScreen from './screens/ActivityLogScreen'
import AdminLoginScreen from './screens/AdminLoginScreen'
import ArticleEditorScreen from './screens/ArticleEditorScreen'
import ArticleListScreen from './screens/ArticleListScreen'
import CategoriesScreen from './screens/CategoriesScreen'
import CemeteryFormScreen from './screens/CemeteryFormScreen'
import CemeteryListScreen from './screens/CemeteryListScreen'
import ExportDataScreen from './screens/ExportDataScreen'
import FamilyFormScreen from './screens/FamilyFormScreen'
import FamilyListScreen from './screens/FamilyListScreen'
import HomeEditorScreen from './screens/HomeEditorScreen'
import ImportExcelScreen from './screens/ImportExcelScreen'
import MapEditorScreen from './screens/map-editor/MapEditorScreen'
import MediaLibraryScreen from './screens/MediaLibraryScreen'
import MeritFormScreen from './screens/MeritFormScreen'
import MeritListScreen from './screens/MeritListScreen'
import PublicDataConfigScreen from './screens/PublicDataConfigScreen'
import RedAddressFormScreen from './screens/RedAddressFormScreen'
import RedAddressListScreen from './screens/RedAddressListScreen'
import ReviewDetailScreen from './screens/ReviewDetailScreen'
import ReviewQueueScreen from './screens/ReviewQueueScreen'
import SettingsScreen from './screens/settings/SettingsScreen'
import SoldierFormScreen from './screens/SoldierFormScreen'
import SoldierListScreen from './screens/SoldierListScreen'
import StatsDashboardScreen from './screens/StatsDashboardScreen'
import Tour360ConfigScreen from './screens/Tour360ConfigScreen'
import WorkDashboardScreen from './screens/WorkDashboardScreen'

const PAGES: Record<AdminPage, React.ComponentType<{ onNavigate: AdminNavigate; recordId?: string }>> = {
  login: AdminLoginScreen,
  work: WorkDashboardScreen,
  stats: StatsDashboardScreen,
  accounts: AccountListScreen,
  accountEdit: AccountFormScreen,
  cemeteries: CemeteryListScreen,
  cemeteryEdit: CemeteryFormScreen,
  soldiers: SoldierListScreen,
  soldierEdit: SoldierFormScreen,
  mapEditor: MapEditorScreen,
  merit: MeritListScreen,
  meritEdit: MeritFormScreen,
  families: FamilyListScreen,
  familyEdit: FamilyFormScreen,
  redAddresses: RedAddressListScreen,
  redAddressEdit: RedAddressFormScreen,
  articles: ArticleListScreen,
  articleEdit: ArticleEditorScreen,
  homeEditor: HomeEditorScreen,
  media: MediaLibraryScreen,
  tour360: Tour360ConfigScreen,
  reviews: ReviewQueueScreen,
  reviewDetail: ReviewDetailScreen,
  publicConfig: PublicDataConfigScreen,
  import: ImportExcelScreen,
  export: ExportDataScreen,
  logs: ActivityLogScreen,
  categories: CategoriesScreen,
  settings: SettingsScreen,
}

function initialAdminPage(): AdminPage {
  if (typeof window === 'undefined') return 'login'
  const p = new URLSearchParams(window.location.search).get('page') as AdminPage | null
  return p && p in PAGES ? p : 'login'
}

export default function AdminApp() {
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
