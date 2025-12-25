"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mic, Square } from "lucide-react"

export default function SpeechToTextPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [result, setResult] = useState<string>("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await handleTranscribe(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (error) {
      toast({
        title: "خطا",
        description: "دسترسی به میکروفون میسر نیست",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const handleTranscribe = async (audioBlob: Blob) => {
    setLoading(true)
    setResult("")

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")

      const response = await fetch("/api/speech/transcribe", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد")
      }

      setResult(data.text)
      toast({
        title: "موفق",
        description: "تبدیل گفتار به متن با موفقیت انجام شد",
      })
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطایی در تبدیل گفتار به متن رخ داد",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">تبدیل گفتار به متن</h1>
        <p className="text-gray-600">تبدیل صوت به متن با دقت بالا</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ضبط صدا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              {recording ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <p className="text-lg font-semibold text-red-600">در حال ضبط...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">برای شروع ضبط، دکمه زیر را فشار دهید</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!recording ? (
                <Button
                  onClick={startRecording}
                  disabled={loading}
                  className="w-full"
                >
                  <Mic className="w-4 h-4 ml-2" />
                  شروع ضبط
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="w-full"
                >
                  <Square className="w-4 h-4 ml-2" />
                  توقف ضبط
                </Button>
              )}
            </div>
            {loading && (
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="mr-2">در حال پردازش...</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>متن تبدیل شده</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                  <p className="whitespace-pre-wrap">{result}</p>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(result)
                    toast({
                      title: "کپی شد",
                      description: "متن به کلیپ‌بورد کپی شد",
                    })
                  }}
                  className="mt-4 w-full"
                  variant="outline"
                >
                  کپی متن
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                متنی تبدیل نشده است
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

