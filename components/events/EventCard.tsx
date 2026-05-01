'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string | null
    startDate: Date
    endDate: Date
    location: string | null
  }
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const isMultiDay = event.startDate.toDateString() !== event.endDate.toDateString()

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full hover:shadow-xl transition-all">
        <CardHeader className="border-b-0 pb-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {event.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {event.description || 'Aucune description'}
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(event.startDate)}
                {isMultiDay && ` - ${formatDate(event.endDate)}`}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}