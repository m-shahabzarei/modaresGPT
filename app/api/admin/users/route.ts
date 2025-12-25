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

    const users = await prisma.user.findMany({
      include: {
        subscriptions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        _count: {
          select: {
            subscriptions: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json(
      { error: "خطایی رخ داد" },
      { status: 500 }
    )
  }
}

