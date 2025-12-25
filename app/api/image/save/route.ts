import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, imageUrl, model } = body

    if (!prompt || !imageUrl) {
      return NextResponse.json(
        { error: "پرامپت و URL تصویر الزامی است" },
        { status: 400 }
      )
    }

    // ذخیره تصویر در دیتابیس
    const image = await prisma.generatedImage.create({
      data: {
        userId: session.user.id,
        prompt,
        imageUrl,
        model: model || "dall-e-3",
      },
    })

    // ذخیره به عنوان پرامپت در کتابخانه
    await prisma.prompt.create({
      data: {
        userId: session.user.id,
        title: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
        prompt,
        imageUrl,
        isPublic: false, // فقط برای خود کاربر قابل مشاهده است
      },
    })

    return NextResponse.json({
      message: "تصویر با موفقیت ذخیره شد",
      image,
    })
  } catch (error) {
    console.error("Image save error:", error)
    return NextResponse.json(
      { error: "خطایی در ذخیره تصویر رخ داد" },
      { status: 500 }
    )
  }
}
