import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Calendar, MapPin } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    include: { sessions: true },
    orderBy: { startDate: 'desc' },
  })

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Événements</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {events.length} événement{events.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link href="/admin/events/new" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
          <Plus size={16} />
          Nouvel événement
        </Link>
      </div>

      <div
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Aucun événement créé</p>
            <Link href="/admin/events/new" className="link-accent" style={{ marginTop: '0.75rem', display: 'inline-block', fontSize: '0.875rem' }}>
              Créer le premier événement →
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Événement</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Dates</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Lieu</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Sessions</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }} className="table-row-hover">
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{event.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={14} style={{ color: 'var(--accent-from)', flexShrink: 0 }} />
                        {formatDate(event.startDate)}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem', marginLeft: '1.25rem' }}>→ {formatDate(event.endDate)}</p>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={14} style={{ color: 'var(--accent-to)', flexShrink: 0 }} />
                        {event.location}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '99px',
                          background: 'rgba(99,102,241,0.12)',
                          border: '1px solid rgba(99,102,241,0.25)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#a5b4fc',
                        }}
                      >
                        {event.sessions.length} session{event.sessions.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link
                          href={`/events/${event.id}`}
                          target="_blank"
                          className="ext-link"
                          style={{ padding: '0.35rem 0.75rem' }}
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="event-detail-link"
                          style={{ padding: '0.35rem 0.75rem' }}
                        >
                          <Pencil size={12} />
                          Modifier
                        </Link>
                        <DeleteButton id={event.id} title={event.title} endpoint="/api/events" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
