import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")

    const questions = await prisma.question.findMany({
        where: sessionId ? { sessionId } : {},
        orderBy: { upvotes: "desc" },
    })
    return NextResponse.json(questions)
}

export async function POST(req: Request) {
    const body = await req.json()
    const { content, author, sessionId } = body

    if (!content || !sessionId) {
        return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } })
    if (!session) return NextResponse.json({ error: "Session introuvable" }, { status: 404 })

    const now = new Date()
    const isLive = now >= session.startTime && now <= session.endTime
    if (!isLive) return NextResponse.json({ error: "Session non live" }, { status: 403 })

    const question = await prisma.question.create({
        data: {
            content,
            author: author ?? null,
            sessionId,
        },
    })
    return NextResponse.json(question, { status: 201 })
}