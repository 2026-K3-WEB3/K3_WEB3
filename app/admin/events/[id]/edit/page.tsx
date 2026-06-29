import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditEventForm } from './EditEventForm'

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } })
  if (!event) notFound()
  return <EditEventForm event={event} />
}
