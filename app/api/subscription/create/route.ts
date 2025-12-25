import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { SubscriptionType } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 })
    }

    const body = await request.json()
    const { type } = body

    if (!type || !["MONTHLY", "QUARTERLY", "YEARLY"].includes(type)) {
      return NextResponse.json(
        { error: "نوع اشتراک معتبر نیست" },
        { status: 400 }
      )
    }

    // غیرفعال کردن اشتراک‌های قبلی
    await prisma.subscription.updateMany({
      where: {
        userId: session.user.id,
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
        userId: session.user.id,
        type: type as SubscriptionType,
        status: "ACTIVE",
        startDate,
        endDate,
      },
    })

    return NextResponse.json({
      message: "اشتراک با موفقیت ایجاد شد",
      subscription,
    })
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json(
      { error: "خطایی در ایجاد اشتراک رخ داد" },
      { status: 500 }
    )
  }
}

