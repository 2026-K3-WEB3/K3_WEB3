import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin — EventSync',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        display: 'flex',
      }}
    >
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
