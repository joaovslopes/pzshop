"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface License {
  _id: string;
  token: string;
  domain: string;
  expirationDate: string;
  themeUrl: string;
  updateUrl: string;
  downloader: "active" | "disabled";
  dashboard: "active" | "disabled";
}

interface EditLicenseModalProps {
  license: License;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: { themeUrl: string; updateUrl: string }) => void;
}

export function EditLicenseModal({
  license,
  isOpen,
  onClose,
  onSave,
}: EditLicenseModalProps) {
  const [formData, setFormData] = useState({
    themeUrl: "",
    updateUrl: "",
  });

  // Quando o modal abre ou a license muda, pré-carrega os valores existentes
  useEffect(() => {
     setFormData({
      themeUrl: license.themeUrl ?? "",
      updateUrl: license.updateUrl ?? "",
    });
  }, [license]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[EditLicenseModal] submitting formData:", formData);
    onSave({
      themeUrl: formData.themeUrl,
      updateUrl: formData.updateUrl,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Editar Licença: {license.domain}</DialogTitle>
          <DialogDescription>
            Atualize os campos abaixo e clique em Salvar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Token</Label>
              <Input
                id="token"
                name="token"
                value={license.token}
                disabled
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                name="domain"
                value={license.domain}
                disabled
                className="rounded-xl bg-muted/20 cursor-not-allowed"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="themeUrl">Theme URL</Label>
              <Input
                id="themeUrl"
                name="themeUrl"
                placeholder="https://theme.seudominio.com"
                value={formData.themeUrl}
                onChange={handleChange}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Inclua o protocolo (https://)
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updateUrl">Update URL</Label>
              <Input
                id="updateUrl"
                name="updateUrl"
                placeholder="https://update.seudominio.com"
                value={formData.updateUrl}
                onChange={handleChange}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Inclua o protocolo (https://)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
