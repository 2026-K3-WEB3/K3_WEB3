import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditRoomForm } from './EditRoomForm'

export default async function EditRoomPage({ params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({ where: { id: params.id } })
  if (!room) notFound()
  return <EditRoomForm room={room} />
}
