import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Users } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminSpeakersPage() {
  const speakers = await prisma.speaker.findMany({
    include: { sessions: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Intervenants</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {speakers.length} intervenant{speakers.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link href="/admin/speakers/new" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
          <Plus size={16} />
          Nouvel intervenant
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
        {speakers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Aucun intervenant créé</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {speakers.map((speaker) => (
              <div
                key={speaker.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background var(--transition-fast)',
                }}
                className="table-row-hover"
              >
                {speaker.photo ? (
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                      border: '1px solid rgba(139,92,246,0.3)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {speaker.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{speaker.name}</p>
                  {speaker.bio && (
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.25rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {speaker.bio}
                    </p>
                  )}
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '99px',
                    background: 'rgba(139,92,246,0.12)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#c4b5fd',
                    flexShrink: 0,
                  }}
                >
                  {speaker.sessions.length} session{speaker.sessions.length !== 1 ? 's' : ''}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <Link
                    href={`/speakers/${speaker.id}`}
                    target="_blank"
                    className="ext-link"
                    style={{ padding: '0.35rem 0.75rem' }}
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/admin/speakers/${speaker.id}/edit`}
                    className="event-detail-link"
                    style={{ padding: '0.35rem 0.75rem' }}
                  >
                    <Pencil size={12} />
                    Modifier
                  </Link>
                  <DeleteButton id={speaker.id} title={speaker.name} endpoint="/api/speakers" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
