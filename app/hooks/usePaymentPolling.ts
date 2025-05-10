'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function usePaymentPolling(onApproved: () => void) {
  const router      = useRouter();
  const params      = useSearchParams();
  const paymentId   = params.get('payment_id')!;
  const userId      = params.get('userId')!;
  const productId   = params.get('productId')!;

  useEffect(() => {
    if (!paymentId || !userId || !productId) return;

    const iv = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment-status?payment_id=${paymentId}&userId=${userId}&productId=${productId}`);
        const { status } = await res.json();
        if (status === 'approved') {
          clearInterval(iv);
          onApproved();
        }
      } catch {
        // ignore
      }
    }, 10000);

    return () => clearInterval(iv);
  }, [paymentId, userId, productId, onApproved]);
}
