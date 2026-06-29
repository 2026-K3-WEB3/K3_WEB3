import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Users, MapPin } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminSpeakersPage() {
  const speakers = await prisma.speaker.findMany({
    include: { sessions: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Intervenants</h1>
          <p className="text-gray-500 mt-1">{speakers.length} intervenant{speakers.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Link
          href="/admin/speakers/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvel intervenant
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {speakers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Aucun intervenant</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                {/* Avatar */}
                {speaker.photo ? (
                  <img src={speaker.photo} alt={speaker.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {speaker.name.charAt(0)}
                  </div>
                )}
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{speaker.name}</p>
                  {speaker.bio && <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">{speaker.bio}</p>}
                </div>
                {/* Sessions count */}
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium flex-shrink-0">
                  {speaker.sessions.length} session{speaker.sessions.length !== 1 ? 's' : ''}
                </span>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/speakers/${speaker.id}`}
                    target="_blank"
                    className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/admin/speakers/${speaker.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                  >
                    <Pencil className="w-3.5 h-3.5" />
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
