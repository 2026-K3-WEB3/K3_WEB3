import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
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
  params: { speakerId: string }
}) {
  const speaker = await getSpeaker(params.speakerId)

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back */}
        <Link
          href="/speakers"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tous les intervenants
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {speaker.photo ? (
              <img
                src={speaker.photo}
                alt={speaker.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-100 flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                {speaker.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {speaker.name}
              </h1>

              {speaker.bio && (
                <p className="text-gray-600 leading-relaxed">{speaker.bio}</p>
              )}

              {/* External Links */}
              {links && Object.keys(links).length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                  {Object.entries(links).map(([label, url]) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Sessions ({speaker.sessions.length})
          </h2>

          {speaker.sessions.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">
              Aucune session assignée pour le moment.
            </p>
          ) : (
            <div className="space-y-4">
              {speaker.sessions.map(({ session }) => (
                <Link
                  key={session.id}
                  href={`/events/${session.eventId}/sessions/${session.id}`}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{session.title}</h3>
                        <LiveBadge startTime={session.startTime} endTime={session.endTime} />
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>📅 {formatDate(session.startTime)}</div>
                        <div>⏰ {formatTime(session.startTime)} – {formatTime(session.endTime)}</div>
                        {session.room && <div>📍 {session.room.name}</div>}
                      </div>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
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
