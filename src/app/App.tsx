import React from 'react'
import PortalApp from './PortalApp'

const AdminApp = React.lazy(() => import('@/modules/admin/AdminApp'))

export default function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  if (path === '/admin' || path === '/admin/') {
    return (
      <React.Suspense fallback={<p role="status" className="p-6 text-sm">Đang tải trang quản trị…</p>}>
        <AdminApp />
      </React.Suspense>
    )
  }

  return <PortalApp />
}
