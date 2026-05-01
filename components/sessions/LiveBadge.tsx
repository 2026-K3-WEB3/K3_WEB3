'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'

interface LiveBadgeProps {
    startTime: Date
    endTime: Date
    className?: string
}

export function LiveBadge({ startTime, endTime, className = '' }: LiveBadgeProps) {
    const [isLive, setIsLive] = useState(false)

    useEffect(() => {
        const checkLive = () => {
            const now = new Date()
            setIsLive(now >= startTime && now <= endTime)
        }

        checkLive()
        const interval = setInterval(checkLive, 60000)

        return () => clearInterval(interval)
    }, [startTime, endTime])

    if (!isLive) return null

    return (
        <Badge variant="danger" className={`animate-pulse ${className}`}>
            🔴 LIVE
        </Badge>
    )
}