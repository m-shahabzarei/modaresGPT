import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 })
    }

    // بررسی اشتراک فعال
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        endDate: {
          gt: new Date(),
        },
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "اشتراک شما فعال نیست. لطفا اشتراک خریداری کنید" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { prompt, model } = body

    if (!prompt) {
      return NextResponse.json(
        { error: "پرامپت الزامی است" },
        { status: 400 }
      )
    }

    // استفاده از DALL-E برای ایجاد تصویر
    const imageResponse = await openai.images.generate({
      model: model === "dall-e-3" ? "dall-e-3" : "dall-e-2",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    })

    const imageUrl = imageResponse.data[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: "خطا در ایجاد تصویر" },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl })
  } catch (error: any) {
    console.error("Image generation error:", error)
    return NextResponse.json(
      { error: error.message || "خطایی در ایجاد تصویر رخ داد" },
      { status: 500 }
    )
  }
}

