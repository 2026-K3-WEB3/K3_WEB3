'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Calendar, Clock, MapPin, Trash2, User } from 'lucide-react'
import { getFavorites, removeFavorite } from '@/lib/favorites'

interface SessionData {
  id: string
  title: string
  startTime: string
  endTime: string
  eventId: string
  room: { name: string } | null
  speakers: { speaker: { name: string } }[]
}

export default function FavoritesPage() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const favoriteItems = getFavorites()
    const favoriteIds = favoriteItems.map(f => f.sessionId)

    if (favoriteIds.length === 0) {
      setLoading(false)
      return
    }

    const fetchSessions = async () => {
      try {
        const results = await Promise.all(
          favoriteIds.map(id =>
            fetch(`/api/sessions/${id}`).then(r => r.ok ? r.json() : null)
          )
        )
        setSessions(results.filter(Boolean))
      } catch (err) {
        console.error('Erreur chargement favoris:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const handleRemove = (id: string) => {
    removeFavorite(id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

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
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,158,11,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--gold-from), var(--gold-to))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
            }}
          >
            <Star size={24} color="#fff" style={{ fill: '#fff' }} />
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
            Mon Itinéraire
          </h1>
          <p
            className="animate-slide-up"
            style={{ color: 'var(--text-secondary)', fontSize: '1rem', animationDelay: '80ms' }}
          >
            Vos sessions favorites pour planifier votre programme.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '1rem 1.5rem 5rem',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                border: '3px solid var(--border-mid)',
                borderTopColor: 'var(--accent-from)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Chargement...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <Star size={48} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Aucune session favorite
            </h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>
              Ajoutez des sessions à vos favoris depuis le planning d&apos;un événement.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              }}
            >
              <Calendar size={15} />
              Voir les événements
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} dans votre itinéraire
            </p>

            {sessions
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((session) => (
                <div
                  key={session.id}
                  className="animate-slide-up"
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    display: 'flex',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    e.currentTarget.style.transform = ''
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      flexShrink: 0,
                      background: 'linear-gradient(180deg, var(--gold-from), var(--gold-to))',
                    }}
                  />

                  <div style={{ flex: 1, padding: '1.1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <Link
                        href={`/events/${session.eventId}/sessions/${session.id}`}
                        style={{ flex: 1, textDecoration: 'none' }}
                      >
                        <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                          {session.title}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Calendar size={12} style={{ color: '#f59e0b' }} />
                            <span style={{ textTransform: 'capitalize' }}>{formatDate(session.startTime)}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Clock size={12} style={{ color: '#f59e0b' }} />
                            {formatTime(session.startTime)} – {formatTime(session.endTime)}
                          </span>
                          {session.room && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <MapPin size={12} />
                              {session.room.name}
                            </span>
                          )}
                          {session.speakers.length > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <User size={12} />
                              {session.speakers.map(s => s.speaker.name).join(', ')}
                            </span>
                          )}
                        </div>
                      </Link>

                      <button
                        onClick={() => handleRemove(session.id)}
                        title="Retirer des favoris"
                        style={{
                          padding: '0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          background: 'transparent',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.12)'
                          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'
                          e.currentTarget.style.color = '#f87171'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'var(--border-subtle)'
                          e.currentTarget.style.color = 'var(--text-muted)'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
