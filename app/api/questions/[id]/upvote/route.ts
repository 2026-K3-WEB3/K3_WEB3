import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(_: Request, { params }: { params: { id: string } }) {
    const question = await prisma.question.update({
        where: { id: params.id },
        data: { upvotes: { increment: 1 } },
    })
    return NextResponse.json(question)
}