import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin — EventSync',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', transition: 'background var(--transition-base), color var(--transition-base)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
