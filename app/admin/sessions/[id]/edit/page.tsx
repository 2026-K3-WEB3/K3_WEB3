import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditSessionForm } from './EditSessionForm'

export default async function EditSessionPage({ params }: { params: { id: string } }) {
  const session = await prisma.session.findUnique({
    where: { id: params.id },
    include: { speakers: true }
  })

  if (!session) notFound()

  const [rooms, speakers, events] = await Promise.all([
    prisma.room.findMany(),
    prisma.speaker.findMany(),
    prisma.event.findMany(),
  ])

  return (
    <EditSessionForm
      session={session}
      rooms={rooms}
      speakers={speakers}
      events={events}
    />
  )
}
