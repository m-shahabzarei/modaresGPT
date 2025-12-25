import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import AdminPanel from "@/components/admin/AdminPanel"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    include: {
      subscriptions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      _count: {
        select: {
          subscriptions: true,
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "asc",
    },
  })

  const prompts = await prisma.prompt.findMany({
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
    <AdminPanel
      users={users as any}
      services={services}
      prompts={prompts as any}
    />
  )
}

