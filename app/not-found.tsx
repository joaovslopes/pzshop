"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8 text-center">{t("common.notFound")}</p>
      <Button asChild className="bg-[#ff8533] hover:bg-[#ff8533]/90 text-white">
        <Link href="/">{t("common.backToHome")}</Link>
      </Button>
    </div>
  )
}
