"use client"

import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"

export function FooterContent() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-300">{t("common.footer.rights")}</p>
      <LanguageSwitcher />
    </div>
  )
}
