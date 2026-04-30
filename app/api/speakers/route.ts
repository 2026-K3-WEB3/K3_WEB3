import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const speakers = await prisma.speaker.findMany({
        include: { sessions: { include: { session: true } } },
    })
    return NextResponse.json(speakers)
}

export async function POST(req: Request) {
    const body = await req.json()
    const speaker = await prisma.speaker.create({ data: body })
    return NextResponse.json(speaker, { status: 201 })
}