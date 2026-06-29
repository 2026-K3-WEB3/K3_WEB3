import { prisma } from '@/lib/prisma'
import { EventCard } from '@/components/events/EventCard'
import { Calendar } from 'lucide-react'

export const metadata = {
  title: 'Événements — EventSync',
}

async function getEvents() {
  return prisma.event.findMany({
    include: {
      sessions: {
        include: {
          room: true,
          speakers: { include: { speaker: true } },
        },
      },
    },
    orderBy: { startDate: 'asc' },
  })
}

export default async function EventsPage() {
  const events = await getEvents()

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
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            }}
          >
            <Calendar size={24} color="#fff" />
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
            Événements
          </h1>
          <p
            className="animate-slide-up"
            style={{ color: 'var(--text-secondary)', fontSize: '1rem', animationDelay: '80ms' }}
          >
            Tous les événements disponibles sur EventSync.
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
        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={28} style={{ opacity: 0.4 }} />
            </div>
            <p className="empty-state-title">Aucun événement pour le moment</p>
            <p className="empty-state-text">
              Les événements seront listés ici une fois créés.
            </p>
          </div>
        ) : (
          <div
            className="stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {events.map((event) => (
              <div key={event.id} className="animate-slide-up">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}