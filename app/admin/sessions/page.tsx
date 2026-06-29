import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Activity, Clock } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminSessionsPage() {
  const sessions = await prisma.session.findMany({
    include: {
      event: true,
      room: true,
      speakers: { include: { speaker: true } },
    },
    orderBy: { startTime: 'desc' },
  })

  const now = new Date()

  const formatTime = (d: Date) =>
    new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">{sessions.length} session{sessions.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Link
          href="/admin/sessions/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle session
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Aucune session</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Horaire</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Salle</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intervenants</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sessions.map((session) => {
                const isLive = now >= session.startTime && now <= session.endTime
                return (
                  <tr key={session.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{session.title}</p>
                        {isLive && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{session.event.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(session.startTime)} · {formatTime(session.startTime)}–{formatTime(session.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{session.room?.name ?? '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {session.speakers.map(({ speaker }) => (
                          <span key={speaker.id} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg">
                            {speaker.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/sessions/${session.id}/edit`}
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Modifier
                        </Link>
                        <DeleteButton id={session.id} title={session.title} endpoint="/api/sessions" />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
