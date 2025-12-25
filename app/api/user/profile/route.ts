import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
      },
    })

    return NextResponse.json({
      message: "پروفایل به‌روزرسانی شد",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "خطایی در به‌روزرسانی پروفایل رخ داد" },
      { status: 500 }
    )
  }
}

