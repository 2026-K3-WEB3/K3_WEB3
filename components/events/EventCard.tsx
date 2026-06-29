'use client'

import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string | null
    startDate: Date
    endDate: Date
    location: string | null
  }
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

  const isMultiDay = event.startDate.toDateString() !== event.endDate.toDateString()

  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        className="card-hover animate-slide-up"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, var(--accent-from), var(--accent-to))',
            flexShrink: 0,
          }}
        />

        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.title}
          </h3>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {event.description || 'Aucune description disponible.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <Calendar size={13} style={{ flexShrink: 0, color: 'var(--accent-from)' }} />
              <span>
                {formatDate(event.startDate)}
                {isMultiDay && ` → ${formatDate(event.endDate)}`}
              </span>
            </div>

            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <MapPin size={13} style={{ flexShrink: 0, color: 'var(--accent-to)' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {event.location}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            padding: '0.85rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#a5b4fc',
          }}
        >
          <span>Voir les sessions</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  )
}