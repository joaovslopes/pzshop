"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, CalendarSync } from "lucide-react";
import { EditLicenseModal } from "@/components/dashboard/edit-license-modal";
import { toast } from "react-toastify";

interface License {
  _id: string;
  token: string;
  domain: string;
  expirationDate: string;
  downloader: "active" | "disabled";
  dashboard: "active" | "disabled";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://apisite.pzdev.com.br";

// simples decode JWT para extrair userId
function decodeToken(tokenStr: string) {
  try {
    const [, payload] = tokenStr.split(".");
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

export default function LauncherPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const router = useRouter();

  // fetch user's licenses
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          return router.push("/login");
        }
        const jr = await res.json();
        if (!jr.success || !jr.data.licenses) throw new Error();
        setLicenses(jr.data.licenses);
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleEditLicense = (license: License) => {
    setSelectedLicense(license);
    setIsModalOpen(true);
  };

  const handleSaveLicense = async (updatedFields: Partial<License>) => {
    if (!selectedLicense) return;
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      const res = await fetch(`${API_URL}/api/launcher/${selectedLicense.token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      const jr = await res.json();
      if (!jr.success) throw new Error();
      setLicenses((prev) =>
        prev.map((lic) => (lic._id === jr.data._id ? jr.data : lic))
      );
      setIsModalOpen(false);
      setSelectedLicense(null);
      toast.success("Licença atualizada!");
    } catch {
      toast.error("Falha ao salvar.");
    }
  };

  // Agora cria nova preferência e redireciona para renovação
  const handleRenew = async (licenseId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    const { userId } = decodeToken(token) as any;
    if (!userId) {
      toast.error("Usuário inválido.");
      return;
    }
  
    setRenewingId(licenseId);
  
    try {
      const res = await fetch(`${API_URL}/api/payment/create-renew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, licenseId, amount: 13.9 }),
      });
  
      if (!res.ok) {
        // servidor devolveu HTML ou erro 500
        const text = await res.text();
        console.error("Erro 500 do backend:", text);
        toast.error("Não foi possível gerar a cobrança. Tente mais tarde.");
        return;
      }
  
      const jr = await res.json();
      if (!jr.success || !jr.init_point) {
        console.error("Resposta inesperada:", jr);
        toast.error("Não foi possível gerar a cobrança.");
        return;
      }
  
      // Redireciona para o checkout
      window.location.href = jr.init_point;
    } catch (err) {
      console.error("Erro ao criar cobrança de renovação:", err);
      toast.error("Falha ao gerar cobrança.");
    } finally {
      setRenewingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">PZ Launcher</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas licenças do PZ Launcher
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-ping rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      ) : licenses.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Você não possui licenças do PZ Launcher
            </p>
            <Button onClick={() => router.push("/dashboard/plans")} className="mt-4 rounded-xl">
              Adquirir licença
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {licenses.map((license) => {
            const isExpired = new Date() > new Date(license.expirationDate);

            return (
              <Card key={license._id} className="rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 p-6">
                    <div className="md:col-span-2">
                      <div className="font-medium">Token</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {license.token}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Domain</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {license.domain}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Expiration</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(license.expirationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Status</div>
                      <div className="mt-1">
                        <Badge variant={isExpired ? "destructive" : "default"}>
                          {isExpired ? "Expirado" : "Ativo"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Features</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={license.downloader === "active" ? "outline" : "secondary"}>
                          Downloader
                        </Badge>
                        <Badge variant={license.dashboard === "active" ? "outline" : "secondary"}>
                          Dashboard
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        className="rounded-xl"
                        onClick={() => handleRenew(license._id)}
                        disabled={renewingId === license._id}
                      >
                        <CalendarSync className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => handleEditLicense(license)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedLicense && (
        <EditLicenseModal
          license={selectedLicense}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLicense(null);
          }}
          onSave={handleSaveLicense}
        />
      )}
    </div>
  );
}
