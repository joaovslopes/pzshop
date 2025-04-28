"use client";

import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Ocorreu um erro no pagamento!</h1>
        <p className="text-lg mb-6">
          Não conseguimos processar seu pagamento. Por favor, tente novamente ou entre em contato com o suporte.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-[#ff8533] text-white rounded-xl hover:bg-[#e6742b] transition-colors"
        >
          Voltar para Home
        </button>
      </div>
  
  );
}
