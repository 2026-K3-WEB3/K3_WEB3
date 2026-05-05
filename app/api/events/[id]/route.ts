import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const event = await prisma.event.findUnique({
        where: { id: params.id },
        include: {
            sessions: {
                include: {
                    room: true,
                    speakers: { include: { speaker: true } },
                    questions: true,
                },
            },
        },
    })
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(event)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const event = await prisma.event.update({ where: { id: params.id }, data: body })
    return NextResponse.json(event)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await prisma.event.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Deleted" })
}