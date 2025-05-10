"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

interface VerifyResponse {
  success: boolean;
  message?: string;
}

export default function ObrigadoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId    = searchParams.get("userId");
  const productId = searchParams.get("productId");
  const paymentId = searchParams.get("payment_id");
  const status    = searchParams.get("status");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const finalizePurchase = async () => {
      // valida query mínima
      if (!userId || !productId || !paymentId || status !== "approved") {
        setErrorMsg("Parâmetros inválidos ou pagamento não aprovado.");
        setLoading(false);
        return;
      }

      try {
        // chame seu endpoint de verificação que executa dashboardController.thankYou
        const res = await axios.get<VerifyResponse>(
          `https://apisite.pzdev.com.br/api/dashboard/obrigado`,
          {
            params: { userId, productId, payment_id: paymentId, status },
          }
        );

        if (!res.data.success) {
          throw new Error(res.data.message || "Verificação falhou");
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Erro ao verificar pagamento:", err);
        setErrorMsg(err.response?.data || err.message || "Erro interno.");
        setLoading(false);
      }
    };

    finalizePurchase();
  }, [userId, productId, paymentId, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Finalizando sua compra, aguarde...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="">
        <h1 className="text-3xl font-bold mb-4">Ocorreu um erro!</h1>
        <p className="text-lg mb-6">{errorMsg}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#ff8533] text-white rounded-xl hover:bg-[#e6742b]"
        >
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">Compra concluída com sucesso!</h1>
      <p className="text-lg mb-6">Obrigado pela sua compra. Seu acesso foi liberado!</p>
      <button
        onClick={() => router.push("/dashboard/scripts")}
        className="px-6 py-3 bg-[#ff8533] text-white rounded-xl hover:bg-[#e6742b]"
      >
        Ir para área de downloads
      </button>
    </div>
  );
}
