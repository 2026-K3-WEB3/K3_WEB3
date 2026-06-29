'use client'

import dynamic from 'next/dynamic'

const AdminApp = dynamic(() => import('@/components/ra-admin/AdminApp'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f0f1a', color: '#a5b4fc', fontFamily: 'Inter, sans-serif' }}>
      Chargement du panneau admin…
    </div>
  ),
})

export default function RaAdminPage() {
  return <AdminApp />
}
