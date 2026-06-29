import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, MapPin } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    include: { sessions: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Salles</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {rooms.length} salle{rooms.length !== 1 ? 's' : ''} disponible{rooms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/rooms/new" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
          <Plus size={16} />
          Nouvelle salle
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {rooms.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <MapPin size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Aucune salle créée</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)',
              }}
              className="card-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16,185,129,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981',
                  }}
                >
                  <MapPin size={20} />
                </div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '99px',
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#a7f3d0',
                  }}
                >
                  {room.sessions.length} session{room.sessions.length !== 1 ? 's' : ''}
                </span>
              </div>

              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                {room.name}
              </h3>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Link
                  href={`/admin/rooms/${room.id}/edit`}
                  className="admin-room-edit"
                >
                  <Pencil size={12} />
                  Modifier
                </Link>
                <DeleteButton id={room.id} title={room.name} endpoint="/api/rooms" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
