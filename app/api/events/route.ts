import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const events = await prisma.event.findMany({
        include: {
            sessions: {
                include: { room: true, speakers: { include: { speaker: true } } },
            },
        },
    })
    return NextResponse.json(events)
}

export async function POST(req: Request) {
    const body = await req.json()
    const event = await prisma.event.create({ data: body })
    return NextResponse.json(event, { status: 201 })
}