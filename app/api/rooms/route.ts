import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: { sessions: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(rooms)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const room = await prisma.room.create({ data: { name: body.name } })
  return NextResponse.json(room, { status: 201 })
}