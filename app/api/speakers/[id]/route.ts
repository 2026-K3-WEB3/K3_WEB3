import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const speaker = await prisma.speaker.findUnique({
        where: { id },
        include: { sessions: { include: { session: { include: { room: true } } } } },
    })
    if (!speaker) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(speaker)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()
    const speaker = await prisma.speaker.update({ where: { id }, data: body })
    return NextResponse.json(speaker)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await prisma.speaker.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
}