import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditSpeakerForm } from './EditSpeakerForm'

export default async function EditSpeakerPage({ params }: { params: { id: string } }) {
  const speaker = await prisma.speaker.findUnique({ where: { id: params.id } })
  if (!speaker) notFound()
  return <EditSpeakerForm speaker={speaker} />
}
