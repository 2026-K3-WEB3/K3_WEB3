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
                                        isLive: initialIsLive
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
                headers: {
                    'Content-Type': 'application/json',
                },
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questionId }),
            })

            if (response.ok) {
                const updatedQuestion = await response.json()
                setQuestions(prev =>
                    prev.map(q =>
                        q.id === questionId ? updatedQuestion : q
                    )
                )
            }
        } catch (error) {
            console.error('Erreur lors de l\'upvote:', error)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b p-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    💬 Questions & Réponses
                    {isLive && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Live - Posez vos questions !
            </span>
                    )}
                </h2>
            </div>

            {isLive && (
                <div className="p-6 border-b bg-gray-50">
                    <QuestionForm onSubmit={handleNewQuestion} />
                </div>
            )}

            <div className="p-6">
                {!isLive && questions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg mb-2">💭 Session terminée</p>
                        <p className="text-sm">
                            Les questions ne sont plus acceptées pour cette session.
                        </p>
                    </div>
                )}

                <QuestionList
                    questions={questions}
                    onUpvote={handleUpvote}
                    isLive={isLive}
                />
            </div>
        </div>
    )
}