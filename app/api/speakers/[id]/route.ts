import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const speaker = await prisma.speaker.findUnique({
    where: { id: params.id },
    include: { sessions: { include: { session: true } } },
  })
  if (!speaker) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(speaker)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const speaker = await prisma.speaker.update({
    where: { id: params.id },
    data: {
      name: body.name,
      photo: body.photo,
      bio: body.bio,
      links: body.links,
    },
  })
  return NextResponse.json(speaker)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.speaker.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Deleted' })
}