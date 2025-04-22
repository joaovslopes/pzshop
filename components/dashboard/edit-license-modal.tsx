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

interface License {
  id: string
  token: string
  domain: string
  expirationDate: string
  status: "active" | "expired"
  downloader: "active" | "disabled"
  dashboard: "active" | "disabled"
}

interface EditLicenseModalProps {
  license: License
  isOpen: boolean
  onClose: () => void
  onSave: (license: Partial<License>) => void
}

export function EditLicenseModal({ license, isOpen, onClose, onSave }: EditLicenseModalProps) {
  const [formData, setFormData] = useState({
    domain: license.domain,
    themeUrl: "",
    updateUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...license,
      domain: formData.domain,
      // Outros campos que seriam enviados para a API
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit License #{license.id}</DialogTitle>
          <DialogDescription>Complete all the fields correctly</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Token</Label>
              <Input id="token" name="token" value={license.token} disabled className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" name="domain" value={formData.domain} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="themeUrl">Theme URL</Label>
              <Input
                id="themeUrl"
                name="themeUrl"
                placeholder="theme.seudominio.com"
                value={formData.themeUrl}
                onChange={handleChange}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">Sem http://</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updateUrl">Update URL</Label>
              <Input
                id="updateUrl"
                name="updateUrl"
                placeholder="update.seudominio.com"
                value={formData.updateUrl}
                onChange={handleChange}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">Sem http://</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
