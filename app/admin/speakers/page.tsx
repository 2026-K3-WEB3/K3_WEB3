import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Users } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

async function getSpeakers() {
  return prisma.speaker.findMany({
    include: { sessions: true },
    orderBy: { name: 'asc' },
  })
}

export default async function AdminSpeakersPage() {
  const speakers = await getSpeakers()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intervenants</h1>
          <p className="text-gray-500 mt-1">Gestion des intervenants et conférenciers</p>
        </div>
        <Link
          href="/admin/speakers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvel intervenant
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {speakers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Aucun intervenant enregistré</p>
            <Link href="/admin/speakers/new" className="text-blue-600 text-sm mt-2 inline-block">
              Ajouter le premier intervenant →
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  {speaker.photo ? (
                    <img src={speaker.photo} alt={speaker.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {speaker.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{speaker.name}</p>
                    <p className="text-sm text-gray-500">{speaker.sessions.length} session(s)</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/speakers/${speaker.id}/edit`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm px-3 py-1.5"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Link>
                  <DeleteButton id={speaker.id} title={speaker.name} endpoint="/api/speakers" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}