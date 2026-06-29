import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SessionGrid } from '@/components/events/SessionGrid'
import { Calendar, MapPin, LayoutGrid, ArrowLeft } from 'lucide-react'

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          room: true,
          speakers: { include: { speaker: true } },
          questions: true,
        },
        orderBy: { startTime: 'asc' },
      },
    },
  })
  return event
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) notFound()

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const sessionsByDate = event.sessions.reduce((acc, session) => {
    const dateKey = session.startTime.toDateString()
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(session)
    return acc
  }, {} as Record<string, typeof event.sessions>)

  return (
    <div style={{ minHeight: '100vh' }}>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '5rem 1.5rem 4rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 30% 0%, rgba(99,102,241,0.16) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
          <h1
            className="animate-slide-up"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            {event.title}
          </h1>

          {event.description && (
            <p
              className="animate-slide-up"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: '640px',
                marginBottom: '1.5rem',
                animationDelay: '80ms',
              }}
            >
              {event.description}
            </p>
          )}

          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              animationDelay: '160ms',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                fontSize: '0.8125rem',
                color: '#a5b4fc',
              }}
            >
              <Calendar size={13} />
              {formatDate(event.startDate)}
              {event.startDate.toDateString() !== event.endDate.toDateString() && ` → ${formatDate(event.endDate)}`}
            </span>

            {event.location && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  fontSize: '0.8125rem',
                  color: '#c4b5fd',
                }}
              >
                <MapPin size={13} />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem 5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '4px',
                height: '24px',
                borderRadius: '99px',
                background: 'linear-gradient(180deg, var(--accent-from), var(--accent-to))',
                flexShrink: 0,
              }}
            />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Programme
            </h2>
          </div>

          <Link href={`/events/${event.id}/schedule`} className="event-detail-link">
            <LayoutGrid size={14} />
            Vue multi-salles
          </Link>
        </div>

        {Object.entries(sessionsByDate).map(([dateKey, sessions]) => (
          <div key={dateKey} style={{ marginBottom: '2.5rem' }}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
                textTransform: 'capitalize',
              }}
            >
              {new Date(dateKey).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            <SessionGrid sessions={sessions} />
          </div>
        ))}

        {event.sessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Aucune session programmée pour le moment.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}