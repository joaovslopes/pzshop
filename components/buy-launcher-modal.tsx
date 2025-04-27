"use client"

import axios from "axios"
import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [formData, setFormData] = useState({ domain: "", themeUrl: "", updateUrl: "" })
  const [license, setLicense] = useState<{ token: string; expirationDate: string } | null>(null)
  const [domainExists, setDomainExists] = useState(false)
  const [checkingDomain, setCheckingDomain] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ domain: "", themeUrl: "", updateUrl: "" })
      setLoading(false)
      setLicense(null)
      setDomainExists(false)
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // If editing domain, trigger check
    if (name === "domain") {
      setDomainExists(false)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (!value) return
      setCheckingDomain(true)
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await axios.get("https://apisite.pzdev.com.br/api/launcher/check-domain", { params: { domain: value } })
          setDomainExists(res.data.exists)
        } catch {
          // ignore errors
        } finally {
          setCheckingDomain(false)
        }
      }, 500)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (domainExists) {
      toast({ variant: "destructive", title: t("buyModal.errorTitle"), description: t("buyModal.duplicateDomain", { domain: formData.domain }) })
      return
    }
    if (!formData.domain || !formData.themeUrl || !formData.updateUrl) {
      toast({ variant: "destructive", title: t("buyModal.errorTitle"), description: t("buyModal.fillAllFields") })
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast({ variant: "destructive", title: t("buyModal.errorTitle"), description: t("buyModal.notAuthenticated") })
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(
        "https://apisite.pzdev.com.br/api/buy/license",
        { domain: formData.domain, themeUrl: formData.themeUrl, updateUrl: formData.updateUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const lic = res.data.data
      setLicense({ token: lic.token, expirationDate: lic.expirationDate })
      toast({ title: t("buyModal.successTitle"), description: t("buyModal.successMessage") })
    } catch (err: any) {
      const resp = err.response
      let message = t("buyModal.errorMessage")
      if (resp) {
        const text = resp.data?.message as string | undefined
        if (resp.status === 400 && text?.includes("duplicate key")) {
          message = t("buyModal.duplicateDomain", { domain: formData.domain })
        } else if (text) {
          message = text
        }
      }
      toast({ variant: "destructive", title: t("buyModal.errorTitle"), description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t("buyModal.title")}</DialogTitle>
        </DialogHeader>

        {license ? (
          <div className="space-y-4">
            <p className="break-all"><strong>{t("buyModal.tokenLabel")}:</strong> {license.token}</p>
            <p><strong>{t("buyModal.expiryLabel")}:</strong> {new Date(license.expirationDate).toLocaleDateString("pt-BR")}</p>
            <DialogFooter>
              <Button onClick={onClose}>{t("buyModal.close")}</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="domain">{t("buyModal.domain")}</Label>
              <Input
                id="domain"
                name="domain"
                placeholder="exemplodelicenca.com"
                value={formData.domain}
                onChange={handleChange}
                required
                className="rounded-xl"
              />
              {checkingDomain && <p className="text-xs text-muted-foreground">{t("buyModal.checkingDomain")}</p>}
              {domainExists && !checkingDomain && <p className="text-xs text-destructive">{t("buyModal.duplicateDomain", { domain: formData.domain })}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="themeUrl">{t("buyModal.themeUrl")}</Label>
              <Input id="themeUrl" name="themeUrl" placeholder="theme.exemplodelicenca.com" value={formData.themeUrl} onChange={handleChange} required className="rounded-xl" />
              <p className="text-xs text-muted-foreground">{t("buyModal.withoutHttp")}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updateUrl">{t("buyModal.updateUrl")}</Label>
              <Input id="updateUrl" name="updateUrl" placeholder="update.exemplodelicenca.com" value={formData.updateUrl} onChange={handleChange} required className="rounded-xl" />
              <p className="text-xs text-muted-foreground">{t("buyModal.withoutHttp")}</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-[#ff8533] text-[#ff8533] hover:bg-[#ff8533] hover:text-white">{t("buyModal.cancel")}</Button>
              <Button type="submit" disabled={loading || domainExists} className="rounded-xl bg-[#ff8533] hover:bg-[#ff8533]/90 text-white">{loading ? t("buyModal.processing") : t("buyModal.confirm")}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
