import React, { useEffect, useRef, useState } from 'react'
import type { NavParams, PageKey } from '../shared/nav'

import Home from '../Home.frame'
import About from '../About.frame'
import News from '../News.frame'
import Article from '../Article.frame'
import SearchPage from '../SearchPage.frame'
import Cemeteries from '../Cemeteries.frame'
import CemeteryDetail from '../CemeteryDetail.frame'
import Soldiers from '../Soldiers.frame'
import SoldierProfile from '../SoldierProfile.frame'
import GraveMap from '../GraveMap.frame'
import Viewer360 from '../Viewer360.frame'
import Merit from '../Merit.frame'
import Biography from '../Biography.frame'
import Families from '../Families.frame'
import FamilyDetail from '../FamilyDetail.frame'
import RedAddresses from '../RedAddresses.frame'
import RedAddressDetail from '../RedAddressDetail.frame'
import MemorialMapPage from '../MemorialMapPage.frame'
import Library from '../Library.frame'

/** The size every frame draws at, unless one exports its own. */
export const viewport = 'web'

export const folders = [
  { id: 'chung', name: 'Trang chung', frames: ['2Ks9E44Dbrd5o8RqohKsah', '5xUymG5J3Ehw7u6eg74kmN', 'cCkYp1LXsNi29QEFpQttax', '3Xzphx9unUZdvis8pZLFJv', '1itQyCYxnf7AmBxYquBmNA'] },
  { id: 'liet-si', name: 'Nghĩa trang & Liệt sĩ', frames: ['6Fqu9vnjVC9wxXgW5ak47c', 'u4YiFYhvCHg6K9LQUTrZ6p', '6sbthhbxAB7zsEqaTuL7Vh', 'fxmAUywF6RFgVkwwxJB6hS', '9PYHtPadBoDfNvKa3mAGGU', 'fd2qZ5C494NEVctMrrhNHs'] },
  { id: 'nguoi-co-cong', name: 'Người có công', frames: ['kFViCsHDfuab7Mo2w2GgzJ', 'd619EWB9B1GxgffSxxVjci', 'wYZBBa1a8a1nkcMrydy4rD', 'nWcYQWJWWfYexjDc66UJVJ'] },
  { id: 'dia-chi-do', name: 'Địa chỉ đỏ & Tư liệu', frames: ['bHryEnYVUxEDtRtz8hD4eq', 'bcoDMX1DMqAcQNcBURZXZE', 'mcAAFadaRQP4M99xUKsVD5', '8qvYwUhE8gHyXk4a6qqEHS'] },
]

const PAGES: Record<PageKey, { id: string; C: React.ComponentType<any> }> = {
  home: { id: '2Ks9E44Dbrd5o8RqohKsah', C: Home },
  about: { id: '5xUymG5J3Ehw7u6eg74kmN', C: About },
  news: { id: 'cCkYp1LXsNi29QEFpQttax', C: News },
  article: { id: '3Xzphx9unUZdvis8pZLFJv', C: Article },
  search: { id: '1itQyCYxnf7AmBxYquBmNA', C: SearchPage },
  cemeteries: { id: '6Fqu9vnjVC9wxXgW5ak47c', C: Cemeteries },
  cemetery: { id: 'u4YiFYhvCHg6K9LQUTrZ6p', C: CemeteryDetail },
  soldiers: { id: '6sbthhbxAB7zsEqaTuL7Vh', C: Soldiers },
  soldier: { id: 'fxmAUywF6RFgVkwwxJB6hS', C: SoldierProfile },
  graveMap: { id: '9PYHtPadBoDfNvKa3mAGGU', C: GraveMap },
  viewer360: { id: 'fd2qZ5C494NEVctMrrhNHs', C: Viewer360 },
  merit: { id: 'kFViCsHDfuab7Mo2w2GgzJ', C: Merit },
  biography: { id: 'd619EWB9B1GxgffSxxVjci', C: Biography },
  families: { id: 'wYZBBa1a8a1nkcMrydy4rD', C: Families },
  family: { id: 'nWcYQWJWWfYexjDc66UJVJ', C: FamilyDetail },
  redAddresses: { id: 'bHryEnYVUxEDtRtz8hD4eq', C: RedAddresses },
  redAddress: { id: 'bcoDMX1DMqAcQNcBURZXZE', C: RedAddressDetail },
  memorialMap: { id: 'mcAAFadaRQP4M99xUKsVD5', C: MemorialMapPage },
  library: { id: '8qvYwUhE8gHyXk4a6qqEHS', C: Library },
}

const keyForId = (id?: string): PageKey => {
  const hit = (Object.keys(PAGES) as PageKey[]).find((k) => PAGES[k].id === id)
  return hit ?? 'home'
}

export default function TriAnThuLam(props: { start?: string }) {
  const [route, setRoute] = useState<{ page: PageKey; params: NavParams; n: number }>(() => ({ page: keyForId(props.start), params: {}, n: 0 }))
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => {
    top.current?.scrollIntoView({ block: 'start' })
    window.scrollTo({ top: 0 })
  }, [route.n])

  const navigate = (page: PageKey, params: NavParams = {}) => setRoute((r) => ({ page, params, n: r.n + 1 }))

  // Only pass what the link carried, so a frame's own args still fill the rest.
  const extra: Record<string, string> = {}
  if (route.params.id) extra.recordId = route.params.id
  if (route.params.query !== undefined) extra.query = route.params.query

  const { C } = PAGES[route.page]
  return (
    <div ref={top} className="min-h-full w-full">
      <C key={route.n} onNavigate={navigate} {...extra} />
    </div>
  )
}
