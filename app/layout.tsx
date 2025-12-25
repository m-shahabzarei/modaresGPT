import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import SessionProvider from "@/components/providers/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Modares GPT - پلتفرم هوش مصنوعی آموزشی",
  description: "پلتفرم جامع خدمات هوش مصنوعی برای معلمان و دانشجویان",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}