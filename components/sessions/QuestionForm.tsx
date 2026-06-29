'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Send } from 'lucide-react'

interface QuestionFormProps {
  onSubmit: (content: string, authorName?: string) => Promise<void>
}

export function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setIsSubmitting(true)
    await onSubmit(content, isAnonymous ? undefined : authorName)
    setContent('')
    setAuthorName('')
    setIsSubmitting(false)
  }

  const maxLength = 300

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          placeholder="Posez votre question..."
          rows={3}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-mid)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-mid)' }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.75rem',
            fontSize: '0.7rem',
            color: content.length >= maxLength - 20 ? '#f87171' : 'var(--text-muted)',
          }}
        >
          {content.length}/{maxLength}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem 0.35rem 0.4rem',
            borderRadius: '99px',
            border: '1px solid var(--border-mid)',
            background: isAnonymous ? 'rgba(99,102,241,0.15)' : 'var(--bg-elevated)',
            color: isAnonymous ? '#a5b4fc' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            fontFamily: 'inherit',
          }}
        >
          <span
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: isAnonymous ? 'var(--accent-from)' : 'var(--border-mid)',
              transition: 'background var(--transition-fast)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          Anonyme
        </button>

        {!isAnonymous && (
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Votre nom"
            maxLength={50}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '0.4rem 0.85rem',
              background: 'var(--bg-base)',
              border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-mid)' }}
          />
        )}

        <Button type="submit" disabled={isSubmitting || !content.trim()} size="sm">
          <Send size={14} />
          {isSubmitting ? 'Envoi...' : 'Envoyer'}
        </Button>
      </div>
    </form>
  )
}