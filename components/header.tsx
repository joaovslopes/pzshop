"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/hooks/use-translation"
import Image from "next/image"
import Logo from "../public/logo-extensa.png"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()

  const menuItems = [
    { name: t("common.home"), href: "/" },
    { name: t("common.products"), href: "/produtos" },
    { name: t("common.contact"), href: "/contato" },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#070707] text-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} width={130} alt="logo" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#ff8533]",
                isActive(item.href) ? "text-[#ff8533]" : "text-gray-300",
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="outline"
              asChild
              className="border-[#ff8533] text-[#ff8533] hover:bg-[#ff8533] hover:text-white"
            >
              <Link href="/login">{t("common.login")}</Link>
            </Button>
            <Button asChild className="bg-[#ff8533] text-white hover:bg-[#ff8533]/90">
              <Link href="/cadastro">{t("common.register")}</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#070707] border-b p-4 flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#ff8533] p-2",
                  isActive(item.href) ? "text-[#ff8533]" : "text-gray-300",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                asChild
                className="w-full border-[#ff8533] text-[#ff8533] hover:bg-[#ff8533] hover:text-white"
              >
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  {t("common.login")}
                </Link>
              </Button>
              <Button asChild className="w-full bg-[#ff8533] text-white hover:bg-[#ff8533]/90">
                <Link href="/cadastro" onClick={() => setIsMenuOpen(false)}>
                  {t("common.register")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
