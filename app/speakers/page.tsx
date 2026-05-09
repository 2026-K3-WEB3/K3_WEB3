import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users } from 'lucide-react'

export const metadata = {
  title: 'Intervenants — EventSync',
  description: 'Découvrez tous les intervenants de nos événements.',
}

async function getSpeakers() {
  return prisma.speaker.findMany({
    include: {
      sessions: {
        include: {
          session: {
            include: {
              event: true,
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export default async function SpeakersPage() {
  const speakers = await getSpeakers()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Intervenants</h1>
          </div>
          <p className="text-lg opacity-90">
            Découvrez les experts et professionnels qui animent nos événements.
          </p>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="container mx-auto px-4 py-12">
        {speakers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg">Aucun intervenant enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {speakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  {speaker.photo ? (
                    <img
                      src={speaker.photo}
                      alt={speaker.name}
                      className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-blue-100 group-hover:ring-blue-400 transition-all"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-105 transition-transform">
                      {speaker.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {speaker.name}
                  </h2>
                  {speaker.bio && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{speaker.bio}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {speaker.sessions.length} session{speaker.sessions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
