import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const question = await prisma.question.update({
        where: { id: body.questionId },
        data: { upvotes: { increment: 1 } },
    })
    return NextResponse.json(question)
}