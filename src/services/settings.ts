import { useEffect, useState } from 'react'

export type ThemeId = 'upgraded-current' | 'ivory-lacquer-gold' | 'lacquer-gold' | 'current-reference'

export type ThemeMeta = {
  id: ThemeId
  name: string
  subtitle: string
  description: string
  swatches: [string, string, string, string]
  isDark?: boolean
}

export const PORTAL_THEMES: ThemeMeta[] = [
  {
    id: 'upgraded-current',
    name: 'Sơn Son Hoàng Kim',
    subtitle: 'Mặc định · Nâng cấp bản hiện tại',
    description: 'Giữ sắc đỏ – ngà truyền thống, nâng cấp sơn son lụa sâu và ánh kim vàng quỳ bóng.',
    swatches: ['#7E1B20', '#F8F4EB', '#E4BE6E', '#450C0F'],
  },
  {
    id: 'ivory-lacquer-gold',
    name: 'Ngà Cổ – Sơn Mài Cánh Gián',
    subtitle: 'Cổ điển · Gỗ gụ & thếp vàng',
    description: 'Header sơn mài cánh gián trầm bóng, nền ngà lụa ấm và điểm nhấn huyết dụ.',
    swatches: ['#281411', '#F7F2E7', '#DFBA6E', '#7E1F22'],
  },
  {
    id: 'lacquer-gold',
    name: 'Sơn Son – Vàng Quỳ Hoàng Thành',
    subtitle: 'Nền tối · Nghi lễ thắp nến',
    description: 'Nền tối sơn mài bóng sâu, thanh sơn son trầm và họa tiết vàng quỳ tỏa sáng.',
    swatches: ['#18100E', '#4F1215', '#E8C97E', '#F3EAD8'],
    isDark: true,
  },
  {
    id: 'current-reference',
    name: 'Bản gốc truyền thống',
    subtitle: 'Đối chiếu giao diện cũ',
    description: 'Thanh đỏ kính #b3262a, nền kem sáng #fbf7ef và viền vàng lì ban đầu.',
    swatches: ['#B3262A', '#FBF7EF', '#A52B2B', '#A8834A'],
  },
]

export type PortalSettings = {
  contact: {
    orgName: string
    address: string
    phone: string
    email: string
    hours: string
    supportOfficer: string
    supportPhone: string
    searchNote: string
  }
  display: {
    theme: ThemeId
    metallicGold: boolean
    softStyle: boolean
    showThemeSwitcher: boolean
    siteTitle: string
    siteSubtitle: string
    motto: string
    language: string
    pageSize: string
    mapBase: string
    candle: boolean
    flowers: boolean
    comments: boolean
    birthYear: boolean
  }
  data: {
    maintenance: boolean
    maintenanceMessage: string
    sections: Record<'soldiers' | 'merit' | 'families' | 'red' | 'tour', boolean>
  }
  updatedAt?: string
}

export const DEFAULT_SETTINGS: PortalSettings = {
  contact: {
    orgName: 'Ban quản lý cổng thông tin — xã Thư Lâm, TP. Hà Nội',
    address: 'Thôn Thụy Lâm, xã Thư Lâm, TP. Hà Nội',
    phone: '(đang cập nhật)',
    email: '(đang cập nhật)',
    hours: 'Thứ Hai – Thứ Sáu, 7:30 – 17:00',
    supportOfficer: 'Nguyễn Thị Hằng – Công chức LĐ-TB&XH',
    supportPhone: '0912 345 678',
    searchNote: 'Nếu chưa tìm thấy thông tin liệt sĩ, xin liên hệ bộ phận Một cửa UBND xã để được hỗ trợ đối chiếu hồ sơ.',
  },
  display: {
    theme: 'upgraded-current',
    metallicGold: true,
    softStyle: true,
    showThemeSwitcher: false,
    siteTitle: 'Tri ân Thư Lâm',
    siteSubtitle: 'Cổng thông tin tưởng niệm',
    motto: 'Uống nước nhớ nguồn — Tổ quốc ghi công',
    language: 'Tiếng Việt',
    pageSize: '20',
    mapBase: 'OpenStreetMap',
    candle: true,
    flowers: true,
    comments: false,
    birthYear: true,
  },
  data: {
    maintenance: false,
    maintenanceMessage: 'Hệ thống đang cập nhật dữ liệu nghĩa trang, dự kiến mở lại lúc 17:00 hôm nay.',
    sections: {
      soldiers: true,
      merit: true,
      families: false,
      red: true,
      tour: true,
    },
  },
}

const STORAGE_KEY = 'triAnThuLam.settings.v1'
const CHANGE_EVENT = 'triAnThuLam:settings-changed'

const VALID_THEMES = new Set<ThemeId>(PORTAL_THEMES.map((t) => t.id))

function mergeSettings(raw: Partial<PortalSettings> | null | undefined): PortalSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS
  const theme = raw.display?.theme && VALID_THEMES.has(raw.display.theme) ? raw.display.theme : DEFAULT_SETTINGS.display.theme
  return {
    contact: { ...DEFAULT_SETTINGS.contact, ...(raw.contact ?? {}) },
    display: { ...DEFAULT_SETTINGS.display, ...(raw.display ?? {}), theme },
    data: {
      ...DEFAULT_SETTINGS.data,
      ...(raw.data ?? {}),
      sections: { ...DEFAULT_SETTINGS.data.sections, ...(raw.data?.sections ?? {}) },
    },
    updatedAt: raw.updatedAt,
  }
}

export function loadSettings(): PortalSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<PortalSettings>) : null
    const merged = mergeSettings(parsed)

    const paramTheme = new URLSearchParams(window.location.search).get('theme') as ThemeId | null
    if (paramTheme && VALID_THEMES.has(paramTheme)) {
      merged.display.theme = paramTheme
    }
    return merged
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(next: PortalSettings): PortalSettings {
  const stamped: PortalSettings = {
    ...mergeSettings(next),
    updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped))
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: stamped }))
    } catch {
      /* ignore storage quota issues in restricted embeds */
    }
  }
  return stamped
}

export function resetSettings(): PortalSettings {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: DEFAULT_SETTINGS }))
    } catch {
      /* ignore */
    }
  }
  return DEFAULT_SETTINGS
}

export function setPortalTheme(theme: ThemeId): PortalSettings {
  const current = loadSettings()
  return saveSettings({
    ...current,
    display: { ...current.display, theme },
  })
}

/** Applies public portal theme attributes to <html> when viewing the public portal. */
export function applyPortalAttributes(display: PortalSettings['display'], enabled = true) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (!enabled) {
    delete root.dataset.portalTheme
    delete root.dataset.metallic
    delete root.dataset.soft
    return
  }
  root.dataset.portalTheme = display.theme
  root.dataset.metallic = display.metallicGold ? 'on' : 'off'
  root.dataset.soft = display.softStyle ? 'on' : 'off'
}

/** Subscribes a React component to live PortalSettings updates across both public & admin views. */
export function usePortalSettings(): PortalSettings {
  const [settings, setSettings] = useState<PortalSettings>(() => loadSettings())

  useEffect(() => {
    const refresh = () => setSettings(loadSettings())
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<PortalSettings>).detail
      setSettings(detail ? mergeSettings(detail) : loadSettings())
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh()
    }
    window.addEventListener(CHANGE_EVENT, onCustom)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onCustom)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return settings
}
