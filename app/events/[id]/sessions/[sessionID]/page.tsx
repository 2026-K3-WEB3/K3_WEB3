import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { SessionDetailClient } from '@/components/sessions/SessionDetailClient'

async function getSession(sessionId: string) {
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            room: true,
            event: true,
            speakers: {
                include: {
                    speaker: true,
                },
            },
            questions: {
                orderBy: {
                    upvotes: 'desc',
                },
            },
        },
    })
    return session
}

export default async function SessionDetailPage({
                                                    params
                                                }: {
    params: { sessionId: string; id: string }
}) {
    const session = await getSession(params.sessionId)

    if (!session) {
        notFound()
    }

    const now = new Date()
    const isLive = now >= session.startTime && now <= session.endTime

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        })
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Back button */}
                <a
                    href={`/events/${session.eventId}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
                >
                    ← Retour au programme
                </a>

                {/* Session Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {session.title}
                        </h1>
                        {isLive && (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                🔴 LIVE
              </span>
                        )}
                    </div>

                    {/* Session Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <span className="font-semibold text-gray-700">📅 Date :</span>{' '}
                            {formatDate(session.startTime)}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">⏰ Horaire :</span>{' '}
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                        {session.room && (
                            <div>
                                <span className="font-semibold text-gray-700">📍 Salle :</span> {session.room.name}
                            </div>
                        )}
                        {session.capacity && (
                            <div>
                                <span className="font-semibold text-gray-700">👥 Capacité :</span> {session.capacity} personnes
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {session.description && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-gray-600 whitespace-pre-wrap">
                                {session.description}
                            </p>
                        </div>
                    )}

                    {/* Speakers */}
                    {session.speakers.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Intervenants</h2>
                            <div className="flex flex-wrap gap-4">
                                {session.speakers.map(({ speaker }) => (
                                    <a
                                        key={speaker.id}
                                        href={`/speakers/${speaker.id}`}
                                        className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                                    >
                                        {speaker.photoUrl ? (
                                            <img
                                                src={speaker.photoUrl}
                                                alt={speaker.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                                {speaker.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-gray-800">{speaker.name}</div>
                                            <div className="text-xs text-gray-500">Intervenant</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Q&A Section */}
                <SessionDetailClient
                    sessionId={session.id}
                    initialQuestions={session.questions}
                    isLive={isLive}
                />
            </div>
        </div>
    )
}