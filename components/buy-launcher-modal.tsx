"use client";

import axios from "axios";
import { useState } from "react";
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
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.domain || !formData.themeUrl || !formData.updateUrl) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://apisite.pzdev.com.br/api/payment/create-launcher",
        {
          userId,
          productId,
          domain: formData.domain,
          themeUrl: formData.themeUrl,
          updateUrl: formData.updateUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        window.location.href = response.data.init_point; // 🔥 Redireciona para checkout
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

        {success ? (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold text-green-600">Licença criada com sucesso!</h2>
            <p className="text-muted-foreground text-sm">Agora seu launcher está pronto para uso.</p>
            <DialogFooter>
              <Button onClick={onClose} className="w-full">
                Fechar
              </Button>
            </DialogFooter>
          </div>
        ) : (
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
              <Button type="submit" disabled={loading} className="w-full bg-[#ff8533] hover:bg-[#ff8533]/90 text-white rounded-xl">
                {loading ? "Salvando..." : "Salvar Licença"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
