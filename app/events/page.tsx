import { prisma } from '@/lib/prisma'
import { EventCard } from '@/components/events/EventCard'
import { Calendar } from 'lucide-react'

export const metadata = {
    title: 'Événements — EventSync',
}

async function getEvents() {
    return prisma.event.findMany({
        include: {
            sessions: {
                include: {
                    room: true,
                    speakers: { include: { speaker: true } },
                },
            },
        },
        orderBy: { startDate: 'asc' },
    })
}

export default async function EventsPage() {
    const events = await getEvents()

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-8 h-8" />
                        <h1 className="text-3xl md:text-4xl font-bold">Événements</h1>
                    </div>
                    <p className="text-lg opacity-90">Tous les événements disponibles sur EventSync.</p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-12">
                {events.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
                        <p className="text-lg">Aucun événement pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}