import { prisma } from '@/lib/prisma'
import { EventCard } from '@/components/events/EventCard'

async function getEvents() {
  const events = await prisma.event.findMany({
    include: {
      sessions: {
        include: {
          room: true,
          speakers: {
            include: {
              speaker: true
            }
          }
        }
      }
    },
    orderBy: {
      startDate: 'asc',
    },
  })
  return events
}

export default async function HomePage() {
  const events = await getEvents()

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              EventSync
            </h1>
            <p className="text-xl opacity-90">
              Gérez vos événements et interagissez en temps réel
            </p>
          </div>
        </section>

        {/* Events List */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Événements à venir</h2>

          {events.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                Aucun événement à venir pour le moment.
              </p>
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