import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 })
    }

    const prompts = await prisma.prompt.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ prompts })
  } catch (error) {
    console.error("Prompts fetch error:", error)
    return NextResponse.json(
      { error: "خطایی رخ داد" },
      { status: 500 }
    )
  }
}

