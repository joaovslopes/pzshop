"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"


export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative w-full py-24 md:py-32 bg-custom-bg bg-cover bg-center bg-fixed">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl text-white md:text-6xl font-bold tracking-tighter">{t("common.welcome")}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px]">{t("common.subtitle")}</p>
          <Button
            size="lg"
            className="rounded-2xl text-lg px-8 bg-[#ff8533] hover:bg-[#ff8533]/90 text-white"
            onClick={() => {
              document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {t("common.exploreProducts")}
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Background decorative elements 
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ff8533]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ff8533]/10 rounded-full blur-3xl" />
      </div>*/}
    </section>
  )
}
