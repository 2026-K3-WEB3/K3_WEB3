'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteButtonProps {
  id: string
  title: string
  endpoint: string
  onDelete?: () => void
}

export function DeleteButton({ id, title, endpoint, onDelete }: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return

    setIsDeleting(true)
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        if (onDelete) onDelete()
        else router.refresh()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur réseau')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {isDeleting ? '...' : 'Supprimer'}
    </button>
  )
}