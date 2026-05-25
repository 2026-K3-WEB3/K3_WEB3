import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Activity } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

async function getSessions() {
  return prisma.session.findMany({
    include: {
      event: true,
      room: true,
      speakers: { include: { speaker: true } },
    },
    orderBy: { startTime: 'asc' },
  })
}

export default async function AdminSessionsPage() {
  const sessions = await getSessions()

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">Gestion des sessions et ateliers</p>
        </div>
        <Link
          href="/admin/sessions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle session
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Aucune session programmée</p>
            <Link href="/admin/sessions/new" className="text-blue-600 text-sm mt-2 inline-block">
              Créer la première session →
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {sessions.map((session) => (
              <div key={session.id} className="p-5 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                      <p>📅 {formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}</p>
                      {session.room && <p>📍 Salle: {session.room.name}</p>}
                      {session.event && <p>🎪 Événement: {session.event.title}</p>}
                      {session.speakers.length > 0 && (
                        <p>👤 Intervenants: {session.speakers.map(s => s.speaker.name).join(', ')}</p>
                      )}
                      {session.capacity && <p>👥 Capacité: {session.capacity} personnes</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/sessions/${session.id}/edit`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Link>
                    <DeleteButton id={session.id} title={session.title} endpoint="/api/sessions" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}