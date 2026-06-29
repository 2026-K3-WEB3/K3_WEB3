import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, Users, MapPin, Activity, MessageSquare, Plus, TrendingUp } from 'lucide-react'

async function getStats() {
  const [events, sessions, speakers, rooms, questions] = await Promise.all([
    prisma.event.count(),
    prisma.session.count(),
    prisma.speaker.count(),
    prisma.room.count(),
    prisma.question.count(),
  ])

  const now = new Date()
  const liveSessions = await prisma.session.count({
    where: { startTime: { lte: now }, endTime: { gte: now } },
  })

  const recentEvents = await prisma.event.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { sessions: true },
  })

  return { events, sessions, speakers, rooms, questions, liveSessions, recentEvents }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const statCards = [
    { label: 'Événements', value: stats.events, icon: Calendar, color: '#3b82f6', href: '/admin/events' },
    { label: 'Sessions', value: stats.sessions, icon: Activity, color: '#6366f1', href: '/admin/sessions' },
    { label: 'Intervenants', value: stats.speakers, icon: Users, color: '#8b5cf6', href: '/admin/speakers' },
    { label: 'Salles', value: stats.rooms, icon: MapPin, color: '#10b981', href: '/admin/rooms' },
    { label: 'Questions', value: stats.questions, icon: MessageSquare, color: '#f59e0b', href: '#' },
    { label: 'Sessions Live', value: stats.liveSessions, icon: TrendingUp, color: '#ef4444', href: '/admin/sessions' },
  ]

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Tableau de bord</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Vue d&apos;ensemble de la plateforme EventSync
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="stat-card animate-slide-up">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: `${color}15`,
                border: `1.5px solid ${color}30`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={20} />
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Actions rapides
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { href: '/admin/events/new', label: 'Nouvel événement', bg: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))' },
            { href: '/admin/sessions/new', label: 'Nouvelle session', bg: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
            { href: '/admin/speakers/new', label: 'Nouvel intervenant', bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
            { href: '/admin/rooms/new', label: 'Nouvelle salle', bg: 'linear-gradient(135deg, #10b981, #059669)' },
          ].map(({ href, label, bg }) => (
            <Link
              key={href}
              href={href}
              className="quick-action"
              style={{ background: bg }}
            >
              <Plus size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Événements récents</h2>
          <Link href="/admin/events" className="admin-recent-edit">Voir tout →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {stats.recentEvents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
              Aucun événement créé
            </p>
          ) : (
            stats.recentEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{event.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {event.sessions.length} session{event.sessions.length !== 1 ? 's' : ''} · {event.location || 'Lieu non spécifié'}
                  </p>
                </div>
                <Link href={`/admin/events/${event.id}/edit`} className="admin-recent-edit">
                  Modifier
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
