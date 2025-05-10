"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface VerifyResponse {
  success: boolean;
  message?: string;
}

export default function ObrigadoLauncherPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query params
  const userId    = searchParams.get("userId");
  const productId = searchParams.get("productId");
  const paymentId = searchParams.get("payment_id");
  const status    = searchParams.get("status");

  // Page state
  const [step, setStep] = useState<"verifying" | "form" | "error" | "success">("verifying");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    domain: "",
    themeUrl: "",
    updateUrl: "",
  });
  const [loadingSave, setLoadingSave] = useState(false);

  // Domain check
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainExists, setDomainExists] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    async function verifyPurchase() {
      // 1) Validate minimal query params
      if (!userId || !productId || !paymentId || status !== "approved") {
        setErrorMsg("Parâmetros inválidos ou pagamento não aprovado.");
        setStep("error");
        return;
      }

      try {
        // 2) Call your backend endpoint to register license
        const res = await axios.get<VerifyResponse>(
          "https://apisite.pzdev.com.br/api/dashboard/obrigado-launcher",
          {
            params: {
              userId,
              productId,
              payment_id: paymentId,
              collection_status: status,
              status,
            },
          }
        );

        if (!res.data.success) {
          throw new Error(res.data.message || "Falha na verificação");
        }

        // Proceed to form
        setStep("form");
      } catch (err: any) {
        console.error("Erro ao verificar pagamento:", err);
        setErrorMsg(err.response?.data?.message || err.message || "Erro interno.");
        setStep("error");
      }
    }

    verifyPurchase();
  }, [userId, productId, paymentId, status]);

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
          const { data } = await axios.get<{ exists: boolean }>(
            "https://apisite.pzdev.com.br/api/launcher/check-domain",
            { params: { domain: value } }
          );
          setDomainExists(data.exists);
        } catch {
          // ignore
        } finally {
          setCheckingDomain(false);
        }
      }, 500);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { domain, themeUrl, updateUrl } = formData;

    if (!domain || !themeUrl || !updateUrl) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (domainExists) {
      toast.error("Este domínio já está em uso.");
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
        { userId, domain, themeUrl, updateUrl },
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

  if (step === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Validando pagamento, aguarde...</p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold">Ocorreu um erro!</h1>
        <p>{errorMsg}</p>
        <Button
          onClick={() => router.push("/")}
          className="bg-[#ff8533]"
        >
          Voltar para Home
        </Button>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold">Licença criada com sucesso!</h1>
        <p>Você já pode usar seu launcher normalmente.</p>
        <Button
          onClick={() => router.push("/dashboard/scripts")}
          className="bg-[#ff8533]"
        >
          Ir para downloads
        </Button>
      </div>
    );
  }

  // Render form
  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6 mt-16 mx-auto">
      <h1 className="text-2xl font-bold text-center">Configure seu Launcher</h1>

      <div>
        <Label htmlFor="domain">Domínio</Label>
        <Input
          id="domain"
          name="domain"
          placeholder="exemplo.com.br"
          value={formData.domain}
          onChange={handleChange}
          required
        />
        {checkingDomain && <p>Verificando domínio...</p>}
        {domainExists && <p className="text-red-500">Domínio já em uso.</p>}
      </div>

      <div>
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

      <div>
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

      <Button type="submit" disabled={loadingSave || domainExists} className="w-full bg-[#ff8533]">
        {loadingSave ? "Salvando..." : "Salvar Configuração"}
      </Button>
    </form>
  );
}