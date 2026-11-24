export type AdminPage =
  | 'login'
  | 'work'
  | 'stats'
  | 'accounts'
  | 'accountEdit'
  | 'cemeteries'
  | 'cemeteryEdit'
  | 'soldiers'
  | 'soldierEdit'
  | 'mapEditor'
  | 'merit'
  | 'meritEdit'
  | 'families'
  | 'familyEdit'
  | 'redAddresses'
  | 'redAddressEdit'
  | 'articles'
  | 'articleEdit'
  | 'homeEditor'
  | 'media'
  | 'tour360'
  | 'reviews'
  | 'reviewDetail'
  | 'publicConfig'
  | 'import'
  | 'export'
  | 'logs'
  | 'categories'
  | 'settings'

export type AdminParams = { id?: string }
export type AdminNavigate = (page: AdminPage, params?: AdminParams) => void

export type NavItem = { label: string; page: AdminPage; group: AdminPage[]; count?: number }
export type NavSection = { title: string; items: NavItem[] }

export const ADMIN_NAV: NavSection[] = [
  {
    title: 'Tổng quan',
    items: [
      { label: 'Công việc', page: 'work', group: ['work'], count: 14 },
      { label: 'Thống kê', page: 'stats', group: ['stats'] },
    ],
  },
  {
    title: 'Hồ sơ',
    items: [
      { label: 'Nghĩa trang', page: 'cemeteries', group: ['cemeteries', 'cemeteryEdit'] },
      { label: 'Liệt sĩ & phần mộ', page: 'soldiers', group: ['soldiers', 'soldierEdit'] },
      { label: 'Sơ đồ nghĩa trang', page: 'mapEditor', group: ['mapEditor'] },
      { label: 'Người có công', page: 'merit', group: ['merit', 'meritEdit'] },
      { label: 'Địa chỉ gia đình', page: 'families', group: ['families', 'familyEdit'] },
      { label: 'Địa chỉ đỏ', page: 'redAddresses', group: ['redAddresses', 'redAddressEdit'] },
    ],
  },
  {
    title: 'Nội dung',
    items: [
      { label: 'Bài viết', page: 'articles', group: ['articles', 'articleEdit'] },
      { label: 'Trang chủ', page: 'homeEditor', group: ['homeEditor'] },
      { label: 'Thư viện media', page: 'media', group: ['media'] },
      { label: 'Nội dung 360°', page: 'tour360', group: ['tour360'] },
    ],
  },
  {
    title: 'Kiểm duyệt',
    items: [
      { label: 'Hàng chờ duyệt', page: 'reviews', group: ['reviews', 'reviewDetail'], count: 9 },
      { label: 'Dữ liệu công khai', page: 'publicConfig', group: ['publicConfig'] },
    ],
  },
  {
    title: 'Dữ liệu',
    items: [
      { label: 'Nhập Excel', page: 'import', group: ['import'] },
      { label: 'Xuất dữ liệu', page: 'export', group: ['export'] },
      { label: 'Nhật ký hoạt động', page: 'logs', group: ['logs'] },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { label: 'Tài khoản', page: 'accounts', group: ['accounts', 'accountEdit'] },
      { label: 'Danh mục', page: 'categories', group: ['categories'] },
      { label: 'Cấu hình', page: 'settings', group: ['settings'] },
    ],
  },
]
