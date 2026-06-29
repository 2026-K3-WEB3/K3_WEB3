import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Activity, Clock } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminSessionsPage() {
  const sessions = await prisma.session.findMany({
    include: {
      event: true,
      room: true,
      speakers: { include: { speaker: true } },
    },
    orderBy: { startTime: 'desc' },
  })

  const now = new Date()

  const formatTime = (d: Date) =>
    new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Sessions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link href="/admin/sessions/new" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
          <Plus size={16} />
          Nouvelle session
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
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <Activity size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Aucune session créée</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Session</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Horaire</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Salle</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Intervenants</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const isLive = now >= session.startTime && now <= session.endTime
                  return (
                    <tr key={session.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }} className="table-row-hover">
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{session.title}</p>
                          {isLive && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '99px',
                                background: 'rgba(239,68,68,0.12)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: '#f87171',
                              }}
                              className="animate-pulse"
                            >
                              LIVE
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{session.event.title}</p>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          <Clock size={14} style={{ color: 'var(--accent-from)', flexShrink: 0 }} />
                          {formatDate(session.startTime)} · {formatTime(session.startTime)}–{formatTime(session.endTime)}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{session.room?.name ?? '—'}</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {session.speakers.map(({ speaker }) => (
                            <span
                              key={speaker.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.15rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(99,102,241,0.08)',
                                border: '1px solid rgba(99,102,241,0.2)',
                                fontSize: '0.75rem',
                                color: '#a5b4fc',
                              }}
                            >
                              {speaker.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <Link
                            href={`/admin/sessions/${session.id}/edit`}
                            className="event-detail-link"
                            style={{ padding: '0.35rem 0.75rem' }}
                          >
                            <Pencil size={12} />
                            Modifier
                          </Link>
                          <DeleteButton id={session.id} title={session.title} endpoint="/api/sessions" />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
