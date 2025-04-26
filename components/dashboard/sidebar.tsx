"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  LayoutDashboardIcon,
  ShoppingBagIcon,
  Code,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Logo from "../../public/logo-extensa.png"
import { cn } from "@/lib/utils"

interface UserProps {
  name: string
  email: string
  avatar?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://apisite.pzdev.com.br"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<UserProps>({
    name: "",
    email: "",
    avatar: "/placeholder.svg?height=40&width=40",
  })
  const [loadingUser, setLoadingUser] = useState(true)
  const [userError, setUserError] = useState(false)

  const loadUser = useCallback(async () => {
    setLoadingUser(true)
    setUserError(false)

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 401) {
        localStorage.removeItem("token")
        router.push("/login")
        return
      }

      if (res.status >= 500) {
        setUserError(true)
        return
      }

      const jr = await res.json()
      if (!res.ok || !jr.success) {
        setUserError(true)
        return
      }

      setUser({
        name: jr.data.name,
        email: jr.data.email,
        avatar: jr.data.avatar || "/placeholder.svg?height=40&width=40",
      })
    } catch (err) {
      console.error("Erro ao carregar usuário:", err)
      setUserError(true)
    } finally {
      setLoadingUser(false)
    }
  }, [router])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const menuItems = [
    { title: "Início", icon: Home, href: "/dashboard" },
    { title: "PZ Launcher", icon: LayoutDashboardIcon, href: "/dashboard/launcher" },
    //{ title: "PZ Scripts", icon: Code, href: "/dashboard/scripts" },
    { title: "Loja", icon: ShoppingBagIcon, href: "/dashboard/loja" },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b ">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src={Logo} width={150} alt="logo" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-6 px-4">
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

      <SidebarFooter className="border-t p-4">
        {loadingUser ? (
          <div className="text-center text-sm text-muted-foreground">Carregando perfil…</div>
        ) : userError ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-destructive">Não foi possível carregar o perfil.</p>
            <button
              onClick={loadUser}
              className="text-sm underline hover:text-destructive"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full rounded-xl p-2 hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden text-left">
                  <p className="text-sm font-medium truncate text-primary">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/configuracoes">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
