'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface Room { id: string; name: string }
interface Speaker { id: string; name: string }
interface Event { id: string; title: string }

export default function NewSessionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rooms, setRooms] = useState<Room[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/rooms').then(r => r.json()),
      fetch('/api/speakers').then(r => r.json()),
      fetch('/api/events').then(r => r.json()),
    ]).then(([r, s, e]) => {
      setRooms(r)
      setSpeakers(s)
      setEvents(e)
    })
  }, [])

  const toggleSpeaker = (id: string) => {
    setSelectedSpeakers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value || null,
      startTime: new Date((form.elements.namedItem('startTime') as HTMLInputElement).value).toISOString(),
      endTime: new Date((form.elements.namedItem('endTime') as HTMLInputElement).value).toISOString(),
      capacity: Number((form.elements.namedItem('capacity') as HTMLInputElement).value) || null,
      eventId: (form.elements.namedItem('eventId') as HTMLSelectElement).value,
      roomId: (form.elements.namedItem('roomId') as HTMLSelectElement).value,
      speakerIds: selectedSpeakers,
    }
    if (selectedSpeakers.length === 0) {
      setError('Sélectionnez au moins un intervenant.')
      setLoading(false)
      return
    }
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      router.push('/admin/sessions')
      router.refresh()
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Erreur lors de la création.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/sessions" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle session</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        {/* Event */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Événement *</label>
          <select name="eventId" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white">
            <option value="">Sélectionner un événement...</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
          <input name="title" required placeholder="Titre de la session" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" />
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea name="description" rows={3} placeholder="Description de la session..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 resize-none" />
        </div>
        {/* Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Début *</label>
            <input name="startTime" type="datetime-local" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fin *</label>
            <input name="endTime" type="datetime-local" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" />
          </div>
        </div>
        {/* Room & Capacity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Salle *</label>
            <select name="roomId" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white">
              <option value="">Sélectionner une salle...</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Capacité (informatif)</label>
            <input name="capacity" type="number" min="1" placeholder="Ex: 100" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" />
          </div>
        </div>
        {/* Speakers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Intervenants * (au moins 1)</label>
          <div className="border border-gray-200 rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto">
            {speakers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun intervenant disponible — <Link href="/admin/speakers/new" className="text-indigo-600 underline">en créer un</Link></p>
            ) : speakers.map(s => (
              <label key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSpeakers.includes(s.id)}
                  onChange={() => toggleSpeaker(s.id)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm text-gray-700">{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/sessions" className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium">Annuler</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            {loading ? 'Création...' : 'Créer la session'}
          </button>
        </div>
      </form>
    </div>
  )
}
