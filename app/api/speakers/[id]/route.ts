import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const speaker = await prisma.speaker.findUnique({
        where: { id: params.id },
        include: { sessions: { include: { session: { include: { room: true } } } } },
    })
    if (!speaker) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(speaker)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const speaker = await prisma.speaker.update({ where: { id: params.id }, data: body })
    return NextResponse.json(speaker)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await prisma.speaker.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Deleted" })
}