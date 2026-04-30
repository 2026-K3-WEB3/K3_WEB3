import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const questions = await prisma.question.findMany({
        where: { sessionId: params.id },
        orderBy: { upvotes: "desc" },
    })
    return NextResponse.json(questions)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()

    // Vérifier que la session est live
    const session = await prisma.session.findUnique({ where: { id: params.id } })
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 })

    const now = new Date()
    const isLive = now >= session.startTime && now <= session.endTime
    if (!isLive) return NextResponse.json({ error: "Session is not live" }, { status: 403 })

    const question = await prisma.question.create({
        data: {
            content: body.content,
            author: body.author ?? null,
            sessionId: params.id,
        },
    })
    return NextResponse.json(question, { status: 201 })
}