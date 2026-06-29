import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await prisma.session.findUnique({
        where: { id },
        include: {
            room: true,
            event: true,
            speakers: { include: { speaker: true } },
            questions: { orderBy: { upvotes: "desc" } },
        },
    })
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(session)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()
    const session = await prisma.session.update({ where: { id }, data: body })
    return NextResponse.json(session)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await prisma.session.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
}