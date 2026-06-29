import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink, Clock, MapPin } from 'lucide-react'
import { LiveBadge } from '@/components/sessions/LiveBadge'

async function getSpeaker(id: string) {
  return prisma.speaker.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          session: {
            include: {
              event: true,
              room: true,
            },
          },
        },
      },
    },
  })
}

export default async function SpeakerDetailPage({
  params,
}: {
  params: Promise<{ speakerId: string }>
}) {
  const { speakerId } = await params
  const speaker = await getSpeaker(speakerId)

  if (!speaker) {
    notFound()
  }

  const links = speaker.links as Record<string, string> | null

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <Link href="/speakers" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <ArrowLeft size={14} />
          Tous les intervenants
        </Link>

        <div
          className="glass animate-slide-up"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem 2rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
            {speaker.photo ? (
              <img
                src={speaker.photo}
                alt={speaker.name}
                style={{
                  width: '112px',
                  height: '112px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(99,102,241,0.3)',
                  boxShadow: '0 0 0 6px rgba(99,102,241,0.1)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '112px',
                  height: '112px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  color: '#fff',
                  boxShadow: '0 0 0 6px rgba(99,102,241,0.15), 0 4px 20px rgba(99,102,241,0.3)',
                }}
              >
                {speaker.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 850,
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {speaker.name}
              </h1>

              {speaker.bio && (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem', maxWidth: '600px', margin: '0 auto' }}>
                  {speaker.bio}
                </p>
              )}

              {links && Object.keys(links).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                  {Object.entries(links).map(([label, url]) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ext-link"
                    >
                      <ExternalLink size={12} />
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '4px',
                height: '20px',
                borderRadius: '99px',
                background: 'linear-gradient(180deg, var(--accent-from), var(--accent-to))',
                flexShrink: 0,
              }}
            />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Sessions ({speaker.sessions.length})
            </h2>
          </div>

          {speaker.sessions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
              Aucune session assignée pour le moment.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {speaker.sessions.map(({ session }) => (
                <Link
                  key={session.id}
                  href={`/events/${session.eventId}/sessions/${session.id}`}
                  className="session-card-link"
                >
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                          {session.title}
                        </h3>
                        <LiveBadge startTime={session.startTime} endTime={session.endTime} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={12} style={{ color: 'var(--accent-from)' }} />
                          <span style={{ textTransform: 'capitalize' }}>{formatDate(session.startTime)}</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={12} style={{ color: 'var(--accent-from)' }} />
                          {formatTime(session.startTime)} – {formatTime(session.endTime)}
                        </span>
                        {session.room && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={12} style={{ color: 'var(--accent-to)' }} />
                            {session.room.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '99px',
                        background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#a5b4fc',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {session.event.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
