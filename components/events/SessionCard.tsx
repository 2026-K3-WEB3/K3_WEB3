'use client'

import Link from 'next/link'
import { LiveBadge } from '@/components/sessions/LiveBadge'
import { Star, StarOff } from 'lucide-react'
import { isFavorite, toggleFavorite } from '@/lib/favorites'
import { useState, useEffect } from 'react'

interface SessionCardProps {
    session: any
    variant?: 'default' | 'compact' | 'horizontal'
}

export function SessionCard({ session, variant = 'default' }: SessionCardProps) {
    const [favorite, setFavorite] = useState(false)

    useEffect(() => {
        setFavorite(isFavorite(session.id))
    }, [session.id])

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const newState = toggleFavorite(session.id)
        setFavorite(newState)
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    if (variant === 'compact') {
        return (
            <Link href={`/events/${session.eventId}/sessions/${session.id}`}>
                <div className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-sm text-gray-800 line-clamp-2 flex-1">
                            {session.title}
                        </h4>
                        <button onClick={handleToggleFavorite} className="flex-shrink-0">
                            {favorite ? (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            ) : (
                                <StarOff className="w-4 h-4 text-gray-400" />
                            )}
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </div>
                    {session.speakers && session.speakers.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1 truncate">
                            {session.speakers.map((s: any) => s.speaker.name).join(', ')}
                        </div>
                    )}
                    {session.room && (
                        <div className="text-xs text-gray-400 mt-1">
                            📍 {session.room.name}
                        </div>
                    )}
                    <LiveBadge startTime={session.startTime} endTime={session.endTime} />
                </div>
            </Link>
        )
    }

    if (variant === 'horizontal') {
        return (
            <Link href={`/events/${session.eventId}/sessions/${session.id}`}>
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="font-semibold text-gray-800">{session.title}</h3>
                                <LiveBadge startTime={session.startTime} endTime={session.endTime} />
                                <button onClick={handleToggleFavorite}>
                                    {favorite ? (
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    ) : (
                                        <StarOff className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>⏰ {formatTime(session.startTime)} - {formatTime(session.endTime)}</div>
                                {session.room && <div>📍 {session.room.name}</div>}
                                {session.speakers && session.speakers.length > 0 && (
                                    <div>👤 {session.speakers.map((s: any) => s.speaker.name).join(', ')}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    return null
}