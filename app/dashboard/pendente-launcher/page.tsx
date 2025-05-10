'use client';

import { useRouter } from 'next/navigation';
import { usePaymentPolling } from '@/app/hooks/usePaymentPolling';

export default function LauncherPendingPage() {
  const router = useRouter();

  usePaymentPolling(() => {
    const params = new URLSearchParams(location.search);
    router.push(`/dashboard/obrigado-launcher?${params.toString()}`);
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Pagamento de Launcher pendente!</h1>
      <p className="text-lg mb-6 text-center">
        Recebemos sua solicitação, mas o pagamento do Launcher ainda não foi confirmado.<br/>
        Assim que for aprovado, você poderá configurar seu launcher automaticamente!
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
