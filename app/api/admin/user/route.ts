import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 })
    }

    const body = await request.json()
    const { email, phone, password, role } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "کاربری با این ایمیل وجود دارد" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        phone: phone || null,
        password: hashedPassword,
        role: role || "USER",
      },
    })

    return NextResponse.json({
      message: "کاربر با موفقیت ایجاد شد",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json(
      { error: "خطایی در ایجاد کاربر رخ داد" },
      { status: 500 }
    )
  }
}

