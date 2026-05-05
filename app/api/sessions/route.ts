import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const sessions = await prisma.session.findMany({
        include: {
            room: true,
            event: true,
            speakers: { include: { speaker: true } },
            questions: true,
        },
    })
    return NextResponse.json(sessions)
}

export async function POST(req: Request) {
    const body = await req.json()
    const { speakerIds, ...data } = body
    const session = await prisma.session.create({
        data: {
            ...data,
            speakers: {
                create: speakerIds.map((id: string) => ({ speakerId: id })),
            },
        },
    })
    return NextResponse.json(session, { status: 201 })
}