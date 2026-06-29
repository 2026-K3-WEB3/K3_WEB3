'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface Session {
  id: string; title: string; description: string | null; startTime: Date; endTime: Date;
  capacity: number | null; eventId: string; roomId: string;
  speakers: { speakerId: string }[]
}
interface Room { id: string; name: string }
interface Speaker { id: string; name: string }
interface Event { id: string; title: string }

export function EditSessionForm({ session, rooms, speakers, events }: { session: Session; rooms: Room[]; speakers: Speaker[]; events: Event[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>(session.speakers.map(s => s.speakerId))

  const toDatetimeLocal = (date: Date) => new Date(date).toISOString().slice(0, 16)

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
    const res = await fetch(`/api/sessions/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) { router.push('/admin/sessions'); router.refresh() }
    else { setError('Erreur lors de la modification.'); setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
    fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color var(--transition-fast)',
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%235c5c80' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '2.5rem',
  }

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent-from)'
  }
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--border-mid)'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link
          href="/admin/sessions"
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Modifier la session</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{session.title}</p>
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
            Événement *
          </label>
          <select name="eventId" required defaultValue={session.eventId} onFocus={inputFocus} onBlur={inputBlur} style={selectStyle}>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Titre *
          </label>
          <input name="title" required defaultValue={session.title} onFocus={inputFocus} onBlur={inputBlur} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Description
          </label>
          <textarea name="description" rows={3} defaultValue={session.description ?? ''} onFocus={inputFocus} onBlur={inputBlur} style={{ ...inputStyle, resize: 'vertical' as const }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Début *
            </label>
            <input name="startTime" type="datetime-local" required defaultValue={toDatetimeLocal(session.startTime)} onFocus={inputFocus} onBlur={inputBlur} style={{ ...inputStyle, colorScheme: 'dark' as const }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Fin *
            </label>
            <input name="endTime" type="datetime-local" required defaultValue={toDatetimeLocal(session.endTime)} onFocus={inputFocus} onBlur={inputBlur} style={{ ...inputStyle, colorScheme: 'dark' as const }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Salle *
            </label>
            <select name="roomId" required defaultValue={session.roomId} onFocus={inputFocus} onBlur={inputBlur} style={selectStyle}>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Capacité (informatif)
            </label>
            <input name="capacity" type="number" min="1" defaultValue={session.capacity ?? ''} onFocus={inputFocus} onBlur={inputBlur} style={inputStyle} />
          </div>
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
            href="/admin/sessions"
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
