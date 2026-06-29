'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface Speaker {
  id: string; name: string; bio: string | null; photo: string | null
}

export function EditSpeakerForm({ speaker }: { speaker: Speaker }) {
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
    }
    const res = await fetch(`/api/speakers/${speaker.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) { router.push('/admin/speakers'); router.refresh() }
    else { setError('Erreur lors de la modification.'); setLoading(false) }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '640px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link
          href="/admin/speakers"
          style={{
            padding: '0.5rem', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)', display: 'flex', textDecoration: 'none',
            transition: 'all var(--transition-fast)',
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Modifier l&apos;intervenant</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Nom complet *
          </label>
          <input
            name="name" required defaultValue={speaker.name}
            style={{
              width: '100%', padding: '0.75rem 1rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
              fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
              transition: 'border-color var(--transition-fast)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-mid)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Biographie
          </label>
          <textarea
            name="bio" rows={4} defaultValue={speaker.bio ?? ''}
            style={{
              width: '100%', padding: '0.75rem 1rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
              fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
              resize: 'vertical', transition: 'border-color var(--transition-fast)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-mid)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            URL Photo
          </label>
          <input
            name="photo" type="url" defaultValue={speaker.photo ?? ''} placeholder="https://..."
            style={{
              width: '100%', padding: '0.75rem 1rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
              fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
              transition: 'border-color var(--transition-fast)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-mid)' }}
          />
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
            color: '#f87171', fontSize: '0.8125rem',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <Link
            href="/admin/speakers"
            style={{
              padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem',
              textDecoration: 'none', transition: 'color var(--transition-fast)',
            }}
          >
            Annuler
          </Link>
          <button
            type="submit" disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = '' }}
          >
            <Save size={15} />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}
