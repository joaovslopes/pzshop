"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { ExternalLink, PlayCircle } from "lucide-react";
import { BuyLauncherModal } from "@/components/buy-launcher-modal";
import { useTranslation } from "@/hooks/use-translation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  video?: string;
  tag: string;
  isLauncher?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const decodeToken = (tokenStr: string) => {
    try {
      const [, payloadB64] = tokenStr.split(".");
      const payloadJson = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(payloadJson);
    } catch {
      return {};
    }
  };
  const userId = token ? (decodeToken(token) as any).userId : null;

  const [licenseScript, setLicenseScript] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const alreadyOwned = licenseScript.includes(product._id);

  const truncatedDescription =
    product.description.length > 120
      ? `${product.description.substring(0, 120)}...`
      : product.description;

  useEffect(() => {
    if (!token || !userId) return;
    (async () => {
      try {
        const resp = await axios.get("https://apisite.pzdev.com.br/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users: any[] = resp.data.data;
        const me = users.find((u) => u._id === userId);
        if (me?.licenseScript) {
          setLicenseScript(me.licenseScript);
        }
      } catch {
        // opcional: log
      }
    })();
  }, [token, userId]);

  const handleBuyClick = async () => {
    if (!token || !userId) {
      toast.error("Você precisa estar logado para comprar.");
      return;
    }

    if (product.isLauncher) {
      setIsModalOpen(true);
      return;
    }

    if (alreadyOwned) {
      toast.info("Você já adquiriu este produto.");
      return;
    }

    try {
      const response = await axios.post(
        "https://apisite.pzdev.com.br/api/payment/create",
        { userId, productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        window.location.href = response.data.init_point;
      } else {
        toast.error("Erro ao criar pagamento.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao criar pagamento.");
    }
  };

  return (
    <>
      <Card className="overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden group">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={340}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="aspect-video w-full bg-gradient-to-r from-[#070707] to-[#ff8533]/20" />
          )}

          {product.video && (
            <button
              onClick={() => setIsVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Assistir vídeo"
            >
              <PlayCircle className="text-white h-16 w-16" />
            </button>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <CardDescription className="text-base space-y-1">
            {truncatedDescription.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-between items-center">
          <div className="flex items-baseline">
            <div className="text-xl font-bold text-[#ff8533]">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(product.price))}
            </div>
            <div className="text-muted-foreground text-sm ml-1">/{product.tag}</div>
          </div>
          <Button
            onClick={handleBuyClick}
            disabled={alreadyOwned && !product.isLauncher}
            className="rounded-xl bg-[#ff8533] hover:bg-[#ff8533]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.isLauncher
              ? t("common.buyNow")
              : alreadyOwned
                ? "Já adquirido"
                : t("common.buyNow")}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {product.isLauncher && (
        <BuyLauncherModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={userId}            // <-- obrigatório agora
          productId={product._id}
        />
      )}

      {product.video && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="max-w-3xl w-full">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">Assistir vídeo</DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full">
              <iframe
                src={`${product.video}?autoplay=1`}
                className="w-full h-full rounded-md"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
