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
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">💬 Aucune question pour le moment</p>
                <p className="text-sm">
                    {isLive
                        ? "Soyez le premier à poser une question !"
                        : "Les questions seront disponibles pendant la session live."}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {questions.map((question) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <p className="text-gray-800 mb-2">{question.content}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  {question.author ? `👤 ${question.author}` : '🔒 Anonyme'}
                </span>
                                <span>🕒 {new Date(question.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onUpvote(question.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="font-semibold text-gray-700">{question.upvotes}</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}