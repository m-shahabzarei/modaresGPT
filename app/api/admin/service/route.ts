import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 })
    }

    const body = await request.json()
    const { serviceId, isActive } = body

    if (!serviceId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      )
    }

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: { isActive },
    })

    return NextResponse.json({
      message: "وضعیت سرویس تغییر کرد",
      service,
    })
  } catch (error) {
    console.error("Service update error:", error)
    return NextResponse.json(
      { error: "خطایی رخ داد" },
      { status: 500 }
    )
  }
}

