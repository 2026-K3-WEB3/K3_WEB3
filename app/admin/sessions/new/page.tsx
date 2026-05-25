'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Event {
  id: string
  title: string
}

interface Room {
  id: string
  name: string
}

interface Speaker {
  id: string
  name: string
}

export default function NewSessionPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    capacity: '',
    eventId: '',
    roomId: '',
    speakerIds: [] as string[],
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/events').then(res => res.json()),
      fetch('/api/rooms').then(res => res.json()),
      fetch('/api/speakers').then(res => res.json()),
    ]).then(([eventsData, roomsData, speakersData]) => {
      setEvents(eventsData)
      setRooms(roomsData)
      setSpeakers(speakersData)
      setLoading(false)
    }).catch(() => {
      setError('Erreur de chargement des données')
      setLoading(false)
    })
  }, [])

  const handleSpeakerToggle = (speakerId: string) => {
    setForm(prev => ({
      ...prev,
      speakerIds: prev.speakerIds.includes(speakerId)
        ? prev.speakerIds.filter(id => id !== speakerId)
        : [...prev.speakerIds, speakerId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Le titre est requis')
      return
    }
    if (!form.startTime || !form.endTime) {
      setError('Les horaires sont requis')
      return
    }
    if (!form.eventId) {
      setError('Veuillez sélectionner un événement')
      return
    }
    if (!form.roomId) {
      setError('Veuillez sélectionner une salle')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push('/admin/sessions')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la création')
      }
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/sessions" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux sessions
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle session</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ex: Keynote - L'avenir de la tech"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Description de la session..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date et heure de début *</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date et heure de fin *</label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Événement *</label>
              <select
                value={form.eventId}
                onChange={(e) => setForm({ ...form, eventId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionner un événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salle *</label>
              <select
                value={form.roomId}
                onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionner une salle</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacité (optionnel)</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="ex: 100"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Intervenants</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {speakers.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun intervenant disponible</p>
              ) : (
                speakers.map((speaker) => (
                  <label key={speaker.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.speakerIds.includes(speaker.id)}
                      onChange={() => handleSpeakerToggle(speaker.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{speaker.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Création...' : 'Créer la session'}
            </button>
            <Link href="/admin/sessions" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}