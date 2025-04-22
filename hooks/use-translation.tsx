"use client"

import { useLanguage } from "@/components/language-provider"
import translations from "@/translations"

export function useTranslation() {
  const { language } = useLanguage()

  const t = (key: string) => {
    const keys = key.split(".")
    let value = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key // Retorna a chave se a tradução não for encontrada
      }
    }

    return value as string
  }

  return { t, language }
}
