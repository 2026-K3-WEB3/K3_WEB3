import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users } from 'lucide-react'

export const metadata = {
  title: 'Intervenants — EventSync',
  description: 'Découvrez tous les intervenants de nos événements.',
}

async function getSpeakers() {
  return prisma.speaker.findMany({
    include: {
      sessions: {
        include: {
          session: { include: { event: true } },
        },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export default async function SpeakersPage() {
  const speakers = await getSpeakers()

  return (
    <div style={{ minHeight: '100vh' }}>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139,92,246,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
            }}
          >
            <Users size={24} color="#fff" />
          </div>
          <h1
            className="animate-slide-up"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}
          >
            Intervenants
          </h1>
          <p
            className="animate-slide-up"
            style={{ color: 'var(--text-secondary)', fontSize: '1rem', animationDelay: '80ms' }}
          >
            Découvrez les experts et professionnels qui animent nos événements.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 1.5rem 5rem',
        }}
      >
        {speakers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Aucun intervenant enregistré pour le moment.
            </p>
          </div>
        ) : (
          <div
            className="stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {speakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className="card-hover animate-slide-up"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '2rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
                  {speaker.photo ? (
                    <img
                      src={speaker.photo}
                      alt={speaker.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(99,102,241,0.3)',
                        boxShadow: '0 0 0 4px rgba(99,102,241,0.1)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#fff',
                        boxShadow: '0 0 0 4px rgba(99,102,241,0.15), 0 4px 20px rgba(99,102,241,0.3)',
                      }}
                    >
                      {speaker.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      {speaker.name}
                    </h2>
                    {speaker.bio && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
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
                      padding: '0.2rem 0.7rem',
                      borderRadius: '99px',
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#a5b4fc',
                    }}
                  >
                    {speaker.sessions.length} session{speaker.sessions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
