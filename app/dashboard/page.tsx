import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Image as ImageIcon, FileText, Presentation, CreditCard, Mic, Calendar } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return null
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const services = await prisma.service.findMany()

  const isSubscriptionActive = subscription && subscription.endDate && new Date(subscription.endDate) > new Date()

  const serviceCards = [
    {
      type: "CHAT",
      title: "چت هوش مصنوعی",
      description: "گفتگوی هوشمند با مدل‌های پیشرفته",
      icon: MessageSquare,
      href: "/dashboard/chat",
    },
    {
      type: "IMAGE_GENERATOR",
      title: "تصویر ساز",
      description: "ایجاد تصاویر حرفه‌ای با هوش مصنوعی",
      icon: ImageIcon,
      href: "/dashboard/image",
    },
    {
      type: "LESSON_PLAN",
      title: "طرح درس",
      description: "طراحی طرح درس کامل و حرفه‌ای",
      icon: FileText,
      href: "/dashboard/lesson-plan",
    },
    {
      type: "POWERPOINT",
      title: "پاورپوینت ساز",
      description: "ایجاد ارائه‌های جذاب و حرفه‌ای",
      icon: Presentation,
      href: "/dashboard/powerpoint",
    },
    {
      type: "FLASHCARD",
      title: "فلش کارت ساز",
      description: "ساخت فلش کارت برای یادگیری بهتر",
      icon: CreditCard,
      href: "/dashboard/flashcard",
    },
    {
      type: "SPEECH_TO_TEXT",
      title: "گفتار به متن",
      description: "تبدیل صوت به متن با دقت بالا",
      icon: Mic,
      href: "/dashboard/speech",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">داشبورد</h1>
        <p className="text-gray-600">خوش آمدید {session.user.email}</p>
      </div>

      {!isSubscriptionActive && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle>اشتراک شما فعال نیست</CardTitle>
            <CardDescription>
              برای استفاده از خدمات، لطفا اشتراک خریداری کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/subscription">
              <Button>خرید اشتراک</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {isSubscriptionActive && subscription && (
        <Card>
          <CardHeader>
            <CardTitle>وضعیت اشتراک</CardTitle>
            <CardDescription>
              اشتراک شما تا {new Date(subscription.endDate!).toLocaleDateString('fa-IR')} فعال است
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">خدمات</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCards.map((service) => {
            const serviceData = services.find((s) => s.type === service.type)
            const Icon = service.icon
            const isActive = serviceData?.isActive && isSubscriptionActive

            return (
              <Card key={service.type} className={!isActive ? "opacity-50" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="w-8 h-8 text-blue-600" />
                    {!isActive && (
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">غیرفعال</span>
                    )}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={service.href}>
                    <Button className="w-full" disabled={!isActive}>
                      {isActive ? "استفاده" : "نیاز به اشتراک"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
