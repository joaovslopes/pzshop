"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutDashboardIcon, ShoppingBagIcon, Code, Settings, LogOut, ChevronDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Logo from "../../public/logo-extensa-preta.png"
import { cn } from "@/lib/utils" // ou classnames/tailwind-merge

interface UserProps {
  name: string
  email: string
  avatar?: string
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserProps>({
    name: "Usuário",
    email: "usuario@exemplo.com",
  })

  useEffect(() => {
    // Aqui você faria uma requisição para obter os dados do usuário
    // Simulando dados do usuário
    setUser({
      name: "João Silva",
      email: "joao.silva@exemplo.com",
      avatar: "/placeholder.svg?height=40&width=40",
    })
  }, [])

  const handleLogout = () => {
    // Remover o token e redirecionar para a página de login
    localStorage.removeItem("token")
    router.push("/login")
  }

  const menuItems = [
    {
      title: "Início",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "PZ Launcher",
      icon: LayoutDashboardIcon,
      href: "/dashboard/launcher",
    },
    {
      title: "PZ Scripts",
      icon: Code,
      href: "/dashboard/scripts",
    },
    {
      title: "Loja",
      icon: ShoppingBagIcon,
      href: "/dashboard/loja",
    },
  ]

  return (
    <Sidebar >
      <SidebarHeader className="border-b bg-white">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src={Logo} width={250} alt="logo" />
        </Link>
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ",
                    isActive ? "hover:text-primary bg-primary/10 text-primary" : "text-muted-foreground"
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
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name}/>
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
      </SidebarFooter>
    </Sidebar>
  )
}
