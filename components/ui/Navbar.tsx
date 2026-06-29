'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Home, Users, Star } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/speakers', label: 'Intervenants', icon: Users },
    { href: '/favorites', label: 'Favoris', icon: Star },
  ]

  const navbarStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(15,15,26,0.7)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid var(--border-subtle)',
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  }

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 800,
    fontSize: '1.2rem',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: 'opacity var(--transition-fast)',
  }

  const getLinkStyle = (href: string): React.CSSProperties => {
    const active = pathname === href
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.45rem 0.9rem',
      borderRadius: 'var(--radius-md)',
      fontSize: '0.9rem',
      fontWeight: 500,
      textDecoration: 'none',
      color: active ? '#a5b4fc' : 'var(--text-secondary)',
      background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
      borderBottom: active ? '2px solid var(--accent-from)' : '2px solid transparent',
      transition: 'all var(--transition-fast)',
    }
  }

  const adminBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.45rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecoration: 'none',
    background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
    color: '#fff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
    transition: 'all var(--transition-fast)',
  }

  return (
    <header style={navbarStyle}>
      <div style={containerStyle}>
        <Link href="/" style={logoStyle}>
          <Calendar size={20} style={{ color: 'var(--accent-from)', WebkitTextFillColor: 'var(--accent-from)' }} />
          <span>EventSync</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} style={getLinkStyle(href)}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/admin" style={adminBtnStyle} className="hidden md:inline-flex">
            Admin
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="flex md:hidden flex-col animate-slide-up"
          style={{
            background: 'rgba(15,15,26,0.95)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '0.75rem 1.5rem 1rem',
            gap: '0.25rem',
          }}
        >
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                ...getLinkStyle(href),
                padding: '0.7rem 0.9rem',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            style={{ ...adminBtnStyle, marginTop: '0.5rem', justifyContent: 'center' }}
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  )
}
