import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, Users, MapPin, MessageSquare, Plus, Activity, TrendingUp } from 'lucide-react'

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
    { label: 'Événements', value: stats.events, icon: Calendar, color: 'bg-blue-500', href: '/admin/events' },
    { label: 'Sessions', value: stats.sessions, icon: Activity, color: 'bg-indigo-500', href: '/admin/sessions' },
    { label: 'Intervenants', value: stats.speakers, icon: Users, color: 'bg-purple-500', href: '/admin/speakers' },
    { label: 'Salles', value: stats.rooms, icon: MapPin, color: 'bg-emerald-500', href: '/admin/rooms' },
    { label: 'Questions', value: stats.questions, icon: MessageSquare, color: 'bg-orange-500', href: '#' },
    { label: 'Sessions Live', value: stats.liveSessions, icon: TrendingUp, color: 'bg-red-500', href: '/admin/sessions' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de la plateforme EventSync</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/events/new', label: 'Nouvel événement', color: 'bg-blue-600 hover:bg-blue-700' },
            { href: '/admin/sessions/new', label: 'Nouvelle session', color: 'bg-indigo-600 hover:bg-indigo-700' },
            { href: '/admin/speakers/new', label: 'Nouvel intervenant', color: 'bg-purple-600 hover:bg-purple-700' },
            { href: '/admin/rooms/new', label: 'Nouvelle salle', color: 'bg-emerald-600 hover:bg-emerald-700' },
          ].map(({ href, label, color }) => (
            <Link
              key={href}
              href={href}
              className={`${color} text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors`}
            >
              <Plus className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent events */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Événements récents</h2>
          <Link href="/admin/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Voir tout →
          </Link>
        </div>
        <div className="space-y-3">
          {stats.recentEvents.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Aucun événement créé</p>
          ) : (
            stats.recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {event.sessions.length} session{event.sessions.length !== 1 ? 's' : ''} · {event.location}
                  </p>
                </div>
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg font-medium"
                >
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
