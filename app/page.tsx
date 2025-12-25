import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Modares GPT
          </h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">ورود</Button>
            </Link>
            <Link href="/register">
              <Button>ثبت نام</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            پلتفرم هوش مصنوعی آموزشی
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            ابزارهای قدرتمند هوش مصنوعی برای معلمان و دانشجویان
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6">
              شروع کنید
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>هوش مصنوعی تصویر ساز</CardTitle>
              <CardDescription>
                ایجاد تصاویر حرفه‌ای با هوش مصنوعی
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ساخت طرح درس</CardTitle>
              <CardDescription>
                طراحی طرح درس کامل و حرفه‌ای
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>چت هوش مصنوعی</CardTitle>
              <CardDescription>
                گفتگوی هوشمند با مدل‌های پیشرفته
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>پاورپوینت ساز</CardTitle>
              <CardDescription>
                ایجاد ارائه‌های جذاب و حرفه‌ای
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>فلش کارت ساز</CardTitle>
              <CardDescription>
                ساخت فلش کارت برای یادگیری بهتر
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تبدیل گفتار به متن</CardTitle>
              <CardDescription>
                تبدیل صوت به متن با دقت بالا
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>اشتراک‌های ما</CardTitle>
              <CardDescription>
                انتخاب بهترین پلن برای شما
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-bold mb-2">یک ماهه</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-4">رایگان</p>
                  <ul className="text-right space-y-2">
                    <li>✓ دسترسی به تمام خدمات</li>
                    <li>✓ پشتیبانی</li>
                  </ul>
                </div>
                <div className="p-6 border rounded-lg border-blue-500">
                  <h3 className="text-xl font-bold mb-2">سه ماهه</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-4">تخفیف ویژه</p>
                  <ul className="text-right space-y-2">
                    <li>✓ دسترسی به تمام خدمات</li>
                    <li>✓ پشتیبانی اولویت‌دار</li>
                  </ul>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-bold mb-2">یک ساله</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-4">بهترین قیمت</p>
                  <ul className="text-right space-y-2">
                    <li>✓ دسترسی به تمام خدمات</li>
                    <li>✓ پشتیبانی 24/7</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}