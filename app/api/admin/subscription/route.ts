import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { SubscriptionType } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 })
    }

    const body = await request.json()
    const { userId, type } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      )
    }

    // غیرفعال کردن اشتراک‌های قبلی
    await prisma.subscription.updateMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      data: {
        status: "EXPIRED",
      },
    })

    // محاسبه تاریخ شروع و پایان
    const startDate = new Date()
    const endDate = new Date()
    
    if (type === "MONTHLY") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (type === "QUARTERLY") {
      endDate.setMonth(endDate.getMonth() + 3)
    } else if (type === "YEARLY") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        type: type as SubscriptionType,
        status: "ACTIVE",
        startDate,
        endDate,
      },
    })

    return NextResponse.json({
      message: "اشتراک با موفقیت فعال شد",
      subscription,
    })
  } catch (error) {
    console.error("Admin subscription activation error:", error)
    return NextResponse.json(
      { error: "خطایی رخ داد" },
      { status: 500 }
    )
  }
}

