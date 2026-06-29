'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewSpeakerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      bio: (form.elements.namedItem('bio') as HTMLTextAreaElement).value || null,
      photo: (form.elements.namedItem('photo') as HTMLInputElement).value || null,
      links: {},
    }
    const res = await fetch('/api/speakers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      router.push('/admin/speakers')
      router.refresh()
    } else {
      setError('Erreur lors de la création.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/speakers" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvel intervenant</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet *</label>
          <input name="name" required placeholder="Prénom Nom" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Biographie</label>
          <textarea name="bio" rows={4} placeholder="Description de l'intervenant..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">URL Photo de profil</label>
          <input name="photo" type="url" placeholder="https://exemple.com/photo.jpg" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800" />
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/speakers" className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium">Annuler</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            {loading ? 'Création...' : 'Créer l\'intervenant'}
          </button>
        </div>
      </form>
    </div>
  )
}
