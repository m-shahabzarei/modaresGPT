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
    const { topic, grade, duration, objectives } = body

    if (!topic) {
      return NextResponse.json(
        { error: "موضوع درس الزامی است" },
        { status: 400 }
      )
    }

    const prompt = `یک طرح درس کامل و حرفه‌ای برای موضوع "${topic}" ${grade ? `در ${grade}` : ""} ${duration ? `با مدت زمان ${duration} دقیقه` : ""} ایجاد کن. ${objectives ? `اهداف یادگیری: ${objectives}` : ""}

طرح درس باید شامل این بخش‌ها باشد:
1. اهداف کلی
2. اهداف رفتاری
3. محتوا
4. روش تدریس
5. رسانه‌ها و وسایل کمک آموزشی
6. فعالیت‌های دانش‌آموزان
7. ارزشیابی
8. تکلیف

به صورت کامل و دقیق و به زبان فارسی بنویس.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "شما یک معلم باتجربه هستید که در نوشتن طرح درس مهارت دارید.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const plan = completion.choices[0]?.message?.content || "خطایی رخ داد"

    return NextResponse.json({ plan })
  } catch (error: any) {
    console.error("Lesson plan generation error:", error)
    return NextResponse.json(
      { error: error.message || "خطایی در ایجاد طرح درس رخ داد" },
      { status: 500 }
    )
  }
}

