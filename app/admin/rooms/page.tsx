import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, MapPin } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

async function getRooms() {
  return prisma.room.findMany({
    include: { sessions: true },
    orderBy: { name: 'asc' },
  })
}

export default async function AdminRoomsPage() {
  const rooms = await getRooms()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salles</h1>
          <p className="text-gray-500 mt-1">Gestion des salles et lieux</p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle salle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {rooms.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Aucune salle enregistrée</p>
            <Link href="/admin/rooms/new" className="text-blue-600 text-sm mt-2 inline-block">
              Créer la première salle →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Nom</th>
                <th className="text-left p-4 font-medium text-gray-600">Sessions</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{room.name}</td>
                  <td className="p-4 text-sm text-gray-500">{room.sessions.length} session(s)</td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/admin/rooms/${room.id}/edit`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Link>
                    <DeleteButton id={room.id} title={room.name} endpoint="/api/rooms" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}