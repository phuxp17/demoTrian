export type PageKey =
  | 'home'
  | 'about'
  | 'news'
  | 'article'
  | 'search'
  | 'cemeteries'
  | 'cemetery'
  | 'soldiers'
  | 'soldier'
  | 'graveMap'
  | 'viewer360'
  | 'merit'
  | 'biography'
  | 'families'
  | 'family'
  | 'redAddresses'
  | 'redAddress'
  | 'memorialMap'
  | 'library'

/** What a link carries to the next page: the record it opens, or the words to search for. */
export type NavParams = { id?: string; query?: string }

export type Navigate = (page: PageKey, params?: NavParams) => void

export const MAIN_NAV: { label: string; page: PageKey; group: PageKey[] }[] = [
  { label: 'Tra cứu liệt sĩ', page: 'soldiers', group: ['soldiers', 'soldier', 'graveMap'] },
  { label: 'Nghĩa trang', page: 'cemeteries', group: ['cemeteries', 'cemetery', 'viewer360'] },
  { label: 'Người có công', page: 'merit', group: ['merit', 'biography', 'families', 'family'] },
  { label: 'Địa chỉ đỏ', page: 'redAddresses', group: ['redAddresses', 'redAddress'] },
  { label: 'Bản đồ tri ân', page: 'memorialMap', group: ['memorialMap'] },
  { label: 'Tư liệu', page: 'library', group: ['library'] },
]

export const UTILITY_NAV: { label: string; page: PageKey; group: PageKey[] }[] = [
  { label: 'Giới thiệu', page: 'about', group: ['about'] },
  { label: 'Tin tức', page: 'news', group: ['news', 'article'] },
]
