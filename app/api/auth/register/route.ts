import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, phone, password } = body

    if (!email || !phone || !password) {
      return NextResponse.json(
        { error: "لطفا تمام فیلدها را پر کنید" },
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
        phone,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { message: "کاربر با موفقیت ایجاد شد", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "خطایی در ایجاد حساب کاربری رخ داد" },
      { status: 500 }
    )
  }
}

