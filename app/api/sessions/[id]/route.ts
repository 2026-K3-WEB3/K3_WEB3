import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      event: true,
      room: true,
      speakers: { include: { speaker: true } },
      questions: true,
    },
  })
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(session)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionAuth = await getServerSession(authOptions)
  if (!sessionAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updatedSession = await prisma.session.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      capacity: body.capacity ? parseInt(body.capacity) : null,
      eventId: body.eventId,
      roomId: body.roomId,
    },
  })

  if (body.speakerIds) {
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } })
    if (body.speakerIds.length > 0) {
      await prisma.sessionSpeaker.createMany({
        data: body.speakerIds.map((speakerId: string) => ({
          sessionId: id,
          speakerId,
        })),
      })
    }
  }

  return NextResponse.json(updatedSession)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } })
  await prisma.question.deleteMany({ where: { sessionId: id } })
  await prisma.session.delete({ where: { id } })
  return NextResponse.json({ message: 'Deleted' })
}
