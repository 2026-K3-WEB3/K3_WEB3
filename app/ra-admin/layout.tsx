export const metadata = { title: 'Admin Panel — EventSync' }

export default function RaAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      {children}
    </div>
  )
}
