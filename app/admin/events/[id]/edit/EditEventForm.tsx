'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
}

export function EditEventForm({ event }: { event: Event }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toDatetimeLocal = (date: Date) => {
    return new Date(date).toISOString().slice(0, 16)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      startDate: new Date((form.elements.namedItem('startDate') as HTMLInputElement).value).toISOString(),
      endDate: new Date((form.elements.namedItem('endDate') as HTMLInputElement).value).toISOString(),
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
    }
    const res = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      router.push('/admin/events')
      router.refresh()
    } else {
      setError('Erreur lors de la modification.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/events" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier l&apos;événement</h1>
          <p className="text-gray-500 mt-1 text-sm truncate">{event.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
          <input name="title" required defaultValue={event.title} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          <textarea name="description" required rows={4} defaultValue={event.description} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début *</label>
            <input name="startDate" type="datetime-local" required defaultValue={toDatetimeLocal(event.startDate)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin *</label>
            <input name="endDate" type="datetime-local" required defaultValue={toDatetimeLocal(event.endDate)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lieu *</label>
          <input name="location" required defaultValue={event.location} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/events" className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium">Annuler</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}
