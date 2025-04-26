"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { EditLicenseModal } from "@/components/dashboard/edit-license-modal";

interface License {
  _id: string;
  token: string;
  domain: string;
  expirationDate: string;
  downloader: "active" | "disabled";
  dashboard: "active" | "disabled";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://apisite.pzdev.com.br";

export default function LauncherPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchLicenses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        if (!res.ok) {
          throw new Error(`Unexpected status: ${res.status}`);
        }
        const jr = await res.json();
        if (!jr.success || !jr.data.licenses) {
          throw new Error("Failed to load licenses");
        }
        setLicenses(jr.data.licenses);
      } catch (err) {
        console.error("Error fetching licenses:", err);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, [router]);

  const handleEditLicense = (license: License) => {
    setSelectedLicense(license);
    setIsModalOpen(true);
  };

  const handleSaveLicense = async (updatedFields: Partial<License>) => {
    if (!selectedLicense) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/launcher/${selectedLicense.token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );
      const jr = await res.json();
      if (!jr.success) {
        throw new Error("Failed to save license");
      }
      const updated: License = jr.data;
      setLicenses((prev) =>
        prev.map((lic) =>
          lic._id === updated._id ? updated : lic
        )
      );
      setIsModalOpen(false);
      setSelectedLicense(null);
    } catch (err) {
      console.error("Error saving license:", err);
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
            <Button className="mt-4 rounded-xl">Adquirir licença</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {licenses.map((license) => {
            const isExpired =
              new Date() > new Date(license.expirationDate);

            return (
              <Card
                key={license._id}
                className="rounded-2xl overflow-hidden"
              >
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
                        {new Date(
                          license.expirationDate
                        ).toLocaleDateString()}
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
                        <Badge
                          variant={
                            license.downloader === "active"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          Downloader
                        </Badge>
                        <Badge
                          variant={
                            license.dashboard === "active"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          Dashboard
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
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
