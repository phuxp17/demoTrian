import { FAMILIES, MERIT, SOLDIERS, type Family } from '@/data/portal.mock'
import type { NavParams, PageKey } from '@/config/portalNav'

/** The profile page of the person a family is honoured for: a soldier, or a person of merit. */
export function honouredLink(f: Family): { page: PageKey; params: NavParams } | null {
  const s = SOLDIERS.find((x) => f.honoured.endsWith(x.name))
  if (s) return { page: 'soldier', params: { id: s.id } }
  const m = MERIT.find((x) => f.honoured.endsWith(x.name))
  if (m) return { page: 'biography', params: { id: m.id } }
  return null
}

/** The family record that honours this person, by their full name. */
export function familyOf(name: string): Family | undefined {
  return FAMILIES.find((f) => f.honoured.endsWith(name))
}
