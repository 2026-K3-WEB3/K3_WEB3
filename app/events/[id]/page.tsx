import { prisma } from '@/lib/prisma'
import { SessionGrid } from '@/components/events/SessionGrid'
import { notFound } from 'next/navigation'

async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            sessions: {
                include: {
                    room: true,
                    speakers: {
                        include: {
                            speaker: true,
                        },
                    },
                    questions: true,
                },
                orderBy: {
                    startTime: 'asc',
                },
            },
        },
    })

    return event
}

export default async function EventDetailPage({
                                                  params,
                                              }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const event = await getEvent(id)

    if (!event) {
        notFound()
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const sessionsByDate = event.sessions.reduce((acc, session) => {
        const dateKey = session.startTime.toDateString()

        if (!acc[dateKey]) {
            acc[dateKey] = []
        }

        acc[dateKey].push(session)

        return acc
    }, {} as Record<string, typeof event.sessions>)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Event Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {event.title}
                    </h1>

                    <p className="text-lg opacity-90 mb-6">
                        {event.description}
                    </p>

                    <div className="space-y-2 text-sm opacity-80">
                        <p>
                            📅 {formatDate(event.startDate)} - {formatDate(event.endDate)}
                        </p>

                        {event.location && <p>📍 {event.location}</p>}
                    </div>
                </div>
            </div>

            {/* Schedule */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h2 className="text-2xl font-bold">
                        Programme
                    </h2>

                    <a
                        href={`/events/${event.id}/schedule`}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                        📅 Vue Multi-Track (Salles)
                    </a>
                </div>

                {Object.entries(sessionsByDate).map(([dateKey, sessions]) => (
                    <div
                        key={dateKey}
                        className="mb-8"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">
                            {new Date(dateKey).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </h3>

                        <SessionGrid sessions={sessions} />
                    </div>
                ))}

                {event.sessions.length === 0 && (
                    <p className="text-gray-500 text-center py-12">
                        Aucune session programmée pour le moment.
                    </p>
                )}
            </section>
        </div>
    )
}