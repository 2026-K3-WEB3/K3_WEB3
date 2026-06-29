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

  const toDatetimeLocal = (date: Date) => new Date(date).toISOString().slice(0, 16)

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
    if (res.ok) { router.push('/admin/events'); router.refresh() }
    else { setError('Erreur lors de la modification.'); setLoading(false) }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link
          href="/admin/events"
          style={{
            padding: '0.5rem', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)', display: 'flex', textDecoration: 'none',
            transition: 'all var(--transition-fast)',
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Modifier l&apos;événement</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
            {event.title}
          </p>
        </div>
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
            Titre *
          </label>
          <input
            name="title" required defaultValue={event.title}
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
            Description *
          </label>
          <textarea
            name="description" required rows={4} defaultValue={event.description}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Date de début *
            </label>
            <input
              name="startDate" type="datetime-local" required defaultValue={toDatetimeLocal(event.startDate)}
              style={{
                width: '100%', padding: '0.75rem 1rem',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                transition: 'border-color var(--transition-fast)',
                colorScheme: 'dark',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-mid)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Date de fin *
            </label>
            <input
              name="endDate" type="datetime-local" required defaultValue={toDatetimeLocal(event.endDate)}
              style={{
                width: '100%', padding: '0.75rem 1rem',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                transition: 'border-color var(--transition-fast)',
                colorScheme: 'dark',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-mid)' }}
            />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Lieu *
          </label>
          <input
            name="location" required defaultValue={event.location}
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
            href="/admin/events"
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
              background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
              color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.55)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            <Save size={15} />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}
