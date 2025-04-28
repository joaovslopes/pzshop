"use client";

import axios from "axios";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface BuyLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  productId: string;
}

export function BuyLauncherModal({ isOpen, onClose, userId, productId }: BuyLauncherModalProps) {
  const [formData, setFormData] = useState({
    domain: "",
    themeUrl: "",
    updateUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainExists, setDomainExists] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Se estiver digitando o domínio, checar
    if (name === "domain") {
      setDomainExists(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value) return;

      setCheckingDomain(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await axios.get("https://apisite.pzdev.com.br/api/launcher/check-domain", { params: { domain: value } });
          setDomainExists(res.data.exists);
        } catch {
          // Pode ignorar erros de checagem
        } finally {
          setCheckingDomain(false);
        }
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.domain || !formData.themeUrl || !formData.updateUrl) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (domainExists) {
      toast.error("Este domínio já está em uso. Escolha outro.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    setLoading(true);
    try {

      console.log({
        userId,
        productId,
        domain: formData.domain,
        themeUrl: formData.themeUrl,
        updateUrl: formData.updateUrl
      });
      const response = await axios.post(
        "https://apisite.pzdev.com.br/api/payment/create-launcher",
        {
          userId,
          productId,
          domain: formData.domain,
          themeUrl: formData.themeUrl,
          updateUrl: formData.updateUrl
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        window.location.href = response.data.init_point;
      } else {
        toast.error("Erro ao criar pagamento.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao criar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Configure seu Launcher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="domain">Domínio</Label>
            <Input
              id="domain"
              name="domain"
              placeholder="exemplo.com.br"
              value={formData.domain}
              onChange={handleChange}
              required
              className="rounded-xl"
            />
            {checkingDomain && (
              <p className="text-xs text-muted-foreground">Verificando domínio...</p>
            )}
            {domainExists && !checkingDomain && (
              <p className="text-xs text-destructive">Este domínio já está em uso.</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="themeUrl">URL do Tema</Label>
            <Input
              id="themeUrl"
              name="themeUrl"
              placeholder="theme.exemplo.com.br"
              value={formData.themeUrl}
              onChange={handleChange}
              required
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="updateUrl">URL de Atualização</Label>
            <Input
              id="updateUrl"
              name="updateUrl"
              placeholder="update.exemplo.com.br"
              value={formData.updateUrl}
              onChange={handleChange}
              required
              className="rounded-xl"
            />
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading || domainExists} 
              className="w-full bg-[#ff8533] hover:bg-[#ff8533]/90 text-white rounded-xl"
            >
              {loading ? "Redirecionando..." : "Comprar Launcher"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
