'use client'

import { useState, useEffect } from 'react'
import { QuestionList } from './QuestionList'
import { QuestionForm } from './QuestionForm'
import type { Question } from '@prisma/client'

interface SessionDetailClientProps {
  sessionId: string
  initialQuestions: Question[]
  isLive: boolean
}

export function SessionDetailClient({
  sessionId,
  initialQuestions,
  isLive: initialIsLive,
}: SessionDetailClientProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [isLive, setIsLive] = useState(initialIsLive)
  const [refetchInterval, setRefetchInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/sessions/${sessionId}/questions`)
          const newQuestions = await response.json()
          setQuestions(newQuestions)
        } catch (error) {
          console.error('Erreur lors du rafraîchissement:', error)
        }
      }, 5000)

      setRefetchInterval(interval)
      return () => clearInterval(interval)
    } else if (refetchInterval) {
      clearInterval(refetchInterval)
    }
  }, [isLive, sessionId])

  const handleNewQuestion = async (content: string, authorName?: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, author: authorName }),
      })

      if (response.ok) {
        const newQuestion = await response.json()
        setQuestions(prev => [newQuestion, ...prev])
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de l\'envoi de la question')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'envoi de la question')
    }
  }

  const handleUpvote = async (questionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      })

      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestions(prev => prev.map(q => q.id === questionId ? updatedQuestion : q))
      }
    } catch (error) {
      console.error('Erreur lors de l\'upvote:', error)
    }
  }

  return (
    <div
      className="glass"
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💬 Questions & Réponses
        </h2>
        {isLive && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(34,197,94,0.15)',
              color: '#4ade80',
              border: '1px solid rgba(34,197,94,0.3)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
              }}
              className="animate-blink"
            />
            Live — Posez vos questions !
          </span>
        )}
      </div>

      {isLive && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-overlay)',
          }}
        >
          <QuestionForm onSubmit={handleNewQuestion} />
        </div>
      )}

      <div style={{ padding: '1.25rem 1.5rem' }}>
        {!isLive && questions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💭</p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>
              Session terminée
            </p>
            <p style={{ fontSize: '0.8125rem' }}>
              Les questions ne sont plus acceptées pour cette session.
            </p>
          </div>
        )}

        <QuestionList questions={questions} onUpvote={handleUpvote} isLive={isLive} />
      </div>
    </div>
  )
}