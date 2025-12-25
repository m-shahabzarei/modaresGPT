import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default async function PromptsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return null
  }

  const prompts = await prisma.prompt.findMany({
    where: {
      OR: [
        { isPublic: true },
        { userId: session.user.id },
      ],
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">کتابخانه پرامپت</h1>
        <p className="text-gray-600">تصاویر ساخته شده با هوش مصنوعی و پرامپت‌های آن‌ها</p>
      </div>

      {prompts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">هنوز پرامپتی در کتابخانه وجود ندارد</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="overflow-hidden">
            {prompt.imageUrl && (
              <div className="relative w-full aspect-square">
                <Image
                  src={prompt.imageUrl}
                  alt={prompt.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{prompt.title}</CardTitle>
              {prompt.description && (
                <CardDescription>{prompt.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    مشاهده پرامپت
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{prompt.title}</DialogTitle>
                    {prompt.description && (
                      <DialogDescription>{prompt.description}</DialogDescription>
                    )}
                  </DialogHeader>
                  <div className="space-y-4">
                    {prompt.imageUrl && (
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={prompt.imageUrl}
                          alt={prompt.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-2">پرامپت:</p>
                      <p className="text-sm whitespace-pre-wrap">{prompt.prompt}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      ایجاد شده توسط: {prompt.user?.name || prompt.user?.email || "ناشناس"}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

