"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function ObrigadoLauncherPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

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
    if (!token || !userId) {
      toast.error("Usuário não autenticado.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://apisite.pzdev.com.br/api/buy/license",
        {
          userId,
          domain: formData.domain,
          themeUrl: formData.themeUrl,
          updateUrl: formData.updateUrl
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Licença criada com sucesso!");
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao salvar licença.");
    } finally {
      setLoading(false);
    }
  };

  if (!userId || !productId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Informações inválidas!</h1>
          <p>Não conseguimos identificar sua compra. Por favor, entre em contato com o suporte.</p>
          <Button onClick={() => router.push("/")} className="mt-6">
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Licença criada com sucesso!</h1>
          <p>Obrigado por configurar seu launcher. Você já pode utilizá-lo normalmente!</p>
          <Button onClick={() => router.push("/")} className="mt-6">
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Configure seu Launcher</h1>
          <p className="text-muted-foreground text-sm">Preencha as informações abaixo para finalizar a criação da sua licença.</p>
        </div>

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
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ff8533] hover:bg-[#ff8533]/90 text-white rounded-xl"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Licença"}
          </Button>
        </form>
      </div>
    </div>
  );
}
