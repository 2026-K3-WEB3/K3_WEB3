import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

export default async function RoomPage({ params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({
    where: { id: params.id },
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

  // Group sessions by date
  const sessionsByDate = room.sessions.reduce((acc, session) => {
    const dateKey = session.startTime.toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(session)
    return acc
  }, {} as Record<string, typeof room.sessions>)

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">{room.name}</h1>
          </div>
          <p className="text-lg opacity-90">
            Planning des sessions pour cette salle
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {Object.entries(sessionsByDate).length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Aucune session prévue dans cette salle.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(sessionsByDate).map(([date, sessions]) => (
              <div key={date}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  {new Date(date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                  {sessions.map((session) => {
                    const isLive = now >= session.startTime && now <= session.endTime
                    const isPast = now > session.endTime
                    return (
                      <div key={session.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${isLive ? 'bg-red-500 animate-pulse' : isPast ? 'bg-gray-300' : 'bg-emerald-500'}`}>
                          {isLive && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <time className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </time>
                            {isLive && (
                              <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                EN COURS
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            <Link href={`/events/${session.eventId}/sessions/${session.id}`} className="hover:text-emerald-600 transition-colors">
                              {session.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{session.event.title}</p>
                          {session.speakers.length > 0 && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                              <Users className="w-4 h-4 text-gray-400" />
                              {session.speakers.map(s => s.speaker.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
