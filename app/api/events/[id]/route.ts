import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await prisma.event.findUnique({
        where: { id },
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()
    const event = await prisma.event.update({ where: { id }, data: body })
    return NextResponse.json(event)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await prisma.event.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
}