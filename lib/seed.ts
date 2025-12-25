import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // ایجاد خدمات
  const services = [
    {
      type: "IMAGE_GENERATOR",
      name: "هوش مصنوعی تصویر ساز",
      description: "ایجاد تصاویر حرفه‌ای با هوش مصنوعی",
      isActive: false,
    },
    {
      type: "LESSON_PLAN",
      name: "هوش مصنوعی ساخت طرح درس",
      description: "طراحی طرح درس کامل و حرفه‌ای",
      isActive: false,
    },
    {
      type: "CHAT",
      name: "هوش مصنوعی چت",
      description: "گفتگوی هوشمند با مدل‌های پیشرفته",
      isActive: false,
    },
    {
      type: "POWERPOINT",
      name: "هوش مصنوعی پاورپوینت ساز",
      description: "ایجاد ارائه‌های جذاب و حرفه‌ای",
      isActive: false,
    },
    {
      type: "FLASHCARD",
      name: "هوش مصنوعی ساخت فلش کارت",
      description: "ساخت فلش کارت برای یادگیری بهتر",
      isActive: false,
    },
    {
      type: "SPEECH_TO_TEXT",
      name: "تبدیل گفتار به متن",
      description: "تبدیل صوت به متن با دقت بالا",
      isActive: false,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { type: service.type as any },
      update: {},
      create: service as any,
    })
  }

  console.log("Services seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

