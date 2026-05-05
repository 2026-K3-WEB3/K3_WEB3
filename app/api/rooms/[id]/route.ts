import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const room = await prisma.room.findUnique({
        where: { id: params.id },
        include: { sessions: { orderBy: { startTime: "asc" } } },
    })
    if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(room)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await prisma.room.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Deleted" })
}