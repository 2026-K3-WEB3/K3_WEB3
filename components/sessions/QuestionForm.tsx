'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

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

        if (!content.trim()) {
            alert('Veuillez écrire votre question')
            return
        }

        setIsSubmitting(true)
        await onSubmit(content, isAnonymous ? undefined : authorName)
        setContent('')
        setAuthorName('')
        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre question
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écrivez votre question ici..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Poser anonymement</span>
                </label>

                {!isAnonymous && (
                    <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Votre nom"
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        maxLength={50}
                    />
                )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : 'Poser la question'}
            </Button>
        </form>
    )
}