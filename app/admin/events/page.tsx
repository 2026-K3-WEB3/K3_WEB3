import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Calendar } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

async function getEvents() {
  return prisma.event.findMany({
    include: { sessions: true },
    orderBy: { startDate: 'desc' },
  })
}

export default async function AdminEventsPage() {
  const events = await getEvents()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-500 mt-1">Gestion des événements et conférences</p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvel événement
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Aucun événement créé</p>
            <Link href="/admin/events/new" className="text-blue-600 text-sm mt-2 inline-block">
              Créer le premier événement →
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-5 hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                    <p>📅 {formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
                    {event.location && <p>📍 {event.location}</p>}
                    <p className="text-xs text-gray-400">{event.sessions.length} session(s)</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Link>
                  <DeleteButton id={event.id} title={event.title} endpoint="/api/events" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}