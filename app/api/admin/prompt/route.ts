import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, prompt, imageUrl, isPublic } = body

    if (!title || !prompt) {
      return NextResponse.json(
        { error: "عنوان و پرامپت الزامی است" },
        { status: 400 }
      )
    }

    const newPrompt = await prisma.prompt.create({
      data: {
        title,
        description: description || null,
        prompt,
        imageUrl: imageUrl || null,
        isPublic: isPublic || false,
        userId: null, // پرامپت ادمین
      },
    })

    return NextResponse.json({
      message: "پرامپت با موفقیت ایجاد شد",
      prompt: newPrompt,
    })
  } catch (error) {
    console.error("Prompt creation error:", error)
    return NextResponse.json(
      { error: "خطایی در ایجاد پرامپت رخ داد" },
      { status: 500 }
    )
  }
}

