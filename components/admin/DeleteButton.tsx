'use client'

import { Trash2 } from 'lucide-react'

export function DeleteButton({ id, title, endpoint }: { id: string; title: string; endpoint: string }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        if (confirm(`Supprimer "${title}" ?`)) {
          fetch(`${endpoint}/${id}`, { method: 'DELETE' }).then(() => location.reload())
        }
      }}
      className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium cursor-pointer"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Supprimer
    </a>
  )
}
