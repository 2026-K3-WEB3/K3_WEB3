import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    include: { sessions: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salles</h1>
          <p className="text-gray-500 mt-1">{rooms.length} salle{rooms.length !== 1 ? 's' : ''} disponible{rooms.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle salle
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Aucune salle</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-medium">
                  {room.sessions.length} session{room.sessions.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-4">{room.name}</h3>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/rooms/${room.id}/edit`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors font-medium border border-emerald-200"
                >
                  <Pencil className="w-3.5 h-3.5" />
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
