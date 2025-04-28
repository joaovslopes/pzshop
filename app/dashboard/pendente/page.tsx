"use client";

import { useRouter } from "next/navigation";

export default function PendingPage() {
  const router = useRouter();

  return (
 
      <div>
        <h1 className="text-3xl font-bold mb-4">Pagamento pendente!</h1>
        <p className="text-lg mb-6">
          Recebemos sua solicitação, mas o pagamento ainda não foi confirmado. 
          Assim que for aprovado, seu acesso será liberado automaticamente!
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
