'use client'

import { SessionCard } from './SessionCard'
import { Session } from '@prisma/client'

interface SessionWithRelations extends Session {
  room: { id: string; name: string } | null
  speakers: { speaker: { id: string; name: string; photo: string | null } }[]
}

interface SessionGridProps {
  sessions: SessionWithRelations[]
}

const ROOM_COLORS = [
  { from: '#6366f1', to: '#8b5cf6' },
  { from: '#06b6d4', to: '#3b82f6' },
  { from: '#10b981', to: '#059669' },
  { from: '#f59e0b', to: '#ef4444' },
  { from: '#ec4899', to: '#a855f7' },
]

export function SessionGrid({ sessions }: SessionGridProps) {
  const rooms = [...new Set(sessions.map(s => s.room?.name).filter(Boolean))]
  const sortedSessions = [...sessions].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  if (rooms.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '720px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `100px repeat(${rooms.length}, minmax(180px, 1fr))`,
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <div />
          {rooms.map((room, i) => {
            const color = ROOM_COLORS[i % ROOM_COLORS.length]
            return (
              <div
                key={room}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: `linear-gradient(135deg, ${color.from}22, ${color.to}22)`,
                  border: `1px solid ${color.from}44`,
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: color.from,
                  textAlign: 'center',
                }}
              >
                {room}
              </div>
            )
          })}
        </div>

        {timeSlots.map((timeSlot, rowIdx) => (
          <div
            key={timeSlot}
            style={{
              display: 'grid',
              gridTemplateColumns: `100px repeat(${rooms.length}, minmax(180px, 1fr))`,
              gap: '0.75rem',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                paddingTop: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--accent-from)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {timeSlot}
            </div>

            {rooms.map(room => {
              const session = sortedSessions.find(
                s => s.room?.name === room &&
                  s.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) === timeSlot
              )
              return (
                <div key={`${room}-${timeSlot}`}>
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