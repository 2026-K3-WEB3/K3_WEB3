'use client'

import { SessionCard } from './SessionCard'
import { Session } from '@prisma/client'

interface SessionWithRelations extends Session {
    room: { id: string; name: string } | null
    speakers: { speaker: { id: string; name: string; photoUrl: string | null } }[]
}

interface SessionGridProps {
    sessions: SessionWithRelations[]
}

export function SessionGrid({ sessions }: SessionGridProps) {
    const rooms = [...new Set(sessions.map(s => s.room?.name).filter(Boolean))]
    const sortedSessions = [...sessions].sort((a, b) =>
        a.startTime.getTime() - b.startTime.getTime()
    )

    if (rooms.length === 0) {
        return (
            <div className="space-y-4">
                {sortedSessions.map((session) => (
                    <SessionCard key={session.id} session={session} variant="horizontal" />
                ))}
            </div>
        )
    }

    const timeSlots = [...new Set(sortedSessions.map(s =>
        s.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    ))]

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(200px,1fr))] mb-4">
                    <div className="font-semibold text-gray-600">Horaire</div>
                    {rooms.map(room => (
                        <div key={room} className="font-semibold text-gray-600 px-4">
                            {room}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                {timeSlots.map(timeSlot => (
                    <div key={timeSlot} className="grid grid-cols-[120px_repeat(auto-fit,minmax(200px,1fr))] mb-4">
                        <div className="text-sm text-gray-500 pt-4">{timeSlot}</div>
                        {rooms.map(room => {
                            const session = sortedSessions.find(
                                s => s.room?.name === room &&
                                    s.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) === timeSlot
                            )
                            return (
                                <div key={`${room}-${timeSlot}`} className="px-2">
                                    {session && <SessionCard session={session} variant="compact" />}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}