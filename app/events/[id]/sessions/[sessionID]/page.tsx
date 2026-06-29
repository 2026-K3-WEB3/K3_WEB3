import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SessionDetailClient } from '@/components/sessions/SessionDetailClient'
import { ArrowLeft, Calendar, Clock, MapPin, Users, User } from 'lucide-react'
import { LiveBadge } from '@/components/sessions/LiveBadge'

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
    params: { sessionID: string; id: string }
}) {
    const session = await getSession(params.sessionID)

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
        <div className="animate-fade-in" style={{ minHeight: '100vh' }}>
            <section
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '5rem 1.5rem 4rem',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.16) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
                    <Link
                        href={`/events/${session.eventId}`}
                        className="back-link"
                        style={{ marginBottom: '1.5rem', display: 'inline-flex' }}
                    >
                        <ArrowLeft size={14} />
                        Retour au programme
                    </Link>

                    <div
                        className="glass animate-slide-up"
                        style={{
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-subtle)',
                            padding: '2rem',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                            <h1
                                style={{
                                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                                    fontWeight: 900,
                                    color: 'var(--text-primary)',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.2,
                                }}
                            >
                                {session.title}
                            </h1>
                            <LiveBadge startTime={session.startTime} endTime={session.endTime} />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.75rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.3rem 0.85rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(99,102,241,0.12)',
                                    border: '1px solid rgba(99,102,241,0.25)',
                                    fontSize: '0.8125rem',
                                    color: '#a5b4fc',
                                }}
                            >
                                <Calendar size={13} />
                                {formatDate(session.startTime)}
                            </span>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.3rem 0.85rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(139,92,246,0.12)',
                                    border: '1px solid rgba(139,92,246,0.25)',
                                    fontSize: '0.8125rem',
                                    color: '#c4b5fd',
                                }}
                            >
                                <Clock size={13} />
                                {formatTime(session.startTime)} — {formatTime(session.endTime)}
                            </span>
                            {session.room && (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.3rem 0.85rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(16,185,129,0.12)',
                                        border: '1px solid rgba(16,185,129,0.25)',
                                        fontSize: '0.8125rem',
                                        color: '#34d399',
                                    }}
                                >
                                    <MapPin size={13} />
                                    {session.room.name}
                                </span>
                            )}
                            {session.capacity && (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.3rem 0.85rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(245,158,11,0.12)',
                                        border: '1px solid rgba(245,158,11,0.25)',
                                        fontSize: '0.8125rem',
                                        color: '#fbbf24',
                                    }}
                                >
                                    <Users size={13} />
                                    {session.capacity} places
                                </span>
                            )}
                        </div>

                        {session.description && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h2
                                    style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        color: 'var(--text-muted)',
                                        marginBottom: '0.75rem',
                                    }}
                                >
                                    Description
                                </h2>
                                <p
                                    style={{
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.7,
                                        fontSize: '0.9375rem',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {session.description}
                                </p>
                            </div>
                        )}

                        {session.speakers.length > 0 && (
                            <div>
                                <h2
                                    style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        color: 'var(--text-muted)',
                                        marginBottom: '0.75rem',
                                    }}
                                >
                                    Intervenants
                                </h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {session.speakers.map(({ speaker }) => (
                                        <Link
                                            key={speaker.id}
                                            href={`/speakers/${speaker.id}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.6rem 1rem',
                                                borderRadius: 'var(--radius-md)',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border-subtle)',
                                                textDecoration: 'none',
                                                transition: 'all var(--transition-fast)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
                                                e.currentTarget.style.background = 'rgba(99,102,241,0.06)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                                e.currentTarget.style.background = 'var(--bg-elevated)'
                                            }}
                                        >
                                            {speaker.photo ? (
                                                <img
                                                    src={speaker.photo}
                                                    alt={speaker.name}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: '1px solid var(--border-mid)',
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 800,
                                                        color: '#fff',
                                                    }}
                                                >
                                                    {speaker.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                                    {speaker.name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    Intervenant
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '0 1.5rem 5rem',
                }}
            >
                <SessionDetailClient
                    sessionId={session.id}
                    initialQuestions={session.questions}
                    isLive={isLive}
                />
            </section>
        </div>
    )
}
