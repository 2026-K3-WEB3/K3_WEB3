import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const events = await prisma.event.findMany({
    include: { sessions: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      location: body.location,
    },
  })
  return NextResponse.json(event, { status: 201 })
}