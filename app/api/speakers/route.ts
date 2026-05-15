import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const speakers = await prisma.speaker.findMany({
    include: { sessions: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(speakers)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const speaker = await prisma.speaker.create({
    data: {
      name: body.name,
      photo: body.photo,
      bio: body.bio,
      links: body.links,
    },
  })
  return NextResponse.json(speaker, { status: 201 })
}