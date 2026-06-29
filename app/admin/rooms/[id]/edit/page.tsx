import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditRoomForm } from './EditRoomForm'

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const room = await prisma.room.findUnique({ where: { id } })
  if (!room) notFound()
  return <EditRoomForm room={room} />
}
