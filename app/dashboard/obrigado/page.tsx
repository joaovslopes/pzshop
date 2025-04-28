"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ObrigadoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const finalizePurchase = async () => {
      if (!userId || !productId) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Usuário não autenticado");
        }

        await axios.post(
          "http://localhost:3000/api/buy/product",
          { userId, productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLoading(false);
      } catch (err) {
        console.error("Erro ao finalizar compra:", err);
        setError(true);
        setLoading(false);
      }
    };

    finalizePurchase();
  }, [userId, productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Finalizando sua compra, aguarde...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Ocorreu um erro!</h1>
          <p className="text-lg">Não conseguimos finalizar sua compra. Por favor, entre em contato com o suporte.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-3 bg-[#ff8533] text-white rounded-xl hover:bg-[#e6742b]"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-3xl font-bold mb-4">Compra concluída com sucesso!</h1>
        <p className="text-lg">Obrigado pela sua compra. Seu acesso foi liberado!</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-6 py-3 bg-[#ff8533] text-white rounded-xl hover:bg-[#e6742b]"
        >
          Ir para Home
        </button>
      </div>
    </div>
  );
}
