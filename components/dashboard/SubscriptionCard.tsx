"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { SubscriptionType } from "@prisma/client"

interface SubscriptionCardProps {
  type: SubscriptionType
  name: string
  description: string
  price: string
  isActive: boolean
}

export default function SubscriptionCard({
  type,
  name,
  description,
  price,
  isActive,
}: SubscriptionCardProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد")
      }

      toast({
        title: "موفق",
        description: "اشتراک با موفقیت فعال شد",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطایی رخ داد",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={isActive ? "border-blue-500 border-2" : ""}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-blue-600">{price}</p>
          </div>
          <Button
            className="w-full"
            onClick={handleSubscribe}
            disabled={loading || isActive}
            variant={isActive ? "outline" : "default"}
          >
            {loading
              ? "در حال پردازش..."
              : isActive
              ? "اشتراک فعال"
              : "خرید اشتراک"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

