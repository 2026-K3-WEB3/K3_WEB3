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
    <div className="flex flex-col items-center justify-start min-h-screen py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-5 mb-12">
          <Link href="/admin/sessions" className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">Nouvelle session</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 p-10 sm:p-14 space-y-10 shrink-0">
        {/* Event */}
        <div>
          <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Événement *</label>
          <select name="eventId" required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner">
            <option value="">Sélectionner un événement...</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        {/* Title */}
        <div>
          <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Titre *</label>
          <input name="title" required placeholder="Titre de la session" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner" />
        </div>
        {/* Description */}
        <div>
          <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Description</label>
          <textarea name="description" rows={4} placeholder="Description de la session..." className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner resize-none" />
        </div>
        {/* Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Début *</label>
            <input name="startTime" type="datetime-local" required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner" />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Fin *</label>
            <input name="endTime" type="datetime-local" required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner" />
          </div>
        </div>
        {/* Room & Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Salle *</label>
            <select name="roomId" required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner">
              <option value="">Sélectionner une salle...</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Capacité (informatif)</label>
            <input name="capacity" type="number" min="1" placeholder="Ex: 100" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner" />
          </div>
        </div>
        {/* Speakers */}
        <div>
          <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Intervenants * (au moins 1)</label>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-3 max-h-60 overflow-y-auto shadow-inner">
            {speakers.length === 0 ? (
              <p className="text-base text-gray-500 text-center py-6">Aucun intervenant disponible — <Link href="/admin/speakers/new" className="text-indigo-600 font-bold underline">en créer un</Link></p>
            ) : speakers.map(s => (
              <label key={s.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-gray-800 cursor-pointer shadow-sm transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={selectedSpeakers.includes(s.id)}
                  onChange={() => toggleSpeaker(s.id)}
                  className="w-5 h-5 accent-indigo-600 rounded"
                />
                <span className="text-base font-medium text-gray-800 dark:text-gray-200">{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl px-6 py-4 text-base font-medium">{error}</div>}
        <div className="flex justify-end gap-5 pt-8 mt-4 border-t border-gray-100 dark:border-gray-700">
          <Link href="/admin/sessions" className="px-6 py-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold transition-colors">Annuler</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25">
            <Save className="w-5 h-5" />
            {loading ? 'Création...' : 'Créer la session'}
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
