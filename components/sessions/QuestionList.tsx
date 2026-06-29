'use client'

import { ThumbsUp } from 'lucide-react'
import type { Question } from '@prisma/client'

interface QuestionListProps {
  questions: Question[]
  onUpvote: (questionId: string) => Promise<void>
  isLive: boolean
}

export function QuestionList({ questions, onUpvote, isLive }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</div>
        <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
          Aucune question pour le moment
        </p>
        <p style={{ fontSize: '0.8125rem' }}>
          {isLive
            ? 'Soyez le premier à poser une question !'
            : 'Les questions seront disponibles pendant la session live.'}
        </p>
      </div>
    )
  }

  const sorted = [...questions].sort((a, b) => b.upvotes - a.upvotes)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {sorted.map((question) => {
        const initials = question.author
          ? question.author.slice(0, 2).toUpperCase()
          : '?'

        return (
          <div
            key={question.id}
            className="animate-slide-up"
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: question.author
                  ? 'linear-gradient(135deg, var(--accent-from), var(--accent-to))'
                  : 'var(--bg-surface)',
                border: '1px solid var(--border-mid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.55, marginBottom: '0.5rem' }}>
                {question.content}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{question.author || 'Anonyme'}</span>
                <span>·</span>
                <span>
                  {new Date(question.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpvote(question.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.45rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-mid)',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-from)'
                e.currentTarget.style.color = '#a5b4fc'
                e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-mid)'
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <ThumbsUp size={13} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{question.upvotes}</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}