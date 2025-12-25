"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Download } from "lucide-react"
import Image from "next/image"

const IMAGE_MODELS = [
  { value: "dall-e-3", label: "DALL-E 3" },
  { value: "dall-e-2", label: "DALL-E 2" },
  { value: "midjourney", label: "Midjourney" },
  { value: "stable-diffusion", label: "Stable Diffusion" },
]

export default function ImageGeneratorPage() {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("dall-e-3")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState("")

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return

    setLoading(true)
    setGeneratedImage(null)

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد")
      }

      setGeneratedImage(data.imageUrl)
      setGeneratedPrompt(prompt)
      
      toast({
        title: "موفق",
        description: "تصویر با موفقیت ایجاد شد",
      })
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطایی در ایجاد تصویر رخ داد",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToLibrary = async () => {
    if (!generatedImage || !generatedPrompt) return

    try {
      const response = await fetch("/api/image/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: generatedPrompt,
          imageUrl: generatedImage,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        throw new Error("خطا در ذخیره")
      }

      toast({
        title: "موفق",
        description: "تصویر به کتابخانه اضافه شد",
      })
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">تصویر ساز هوش مصنوعی</h1>
          <p className="text-gray-600">ایجاد تصاویر حرفه‌ای با هوش مصنوعی</p>
        </div>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="انتخاب مدل" />
          </SelectTrigger>
          <SelectContent>
            {IMAGE_MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ایجاد تصویر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">پرامپت</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="توضیح دهید چه تصویری می‌خواهید..."
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال ایجاد...
                </>
              ) : (
                "ایجاد تصویر"
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
            {!loading && generatedImage && (
              <div className="space-y-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={generatedImage}
                    alt="Generated"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveToLibrary}
                    variant="outline"
                    className="flex-1"
                  >
                    ذخیره در کتابخانه
                  </Button>
                  <Button
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = generatedImage
                      link.download = "generated-image.png"
                      link.click()
                    }}
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            {!loading && !generatedImage && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                تصویری ایجاد نشده است
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

