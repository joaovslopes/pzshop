'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function ObrigadoLauncherPage() {
  const params    = useSearchParams();
  const router    = useRouter();
  const paymentId = params.get('payment_id')!;
  const userId    = params.get('userId')!;
  const productId = params.get('productId')!;

  const [status, setStatus] = useState(params.get('status') || 'pending');
  const [checking, setChecking] = useState(status === 'pending');

  // Poll a cada 5s enquanto estiver pendente
  useEffect(() => {
    if (status !== 'pending') return;
    const iv = setInterval(async () => {
      try {
        const { data } = await axios.get('https://apisite.pzdev.com.br/api/payment/payment-status', {
          params: { payment_id: paymentId, userId, productId }
        });
        if (data.status === 'approved') {
          setStatus('approved');
          setChecking(false);
        }
      } catch (_err) {
        // ignora erros momentâneos
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [status, paymentId, userId, productId]);

  // Redireciona para dashboard quando aprovado
  useEffect(() => {
    if (status === 'approved') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      {status === 'pending' && (
        <>
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4"/>
          <h2 className="text-xl font-semibold">Pagamento pendente...</h2>
          <p className="text-sm text-gray-500">
            Verificando automaticamente. Você será redirecionado assim que aprovado.
          </p>
        </>
      )}

      {status === 'approved' && (
        <h2 className="text-2xl font-bold text-green-600">
          🎉 Pagamento aprovado! Redirecionando...
        </h2>
      )}

      {!checking && status !== 'approved' && (
        <>
          <h2 className="text-xl font-semibold text-red-600">
            Ocorreu um erro ao verificar o pagamento.
          </h2>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => router.refresh()}>
            Tentar novamente
          </button>
        </>
      )}
    </div>
  );
}
