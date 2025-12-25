import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OPENAI_MODEL = "gpt-4o-mini";

export async function POST(request: Request) {
  try {
    /* -------------------- Auth -------------------- */
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "کاربر احراز هویت نشده است" },
        { status: 401 }
      );
    }

    /* ---------------- Subscription ---------------- */
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        endDate: {
          gt: new Date(),
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "اشتراک فعال ندارید" },
        { status: 403 }
      );
    }

    /* -------------------- Body -------------------- */
    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "فرمت پیام‌ها معتبر نیست" },
        { status: 400 }
      );
    }

    /* ------------- Format Messages --------------- */
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: String(msg.content),
    }));

    /* ---------------- OpenAI Call ---------------- */
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: formattedMessages,
      temperature: 0.7,
    });

    const response =
      completion.choices[0]?.message?.content ??
      "پاسخی از مدل دریافت نشد";

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "خطایی در پردازش درخواست رخ داده است",
      },
      { status: 500 }
    );
  }
}
