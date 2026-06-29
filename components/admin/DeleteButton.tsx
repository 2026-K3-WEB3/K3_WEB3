'use client'

import { Trash2 } from 'lucide-react'

export function DeleteButton({ id, title, endpoint }: { id: string; title: string; endpoint: string }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        if (confirm(`Supprimer "${title}" ?`)) {
          fetch(`${endpoint}/${id}`, { method: 'DELETE' }).then(() => location.reload())
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.85rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        background: 'transparent',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)'
        e.currentTarget.style.color = '#f87171'
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.color = 'var(--text-muted)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <Trash2 size={12} />
      Supprimer
    </button>
  )
}
