"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  User,
  CreditCard,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Presentation,
  CreditCard as FlashcardIcon,
  Mic,
  BookOpen,
  LogOut,
  Settings,
} from "lucide-react"

interface DashboardNavProps {
  user: {
    id: string
    email: string
    name?: string | null
    role: string
  }
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "پروفایل", icon: User },
    { href: "/dashboard/subscription", label: "اشتراک", icon: CreditCard },
    { href: "/dashboard/chat", label: "چت هوش مصنوعی", icon: MessageSquare },
    { href: "/dashboard/image", label: "تصویر ساز", icon: ImageIcon },
    { href: "/dashboard/lesson-plan", label: "طرح درس", icon: FileText },
    { href: "/dashboard/powerpoint", label: "پاورپوینت", icon: Presentation },
    { href: "/dashboard/flashcard", label: "فلش کارت", icon: FlashcardIcon },
    { href: "/dashboard/speech", label: "گفتار به متن", icon: Mic },
    { href: "/dashboard/prompts", label: "کتابخانه پرامپت", icon: BookOpen },
  ]

  if (user.role === "ADMIN") {
    navItems.push({ href: "/dashboard/admin", label: "مدیریت", icon: Settings })
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8 space-x-reverse">
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modares GPT
            </Link>
            <div className="flex items-center space-x-4 space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

