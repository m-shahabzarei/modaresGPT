import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { differenceInDays } from "date-fns"
import SubscriptionCard from "@/components/dashboard/SubscriptionCard"

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return null
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "ACTIVE" && sub.endDate && new Date(sub.endDate) > new Date()
  )

  const subscriptionTypes = [
    {
      type: "MONTHLY" as const,
      name: "یک ماهه",
      description: "دسترسی کامل به تمام خدمات برای یک ماه",
      price: "رایگان",
    },
    {
      type: "QUARTERLY" as const,
      name: "سه ماهه",
      description: "دسترسی کامل به تمام خدمات برای سه ماه",
      price: "تخفیف ویژه",
    },
    {
      type: "YEARLY" as const,
      name: "یک ساله",
      description: "دسترسی کامل به تمام خدمات برای یک سال",
      price: "بهترین قیمت",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">مدیریت اشتراک</h1>
        <p className="text-gray-600">اشتراک خود را خریداری یا تمدید کنید</p>
      </div>

      {activeSubscription && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle>اشتراک فعال</CardTitle>
            <CardDescription>
              اشتراک شما فعال است و تا {new Date(activeSubscription.endDate!).toLocaleDateString('fa-IR')} اعتبار دارد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">نوع:</span>{" "}
                {activeSubscription.type === "MONTHLY" && "یک ماهه"}
                {activeSubscription.type === "QUARTERLY" && "سه ماهه"}
                {activeSubscription.type === "YEARLY" && "یک ساله"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">روزهای باقی‌مانده:</span>{" "}
                {differenceInDays(new Date(activeSubscription.endDate!), new Date())} روز
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!activeSubscription && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle>اشتراک شما فعال نیست</CardTitle>
            <CardDescription>
              برای استفاده از خدمات، لطفا یکی از پلن‌های زیر را انتخاب کنید
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">پلن‌های اشتراک</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {subscriptionTypes.map((plan) => (
            <SubscriptionCard
              key={plan.type}
              type={plan.type}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              isActive={activeSubscription?.type === plan.type}
            />
          ))}
        </div>
      </div>

      {subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تاریخچه اشتراک‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">
                      {sub.type === "MONTHLY" && "یک ماهه"}
                      {sub.type === "QUARTERLY" && "سه ماهه"}
                      {sub.type === "YEARLY" && "یک ساله"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {sub.startDate && new Date(sub.startDate).toLocaleDateString('fa-IR')}
                      {sub.endDate && ` - ${new Date(sub.endDate).toLocaleDateString('fa-IR')}`}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      sub.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {sub.status === "ACTIVE" ? "فعال" : "منقضی شده"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
