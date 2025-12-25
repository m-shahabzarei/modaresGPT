"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText } from "lucide-react"

export default function LessonPlanPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: "",
    grade: "",
    duration: "",
    objectives: "",
  })
  const [result, setResult] = useState<string>("")

  const handleGenerate = async () => {
    if (!formData.topic.trim() || loading) return

    setLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/lesson-plan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد")
      }

      setResult(data.plan)
      toast({
        title: "موفق",
        description: "طرح درس با موفقیت ایجاد شد",
      })
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطایی در ایجاد طرح درس رخ داد",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">ساخت طرح درس</h1>
        <p className="text-gray-600">طراحی طرح درس کامل و حرفه‌ای</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات طرح درس</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">موضوع درس</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="مثال: ریاضی، جمع اعداد"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">پایه تحصیلی</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="مثال: پایه سوم"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="90"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objectives">اهداف یادگیری</Label>
              <Input
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="اهداف درس را شرح دهید..."
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || !formData.topic.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال ایجاد...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 ml-2" />
                  ایجاد طرح درس
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
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                  {result}
                </pre>
              </div>
            )}
            {!loading && !result && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                طرح درسی ایجاد نشده است
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

