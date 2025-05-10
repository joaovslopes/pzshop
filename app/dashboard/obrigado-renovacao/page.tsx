"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";

/**
 * Tela de “obrigado” exibida após o usuário ser redirecionado
 * pelo checkout do Mercado Pago para concluir a renovação de licença.
 *
 * Query params esperados:
 *   ?userId=...&licenseId=...
 */
export default function ObrigadoRenovacaoPage() {
  const params  = useSearchParams();
  const userId  = params.get("userId");
  const licenseId = params.get("licenseId");
  const router  = useRouter();

  // Apenas exibe um aviso amigável se algo importante veio vazio
  React.useEffect(() => {
    if (!userId || !licenseId) {
      toast.warn("Informações de renovação incompletas. Caso o pagamento tenha sido aprovado, ele será confirmado em até alguns minutos.");
    }
  }, [userId, licenseId]);

  return (
    <div className="">
      <Card className="w-full max-w-md rounded-2xl">
        <CardContent className="p-8 flex flex-col items-center text-center gap-6">
          <CheckCircle2 className="w-16 h-16 text-green-600" strokeWidth={1.4} />
          <div>
            <h1 className="text-2xl font-semibold">Renovação iniciada!</h1>
            <p className="text-muted-foreground mt-2">
              Assim que o pagamento for <strong>aprovado</strong>, a licença ganhará +30&nbsp;dias automaticamente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button asChild className="flex-1 rounded-xl">
              <Link href="/dashboard/launcher">Voltar ao painel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
