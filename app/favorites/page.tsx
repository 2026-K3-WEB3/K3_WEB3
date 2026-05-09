'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Calendar, Clock, MapPin, Trash2 } from 'lucide-react'
import { getFavorites, removeFavorite } from '@/lib/favorites'

interface SessionData {
  id: string
  title: string
  startTime: string
  endTime: string
  eventId: string
  room: { name: string } | null
  speakers: { speaker: { name: string } }[]
}

export default function FavoritesPage() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const favoriteItems = getFavorites()
    const favoriteIds = favoriteItems.map(f => f.sessionId)

    if (favoriteIds.length === 0) {
      setLoading(false)
      return
    }

    const fetchSessions = async () => {
      try {
        const results = await Promise.all(
          favoriteIds.map(id =>
            fetch(`/api/sessions/${id}`).then(r => r.ok ? r.json() : null)
          )
        )
        setSessions(results.filter(Boolean))
      } catch (err) {
        console.error('Erreur chargement favoris:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const handleRemove = (id: string) => {
    removeFavorite(id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">Mon Itinéraire</h1>
          </div>
          <p className="text-lg opacity-90">
            Vos sessions favorites pour planifier votre programme personnalisé.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
            Chargement...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-semibold mb-2">Aucune session favorite</h2>
            <p className="text-sm mb-6">
              Ajoutez des sessions à vos favoris depuis le planning d&apos;un événement.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Calendar className="w-4 h-4" />
              Voir les événements
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-6">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} dans votre itinéraire
            </p>
            {sessions
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="flex">
                    {/* Left accent */}
                    <div className="w-1.5 bg-yellow-400 flex-shrink-0" />

                    <div className="flex-1 p-5">
                      <div className="flex justify-between items-start gap-4">
                        <Link
                          href={`/events/${session.eventId}/sessions/${session.id}`}
                          className="flex-1 hover:text-blue-600 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-800 mb-2">{session.title}</h3>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(session.startTime)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formatTime(session.startTime)} – {formatTime(session.endTime)}
                            </div>
                            {session.room && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {session.room.name}
                              </div>
                            )}
                            {session.speakers.length > 0 && (
                              <div>
                                👤 {session.speakers.map(s => s.speaker.name).join(', ')}
                              </div>
                            )}
                          </div>
                        </Link>

                        <button
                          onClick={() => handleRemove(session.id)}
                          title="Retirer des favoris"
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}
