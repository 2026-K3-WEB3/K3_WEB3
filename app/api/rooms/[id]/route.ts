import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const room = await prisma.room.findUnique({
        where: { id },
        include: { sessions: { orderBy: { startTime: "asc" } } },
    })
    if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(room)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await prisma.room.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
}