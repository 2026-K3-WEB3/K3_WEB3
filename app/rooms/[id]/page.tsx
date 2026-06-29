import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react'

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          event: true,
          speakers: { include: { speaker: true } },
        },
        orderBy: { startTime: 'asc' },
      },
    },
  })

  if (!room) notFound()

  const now = new Date()

  const sessionsByDate = room.sessions.reduce((acc, session) => {
    const dateKey = session.startTime.toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(session)
    return acc
  }, {} as Record<string, typeof room.sessions>)

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh' }}>
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
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
            }}
          >
            <MapPin size={24} color="#fff" />
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
            {room.name}
          </h1>
          <p
            className="animate-slide-up"
            style={{ color: 'var(--text-secondary)', fontSize: '1rem', animationDelay: '80ms' }}
          >
            Planning des sessions pour cette salle.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '1rem 1.5rem 5rem',
        }}
      >
        {Object.entries(sessionsByDate).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <MapPin size={28} style={{ opacity: 0.4 }} />
            </div>
            <p className="empty-state-title">Aucune session prévue</p>
            <p className="empty-state-text">
              Il n&apos;y a pas encore de session programmée dans cette salle.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {Object.entries(sessionsByDate).map(([date, sessions]) => (
              <div key={date}>
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Calendar size={18} style={{ color: '#10b981' }} />
                  {new Date(date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sessions.map((session) => {
                    const isLive = now >= session.startTime && now <= session.endTime
                    return (
                      <div
                        key={session.id}
                        className="animate-slide-up"
                        style={{
                          background: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-subtle)',
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.8rem',
                              color: '#10b981',
                              fontWeight: 600,
                            }}
                          >
                            <Clock size={12} />
                            {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} – {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isLive && (
                            <span
                              style={{
                                background: 'rgba(239,68,68,0.15)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                color: '#f87171',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.6rem',
                                borderRadius: '99px',
                                letterSpacing: '0.05em',
                              }}
                            >
                              EN COURS
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          <Link
                            href={`/events/${session.eventId}/sessions/${session.id}`}
                            className="room-session-link"
                          >
                            {session.title}
                          </Link>
                        </h3>

                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{session.event.title}</p>

                        {session.speakers.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            <Users size={12} />
                            <span>{session.speakers.map(s => s.speaker.name).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
