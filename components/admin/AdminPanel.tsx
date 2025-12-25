"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UserPlus, Check, X } from "lucide-react"
import Image from "next/image"

interface AdminPanelProps {
  users: any[]
  services: any[]
  prompts: any[]
}

export default function AdminPanel({ users: initialUsers, services: initialServices, prompts: initialPrompts }: AdminPanelProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState(initialUsers)
  const [services, setServices] = useState(initialServices)
  const [prompts, setPrompts] = useState(initialPrompts)
  const [loading, setLoading] = useState(false)

  const [newUserForm, setNewUserForm] = useState({
    email: "",
    phone: "",
    password: "",
    role: "USER",
  })

  const [newPromptForm, setNewPromptForm] = useState({
    title: "",
    description: "",
    prompt: "",
    imageUrl: "",
    isPublic: false,
  })

  const handleActivateSubscription = async (userId: string, type: "MONTHLY" | "QUARTERLY" | "YEARLY") => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, type }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد")
      }

      toast({
        title: "موفق",
        description: "اشتراک با موفقیت فعال شد",
      })

      // Refresh users
      const res = await fetch("/api/admin/users")
      const usersData = await res.json()
      setUsers(usersData.users)
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleService = async (serviceId: string, isActive: boolean) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/service", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceId, isActive }),
      })

      if (!response.ok) {
        throw new Error("خطایی رخ داد")
      }

      const updatedServices = services.map((s) =>
        s.id === serviceId ? { ...s, isActive: !isActive } : s
      )
      setServices(updatedServices)

      toast({
        title: "موفق",
        description: "وضعیت سرویس تغییر کرد",
      })
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد")
      }

      toast({
        title: "موفق",
        description: "کاربر با موفقیت ایجاد شد",
      })

      setNewUserForm({ email: "", phone: "", password: "", role: "USER" })
      const res = await fetch("/api/admin/users")
      const usersData = await res.json()
      setUsers(usersData.users)
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePrompt = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPromptForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد")
      }

      toast({
        title: "موفق",
        description: "پرامپت با موفقیت اضافه شد",
      })

      setNewPromptForm({ title: "", description: "", prompt: "", imageUrl: "", isPublic: false })
      const res = await fetch("/api/admin/prompts")
      const promptsData = await res.json()
      setPrompts(promptsData.prompts)
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">پنل مدیریت</h1>
        <p className="text-gray-600">مدیریت کاربران، خدمات و پرامپت‌ها</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">کاربران</TabsTrigger>
          <TabsTrigger value="services">خدمات</TabsTrigger>
          <TabsTrigger value="prompts">پرامپت‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>کاربران</CardTitle>
                  <CardDescription>مدیریت کاربران و اشتراک‌های آن‌ها</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 ml-2" />
                      افزودن کاربر
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>افزودن کاربر جدید</DialogTitle>
                      <DialogDescription>
                        اطلاعات کاربر جدید را وارد کنید
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>ایمیل</Label>
                        <Input
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                          type="email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>شماره موبایل</Label>
                        <Input
                          value={newUserForm.phone}
                          onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>رمز عبور</Label>
                        <Input
                          value={newUserForm.password}
                          onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                          type="password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>نقش</Label>
                        <Select
                          value={newUserForm.role}
                          onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">کاربر</SelectItem>
                            <SelectItem value="ADMIN">مدیر</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCreateUser} disabled={loading} className="w-full">
                        {loading ? "در حال ایجاد..." : "ایجاد کاربر"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => {
                  const activeSubscription = user.subscriptions?.[0]
                  const isActive = activeSubscription?.status === "ACTIVE" &&
                    activeSubscription?.endDate &&
                    new Date(activeSubscription.endDate) > new Date()

                  return (
                    <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{user.email}</p>
                        <p className="text-sm text-gray-600">
                          {user.name || user.phone || "بدون نام"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isActive
                            ? `اشتراک فعال: ${activeSubscription.type}`
                            : "اشتراک فعال نیست"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value) =>
                            handleActivateSubscription(user.id, value as any)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="فعال‌سازی" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MONTHLY">یک ماهه</SelectItem>
                            <SelectItem value="QUARTERLY">سه ماهه</SelectItem>
                            <SelectItem value="YEARLY">یک ساله</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>خدمات</CardTitle>
              <CardDescription>مدیریت وضعیت خدمات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-gray-600">{service.description}</p>
                      )}
                    </div>
                    <Button
                      variant={service.isActive ? "default" : "outline"}
                      onClick={() => handleToggleService(service.id, service.isActive)}
                      disabled={loading}
                    >
                      {service.isActive ? (
                        <>
                          <Check className="w-4 h-4 ml-2" />
                          فعال
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 ml-2" />
                          غیرفعال
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>پرامپت‌ها</CardTitle>
                  <CardDescription>مدیریت کتابخانه پرامپت</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 ml-2" />
                      افزودن پرامپت
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>افزودن پرامپت جدید</DialogTitle>
                      <DialogDescription>
                        اطلاعات پرامپت را وارد کنید
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>عنوان</Label>
                        <Input
                          value={newPromptForm.title}
                          onChange={(e) =>
                            setNewPromptForm({ ...newPromptForm, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>توضیحات</Label>
                        <Input
                          value={newPromptForm.description}
                          onChange={(e) =>
                            setNewPromptForm({
                              ...newPromptForm,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>پرامپت</Label>
                        <textarea
                          value={newPromptForm.prompt}
                          onChange={(e) =>
                            setNewPromptForm({ ...newPromptForm, prompt: e.target.value })
                          }
                          className="w-full min-h-[100px] border rounded-md p-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL تصویر</Label>
                        <Input
                          value={newPromptForm.imageUrl}
                          onChange={(e) =>
                            setNewPromptForm({ ...newPromptForm, imageUrl: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={newPromptForm.isPublic}
                          onChange={(e) =>
                            setNewPromptForm({
                              ...newPromptForm,
                              isPublic: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="isPublic">عمومی</Label>
                      </div>
                      <Button
                        onClick={handleCreatePrompt}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? "در حال ایجاد..." : "ایجاد پرامپت"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

