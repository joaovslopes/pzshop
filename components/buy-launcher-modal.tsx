"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/hooks/use-translation"

interface BuyLauncherModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
}

export function BuyLauncherModal({ isOpen, onClose, productId, productName }: BuyLauncherModalProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    domain: "",
    themeUrl: "",
    updateUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Validação básica
      if (!formData.domain) {
        throw new Error(t("buyModal.domainRequired"))
      }

      // Simulação de envio para API
      // const response = await fetch("/api/buy/license", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     productId,
      //     ...formData
      //   }),
      // })

      // if (!response.ok) {
      //   throw new Error("Erro ao processar a compra")
      // }

      // Simulando sucesso
      console.log("Compra processada:", { productId, ...formData })

      toast({
        title: t("buyModal.successTitle"),
        description: t("buyModal.successMessage"),
      })

      onClose()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: t("buyModal.errorTitle"),
        description: error instanceof Error ? error.message : t("buyModal.errorMessage"),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t("buyModal.title", { product: productName })}</DialogTitle>
          <DialogDescription>{t("buyModal.subtitle")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="domain">{t("buyModal.domain")}</Label>
              <Input
                id="domain"
                name="domain"
                placeholder="seuservidor.com.br"
                value={formData.domain}
                onChange={handleChange}
                className="rounded-xl"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="themeUrl">{t("buyModal.themeUrl")}</Label>
              <Input
                id="themeUrl"
                name="themeUrl"
                placeholder="theme.seuservidor.com.br"
                value={formData.themeUrl}
                onChange={handleChange}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">{t("buyModal.withoutHttp")}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updateUrl">{t("buyModal.updateUrl")}</Label>
              <Input
                id="updateUrl"
                name="updateUrl"
                placeholder="update.seuservidor.com.br"
                value={formData.updateUrl}
                onChange={handleChange}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">{t("buyModal.withoutHttp")}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-[#ff8533] text-[#ff8533] hover:bg-[#ff8533] hover:text-white"
            >
              {t("buyModal.cancel")}
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-[#ff8533] hover:bg-[#ff8533]/90 text-white"
              disabled={loading}
            >
              {loading ? t("buyModal.processing") : t("buyModal.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
