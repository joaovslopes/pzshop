"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function ObrigadoLauncherPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId    = searchParams.get("userId");
  const productId = searchParams.get("productId");
  const paymentId = searchParams.get("payment_id");
  const status    = searchParams.get("status");

  const [step, setStep] = useState<"verifying" | "form" | "error" | "success">("verifying");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [formData, setFormData] = useState({
    domain: "",
    themeUrl: "",
    updateUrl: ""
  });
  const [loadingSave, setLoadingSave] = useState(false);

  // domain validation
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainExists, setDomainExists] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // 1) Verify payment on mount
  useEffect(() => {
    async function verify() {
      if (!userId || !productId || !paymentId || status !== "approved") {
        setErrorMsg("Parâmetros inválidos ou pagamento não aprovado.");
        setStep("error");
        return;
      }

      try {
        const res = await axios.get("https://apisite.pzdev.com.br/api/dashboard/obrigado-launcher", {
          params: { userId, productId, payment_id: paymentId, status }
        });
        if (res.data.success) {
          setStep("form");
        } else {
          setErrorMsg(res.data.message || "Falha na verificação do pagamento.");
          setStep("error");
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.response?.data?.message || "Erro interno ao verificar pagamento.");
        setStep("error");
      }
    }
    verify();
  }, [userId, productId, paymentId, status]);

  // 2) Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "domain") {
      setDomainExists(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value) return;

      setCheckingDomain(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const { data } = await axios.get("https://apisite.pzdev.com.br/api/launcher/check-domain", {
            params: { domain: value }
          });
          setDomainExists(data.exists);
        } catch {
          // ignore errors
        } finally {
          setCheckingDomain(false);
        }
      }, 500);
    }
  };

  // 3) Handle form submission
  const handleSubmit = async (e: FormEvent) => {
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

    setLoadingSave(true);
    try {
      await axios.post(
        "https://apisite.pzdev.com.br/api/buy/license",
        {
          userId,
          domain: formData.domain,
          themeUrl: formData.themeUrl,
          updateUrl: formData.updateUrl
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Licença criada com sucesso!");
      setStep("success");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar licença.");
    } finally {
      setLoadingSave(false);
    }
  };

  // Render
  if (step === "verifying") {
    return (
      <div className="">
        <p>Validando pagamento, aguarde...</p>
      </div>
    );
  }
  if (step === "error") {
    return (
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Ocorreu um erro!</h1>
        <p className="text-center mb-6">{errorMsg}</p>
        <Button onClick={() => router.push("/")} className="bg-[#ff8533]">
          Voltar para Home
        </Button>
      </div>
    );
  }
  if (step === "success") {
    return (
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Licença criada com sucesso!</h1>
        <p className="mb-6">Obrigado por configurar seu launcher. Você já pode utilizá-lo normalmente!</p>
        <Button onClick={() => router.push("/dashboard/scripts")} className="bg-[#ff8533]">
          Ir para área de downloads
        </Button>
      </div>
    );
  }
  // step === "form"
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6 mt-16">
      <h1 className="text-3xl font-bold text-center">Configure seu Launcher</h1>

      <div className="space-y-1">
        <Label htmlFor="domain">Domínio</Label>
        <Input
          id="domain"
          name="domain"
          placeholder="exemplo.com.br"
          value={formData.domain}
          onChange={handleChange}
          required
        />
        {checkingDomain && <p className="text-xs text-muted-foreground">Verificando domínio...</p>}
        {domainExists && !checkingDomain && (
          <p className="text-xs text-destructive">Este domínio já está em uso. Escolha outro.</p>
        )}
      </div>

      <div className="space-y-1">
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

      <div className="space-y-1">
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
        className="w-full bg-[#ff8533] hover:bg-[#e6742b] text-white"
        disabled={loadingSave || domainExists}
      >
        {loadingSave ? "Salvando..." : "Salvar Configuração"}
      </Button>
    </form>
  );
}
