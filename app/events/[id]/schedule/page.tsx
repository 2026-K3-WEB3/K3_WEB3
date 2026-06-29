import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react'

export default async function MultiTrackSchedulePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await prisma.event.findUnique({
        where: { id },
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

    const roomsMap = new Map()
    event.sessions.forEach(s => {
        if (s.room) roomsMap.set(s.roomId, s.room)
    })
    const rooms = Array.from(roomsMap.values()).sort((a, b) => a.name.localeCompare(b.name))

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
        <div style={{ minHeight: '100vh' }}>
            <section
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '4rem 1.5rem 3rem',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <Link href={`/events/${event.id}`} className="back-link">
                            <ArrowLeft size={14} />
                            Retour à l&apos;événement
                        </Link>
                    </div>
                    <h1
                        className="animate-slide-up"
                        style={{
                          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                          fontWeight: 900,
                          letterSpacing: '-0.025em',
                          color: 'var(--text-primary)',
                          marginBottom: '0.5rem',
                        }}
                    >
                        Planning Multi-Track
                    </h1>
                    <p
                        className="animate-slide-up"
                        style={{ color: 'var(--text-secondary)', fontSize: '1rem', animationDelay: '80ms' }}
                    >
                        {event.title}
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem 5rem' }}>
                {Object.entries(scheduleByDate).map(([date, timeBlocks]) => (
                    <div key={date} style={{ marginBottom: '4rem' }}>
                        <h2
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <Calendar size={18} style={{ color: 'var(--accent-from)' }} />
                            {new Date(date).toLocaleDateString('fr-FR', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </h2>

                        <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                            <div style={{ minWidth: '800px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        marginBottom: '1rem',
                                        paddingBottom: '0.75rem',
                                    }}
                                >
                                    <div style={{ width: '120px', flexShrink: 0, fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '0.25rem' }}>
                                        Horaires
                                    </div>
                                    {rooms.map(room => (
                                        <div key={room.id} style={{ flex: 1, padding: '0 0.75rem' }}>
                                            <Link href={`/rooms/${room.id}`} className="schedule-room-link">
                                                <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                                                {room.name}
                                            </Link>
                                        </div>
                                    ))}
                                    <div style={{ flex: 1, padding: '0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                                        Général
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {Object.entries(timeBlocks).sort().map(([timeKey, sessions]) => {
                                        const [startStr, endStr] = timeKey.split('-')
                                        const start = new Date(startStr)
                                        const end = new Date(endStr)
                                        const isLive = now >= start && now <= end

                                        return (
                                            <div key={timeKey} style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                                                <div style={{ width: '120px', flexShrink: 0, paddingRight: '1rem' }}>
                                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: isLive ? '#f87171' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                                                        {start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', marginTop: '0.1rem' }}>
                                                        {end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    {isLive && (
                                                        <span
                                                            style={{
                                                                display: 'inline-block',
                                                                marginTop: '0.35rem',
                                                                background: 'rgba(239,68,68,0.15)',
                                                                border: '1px solid rgba(239,68,68,0.3)',
                                                                color: '#f87171',
                                                                fontSize: '0.65rem',
                                                                fontWeight: 700,
                                                                padding: '0.15rem 0.5rem',
                                                                borderRadius: '99px',
                                                            }}
                                                            className="animate-pulse"
                                                        >
                                                            LIVE
                                                        </span>
                                                    )}
                                                </div>

                                                {rooms.map(room => {
                                                    const roomSessions = sessions.filter(s => s.roomId === room.id)
                                                    return (
                                                        <div key={room.id} style={{ flex: 1, padding: '0 0.5rem' }}>
                                                            {roomSessions.map(session => (
                                                                <ScheduleSessionCard key={session.id} session={session} eventId={event.id} isLive={isLive} />
                                                            ))}
                                                        </div>
                                                    )
                                                })}

                                                <div style={{ flex: 1, padding: '0 0.5rem' }}>
                                                    {sessions.filter(s => !s.roomId).map(session => (
                                                        <ScheduleSessionCard key={session.id} session={session} eventId={event.id} isLive={isLive} />
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

function ScheduleSessionCard({ session, eventId, isLive }: { session: any, eventId: string, isLive: boolean }) {
    return (
        <Link
            href={`/events/${eventId}/sessions/${session.id}`}
            style={{ textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}
        >
            <div className={`schedule-session-card${isLive ? ' live' : ''}`}>
                <h3
                    style={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: isLive ? '#f87171' : 'var(--text-primary)',
                        marginBottom: '0.4rem',
                        lineHeight: 1.4,
                    }}
                >
                    {session.title}
                </h3>
                {session.speakers?.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Users size={11} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {session.speakers.map((s: any) => s.speaker.name).join(', ')}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    )
}
