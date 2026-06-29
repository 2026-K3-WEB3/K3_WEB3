import Link from 'next/link'
import { Calendar } from 'lucide-react'

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Calendar size={18} style={{ color: 'var(--accent-from)' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>EventSync</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Gestion d&apos;événements en temps réel.
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Navigation
          </span>
          {[
            { href: '/', label: 'Accueil' },
            { href: '/speakers', label: 'Intervenants' },
            { href: '/favorites', label: 'Favoris' },
            { href: '/admin', label: 'Admin' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Légal
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} EventSync.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Tous droits réservés.
          </p>
        </div>
      </div>

      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--accent-from), var(--accent-to), transparent)',
          opacity: 0.4,
        }}
      />
    </footer>
  )
}
