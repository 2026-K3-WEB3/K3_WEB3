'use client'

import Link from 'next/link'
import { LiveBadge } from '@/components/sessions/LiveBadge'
import { Star, StarOff, Clock, MapPin, User } from 'lucide-react'
import { isFavorite, toggleFavorite } from '@/lib/favorites'
import { useState, useEffect } from 'react'

interface SessionCardProps {
  session: any
  variant?: 'default' | 'compact' | 'horizontal'
}

export function SessionCard({ session, variant = 'default' }: SessionCardProps) {
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    setFavorite(isFavorite(session.id))
  }, [session.id])

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = toggleFavorite(session.id)
    setFavorite(newState)
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const favoriteBtn = (size: number) => (
    <button
      onClick={handleToggleFavorite}
      style={{
        flexShrink: 0,
        background: favorite ? 'rgba(250,204,21,0.15)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        padding: '0.3rem',
        cursor: 'pointer',
        color: favorite ? '#facc15' : 'var(--text-muted)',
        transition: 'all var(--transition-fast)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#facc15' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = favorite ? '#facc15' : 'var(--text-muted)' }}
    >
      {favorite ? <Star size={size} style={{ fill: '#facc15' }} /> : <StarOff size={size} />}
    </button>
  )

  if (variant === 'compact') {
    return (
      <Link href={`/events/${session.eventId}/sessions/${session.id}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            border: '1px solid var(--border-subtle)',
            transition: 'all var(--transition-fast)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
            e.currentTarget.style.background = 'rgba(99,102,241,0.06)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.background = 'var(--bg-elevated)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
            <h4 style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {session.title}
            </h4>
            {favoriteBtn(13)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={11} />
            <span>{formatTime(session.startTime)} – {formatTime(session.endTime)}</span>
          </div>

          {session.speakers?.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <User size={11} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.speakers.map((s: any) => s.speaker.name).join(', ')}
              </span>
            </div>
          )}

          {session.room && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <MapPin size={11} />
              <span>{session.room.name}</span>
            </div>
          )}

          <div style={{ marginTop: '0.5rem' }}>
            <LiveBadge startTime={session.startTime} endTime={session.endTime} />
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/events/${session.eventId}/sessions/${session.id}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            display: 'flex',
            transition: 'all var(--transition-base)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = ''
          }}
        >
          <div
            style={{
              width: '4px',
              flexShrink: 0,
              background: 'linear-gradient(180deg, var(--accent-from), var(--accent-to))',
            }}
          />

          <div style={{ flex: 1, padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  {session.title}
                </h3>
                <LiveBadge startTime={session.startTime} endTime={session.endTime} />
              </div>
              {favoriteBtn(15)}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
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
              {session.speakers?.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={12} />
                  {session.speakers.map((s: any) => s.speaker.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return null
}