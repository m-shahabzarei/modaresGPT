"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard } from "lucide-react"

export default function FlashcardPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState("")
  const [result, setResult] = useState<string>("")

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return

    setLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/flashcard/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, count }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد")
      }

      setResult(data.cards)
      toast({
        title: "موفق",
        description: "فلش کارت‌ها با موفقیت ایجاد شد",
      })
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطایی در ایجاد فلش کارت رخ داد",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">فلش کارت ساز</h1>
        <p className="text-gray-600">ساخت فلش کارت برای یادگیری بهتر</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات فلش کارت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">موضوع</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="موضوع فلش کارت‌ها را وارد کنید..."
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">تعداد فلش کارت (اختیاری)</Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="20"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال ایجاد...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 ml-2" />
                  ایجاد فلش کارت
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>نتیجه</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}
            {!loading && result && (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                  {result}
                </pre>
              </div>
            )}
            {!loading && !result && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                فلش کارتی ایجاد نشده است
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

