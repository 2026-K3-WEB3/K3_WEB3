import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const rooms = await prisma.room.findMany({
        include: { sessions: true },
    })
    return NextResponse.json(rooms)
}

export async function POST(req: Request) {
    const body = await req.json()
    const room = await prisma.room.create({ data: body })
    return NextResponse.json(room, { status: 201 })
}