import { prisma } from '@/lib/prisma'
import { EventCard } from '@/components/events/EventCard'
import Link from 'next/link'
import { Calendar, ArrowRight, Zap } from 'lucide-react'

async function getEvents() {
  const events = await prisma.event.findMany({
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
  return events
}

export default async function HomePage() {
  const events = await getEvents()

  return (
    <div style={{ minHeight: '100vh' }}>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '7rem 1.5rem 6rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
            filter: 'blur(40px)',
            animationDelay: '3s',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto' }}>
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '99px',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#a5b4fc',
              marginBottom: '1.75rem',
            }}
          >
            <Zap size={13} style={{ fill: '#a5b4fc' }} />
            Gestion d&apos;événements en temps réel
          </div>

          <h1
            className="gradient-text animate-slide-up"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            EventSync
          </h1>

          <p
            className="animate-slide-up"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              animationDelay: '80ms',
            }}
          >
            Gérez vos événements, suivez les sessions en direct et interagissez avec les participants en temps réel.
          </p>

          <div
            className="animate-scale-in"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              animationDelay: '160ms',
            }}
          >
            <Link
              href="/events"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.6)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.45)' }}
            >
              <Calendar size={16} />
              Voir les événements
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/speakers"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                border: '1px solid var(--border-mid)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.color = '#a5b4fc' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            >
              Intervenants
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem 5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '4px',
              height: '24px',
              borderRadius: '99px',
              background: 'linear-gradient(180deg, var(--accent-from), var(--accent-to))',
              flexShrink: 0,
            }}
          />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Événements à venir
          </h2>
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Aucun événement à venir pour le moment.
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