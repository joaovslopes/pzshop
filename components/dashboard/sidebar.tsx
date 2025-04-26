"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, LayoutDashboardIcon, ShoppingBagIcon, Code } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Logo from "../../public/logo-extensa-preta.png"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface UserProps {
  name: string
  email: string
  avatar?: string
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserProps>({
    name: "",
    email: "",
    avatar: "/placeholder.svg?height=40&width=40",
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
  
    fetch("http://localhost:5005/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Não autorizado")
        return res.json()
      })
      .then((resJson: { success: boolean; data: { name: string; email: string; avatar?: string } }) => {
        if (!resJson.success) throw new Error("Erro ao obter usuário")
        const { name, email, avatar } = resJson.data
        setUser({
          name,
          email,
          avatar: avatar || "/placeholder.svg?height=40&width=40",
        })
      })
      .catch((err) => {
        console.error(err)
        localStorage.removeItem("token")
        router.push("/login")
      })
  }, [router])
  
  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const menuItems = [
    { title: "Início", icon: Home, href: "/dashboard" },
    { title: "PZ Launcher", icon: LayoutDashboardIcon, href: "/dashboard/launcher" },
    { title: "PZ Scripts", icon: Code, href: "/dashboard/scripts" },
    { title: "Loja", icon: ShoppingBagIcon, href: "/dashboard/loja" },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b bg-white">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src={Logo} width={250} alt="logo" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white py-6 px-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "hover:text-primary bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-2">{item.title}</span>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 bg-white">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full rounded-xl p-2 hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-sm font-medium truncate text-primary">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
