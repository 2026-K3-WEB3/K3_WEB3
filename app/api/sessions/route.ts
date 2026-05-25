import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const sessions = await prisma.session.findMany({
    include: {
      event: true,
      room: true,
      speakers: { include: { speaker: true } },
    },
    orderBy: { startTime: 'asc' },
  })
  return NextResponse.json(sessions)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const newSession = await prisma.session.create({
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

  // Ajouter les relations avec les speakers
  if (body.speakerIds && body.speakerIds.length > 0) {
    await prisma.sessionSpeaker.createMany({
      data: body.speakerIds.map((speakerId: string) => ({
        sessionId: newSession.id,
        speakerId,
      })),
    })
  }

  return NextResponse.json(newSession, { status: 201 })
}