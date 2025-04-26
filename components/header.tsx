// components/Header.tsx
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Moon, Sun } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/hooks/use-translation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import Logo from "../public/logo-extensa.png"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsLogged(!!localStorage.getItem("token"))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLogged(false)
    router.push("/login")
  }

  const menuItems = [
    { name: t("common.home"), href: "/" },
    { name: t("common.products"), href: "/produtos" },
    { name: t("common.contact"),  href: "/contato" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#070707] text-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} width={130} alt="logo" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#ff8533]",
                isActive(item.href) ? "text-[#ff8533]" : "text-gray-300"
              )}
            >
              {item.name}
            </Link>
          ))}

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() =>
                  setTheme(resolvedTheme === "light" ? "dark" : "light")
                }
              >
                {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
            )}

            {/* Auth Buttons */}
            {!isLogged ? (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="border-[#ff8533] text-[#ff8533] hover:bg-[#ff8533] hover:text-white"
                >
                  <Link href="/login">{t("common.login")}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-[#ff8533] text-white hover:bg-[#ff8533]/90"
                >
                  <Link href="/cadastro">{t("common.register")}</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="border-[#ff8533] text-[#ff8533] hover:bg-[#ff8533] hover:text-white"
                >
                  <Link href="/dashboard">{t("common.dashboard")}</Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  {t("common.logout")}
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            className="p-2 rounded-md hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#070707] border-b p-4 flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#ff8533] p-2",
                  isActive(item.href) ? "text-[#ff8533]" : "text-gray-300"
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Buttons Mobile */}
            <div className="flex flex-col gap-2">
              {!isLogged ? (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-[#ff8533] text-[#ff8533] hover:bg-[#ff8533] hover:text-white"
                  >
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      {t("common.login")}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-[#ff8533] text-white hover:bg-[#ff8533]/90"
                  >
                    <Link href="/cadastro" onClick={() => setIsMenuOpen(false)}>
                      {t("common.register")}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-[#ff8533] text-[#ff8533] hover:bg-[#ff8533] hover:text-white"
                  >
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      {t("common.dashboard")}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    {t("common.logout")}
                  </Button>
                </>
              )}

              {/* Theme Toggle Mobile */}
              {mounted && (
                <Button
                  variant="ghost"
                  className="text-white w-full"
                  onClick={() =>
                    setTheme(resolvedTheme === "light" ? "dark" : "light")
                  }
                >
                  <div className="flex items-center gap-2 justify-center">
                    {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    <span>
                      {resolvedTheme === "light" ? "Modo Escuro" : "Modo Claro"}
                    </span>
                  </div>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
