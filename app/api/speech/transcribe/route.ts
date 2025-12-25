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

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json(
        { error: "فایل صوتی ارسال نشده" },
        { status: 400 }
      )
    }

    // استفاده از Whisper API برای تبدیل گفتار به متن
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile as any,
      model: "whisper-1",
      language: "fa",
    })

    const text = transcription.text

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("Speech transcription error:", error)
    return NextResponse.json(
      { error: error.message || "خطایی در تبدیل گفتار به متن رخ داد" },
      { status: 500 }
    )
  }
}
