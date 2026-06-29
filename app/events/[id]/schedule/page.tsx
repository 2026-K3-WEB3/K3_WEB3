import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

export default async function MultiTrackSchedulePage({ params }: { params: { id: string } }) {
    const event = await prisma.event.findUnique({
        where: { id: params.id },
        include: {
            sessions: {
                include: {
                    room: true,
                    speakers: { include: { speaker: true } },
                },
                orderBy: { startTime: 'asc' },
            },
        },
    })

    if (!event) notFound()

    // Get unique rooms for this event
    const roomsMap = new Map()
    event.sessions.forEach(s => {
        if (s.room) roomsMap.set(s.roomId, s.room)
    })
    const rooms = Array.from(roomsMap.values()).sort((a, b) => a.name.localeCompare(b.name))

    // Group by date, then by time block
    const scheduleByDate: Record<string, Record<string, typeof event.sessions>> = {}

    event.sessions.forEach(session => {
        const dateStr = session.startTime.toDateString()
        const timeStr = `${session.startTime.toISOString()}-${session.endTime.toISOString()}`

        if (!scheduleByDate[dateStr]) scheduleByDate[dateStr] = {}
        if (!scheduleByDate[dateStr][timeStr]) scheduleByDate[dateStr][timeStr] = []

        scheduleByDate[dateStr][timeStr].push(session)
    })

    const now = new Date()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-4">
                        <Link href={`/events/${event.id}`} className="text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2">
                            ← Retour à l'événement
                        </Link>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Planning Multi-Track</h1>
                    <p className="text-lg opacity-90">{event.title}</p>
                </div>
            </section>

            {/* Schedule */}
            <div className="container mx-auto px-4 py-8">
                {Object.entries(scheduleByDate).map(([date, timeBlocks]) => (
                    <div key={date} className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-blue-600" />
                            {new Date(date).toLocaleDateString('fr-FR', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </h2>

                        <div className="overflow-x-auto pb-4">
                            <div className="min-w-[800px]">
                                {/* Rooms Header Row */}
                                <div className="flex border-b border-gray-200 mb-4 sticky top-0 bg-gray-50 z-10 pt-2 pb-3">
                                    <div className="w-32 flex-shrink-0 font-semibold text-gray-500 uppercase text-xs tracking-wider pt-2">
                                        Horaires
                                    </div>
                                    {rooms.map(room => (
                                        <div key={room.id} className="flex-1 px-4">
                                            <Link href={`/rooms/${room.id}`} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {room.name}
                                            </Link>
                                        </div>
                                    ))}
                                    {/* Catch-all for sessions without rooms */}
                                    <div className="flex-1 px-4 font-semibold text-gray-800 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        Général
                                    </div>
                                </div>

                                {/* Time Blocks */}
                                <div className="space-y-6">
                                    {Object.entries(timeBlocks).sort().map(([timeKey, sessions]) => {
                                        const [startStr, endStr] = timeKey.split('-')
                                        const start = new Date(startStr)
                                        const end = new Date(endStr)
                                        const isLive = now >= start && now <= end

                                        return (
                                            <div key={timeKey} className="flex relative">
                                                {/* Timeline */}
                                                <div className="w-32 flex-shrink-0 pr-4">
                                                    <div className={`font-bold text-lg ${isLive ? 'text-red-500' : 'text-gray-900'}`}>
                                                        {start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    {isLive && (
                                                        <span className="inline-block mt-1 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              EN COURS
                            </span>
                                                    )}
                                                </div>

                                                {/* Sessions by Room */}
                                                {rooms.map(room => {
                                                    const roomSessions = sessions.filter(s => s.roomId === room.id)
                                                    return (
                                                        <div key={room.id} className="flex-1 px-2">
                                                            {roomSessions.map(session => (
                                                                <SessionCard key={session.id} session={session} eventId={event.id} isLive={isLive} />
                                                            ))}
                                                        </div>
                                                    )
                                                })}

                                                {/* Sessions without room */}
                                                <div className="flex-1 px-2">
                                                    {sessions.filter(s => !s.roomId).map(session => (
                                                        <SessionCard key={session.id} session={session} eventId={event.id} isLive={isLive} />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SessionCard({ session, eventId, isLive }: { session: any, eventId: string, isLive: boolean }) {
    return (
        <Link href={`/events/${eventId}/sessions/${session.id}`} className="block mb-3 h-full">
            <div className={`h-full p-4 rounded-xl border ${isLive ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'} shadow-sm hover:shadow-md transition-all`}>
                <h3 className={`font-semibold mb-2 ${isLive ? 'text-red-700' : 'text-gray-900'}`}>
                    {session.title}
                </h3>
                {session.speakers?.length > 0 && (
                    <div className="flex items-start gap-1.5 text-xs text-gray-600">
                        <Users className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
              {session.speakers.map((s: any) => s.speaker.name).join(', ')}
            </span>
                    </div>
                )}
            </div>
        </Link>
    )
}
