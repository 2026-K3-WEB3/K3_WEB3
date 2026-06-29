'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Calendar, Users, MapPin, Activity,
  LayoutDashboard, LogOut, Home, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Événements', icon: Calendar },
  { href: '/admin/sessions', label: 'Sessions', icon: Activity },
  { href: '/admin/speakers', label: 'Intervenants', icon: Users },
  { href: '/admin/rooms', label: 'Salles', icon: MapPin },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  if (pathname === '/admin/login') {
    return null
  }

  return (
    <aside
      style={{
        width: '260px',
        minHeight: '100vh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'background var(--transition-base), border-color var(--transition-base)',
      }}
    >
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            }}
          >
            <Calendar size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.875rem' }}>EventSync</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-from)', fontWeight: 600 }}>Administration</p>
          </div>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: active ? 700 : 500,
                textDecoration: 'none',
                color: active ? '#fff' : 'var(--text-secondary)',
                background: active ? 'linear-gradient(135deg, var(--accent-from), var(--accent-to))' : 'transparent',
                boxShadow: active ? '0 4px 15px rgba(99,102,241,0.35)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={14} style={{ opacity: 0.8 }} />}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
          className="link-accent"
        >
          <Home size={16} />
          Voir le site public
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            width: 'full',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.12)'
            e.currentTarget.style.color = '#f87171'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
