'use client'

import { useEffect, useState } from 'react'

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
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '99px',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        background: 'rgba(239,68,68,0.15)',
        color: '#f87171',
        border: '1px solid rgba(239,68,68,0.3)',
      }}
    >
      <span
        className="animate-blink"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#ef4444',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      Live
    </span>
  )
}