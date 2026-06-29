'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      router.push('/admin/events')
      router.refresh()
    } else {
      setError('Erreur lors de la création.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-5 mb-12">
          <Link href="/admin/events" className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 tracking-tight">Nouvel événement</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Créer un tout nouvel événement</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 p-10 sm:p-14 space-y-10 shrink-0">
          <div>
            <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Titre *</label>
            <input name="title" required placeholder="Nom de l'événement" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner" />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Description *</label>
            <textarea name="description" required rows={5} placeholder="Description de l'événement..." className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Date de début *</label>
              <input name="startDate" type="datetime-local" required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner" />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Date de fin *</label>
              <input name="endDate" type="datetime-local" required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner" />
            </div>
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">Lieu *</label>
            <input name="location" required placeholder="Ex: Centre de conférences, Paris" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-white text-lg transition-all shadow-inner" />
          </div>
          {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl px-6 py-4 text-base font-medium">{error}</div>}
          <div className="flex justify-end gap-5 pt-8 mt-4 border-t border-gray-100 dark:border-gray-700">
            <Link href="/admin/events" className="px-6 py-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold transition-colors">Annuler</Link>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25">
              <Save className="w-5 h-5" />
              {loading ? 'Création...' : 'Créer l\'événement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
