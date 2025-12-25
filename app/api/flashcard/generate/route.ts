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
        { error: "اشتراک شما فعال نیست" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { topic, count } = body

    if (!topic) {
      return NextResponse.json(
        { error: "موضوع الزامی است" },
        { status: 400 }
      )
    }

    const cardCount = count ? parseInt(count) : 20

    const prompt = `یک مجموعه فلش کارت برای موضوع "${topic}" با ${cardCount} کارت ایجاد کن.

برای هر فلش کارت:
- سوال یا کلمه کلیدی در یک طرف
- پاسخ یا تعریف در طرف دیگر

به صورت ساختار یافته و به زبان فارسی بنویس. هر کارت را با شماره مشخص کن و با --- جدا کن.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "شما یک متخصص در ساخت فلش کارت‌های آموزشی هستید.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const cards = completion.choices[0]?.message?.content || "خطایی رخ داد"

    return NextResponse.json({ cards })
  } catch (error: any) {
    console.error("Flashcard generation error:", error)
    return NextResponse.json(
      { error: error.message || "خطایی در ایجاد فلش کارت رخ داد" },
      { status: 500 }
    )
  }
}

