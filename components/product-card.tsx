"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { ExternalLink, PlayCircle } from "lucide-react";

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

const decodeToken = (tokenStr: string) => {
  try {
    const [, payloadB64] = tokenStr.split(".");
    const payloadJson = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payloadJson);
  } catch {
    return {};
  }
};

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [openVideo, setOpenVideo] = useState(false); // NOVO: controla abertura do modal

  const handleBuyClick = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Você precisa estar logado para comprar.");
      return;
    }

    const decoded = decodeToken(token) as any;
    const userId = decoded.userId;
    if (!userId) {
      toast.error("Usuário inválido. Faça login novamente.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = product.isLauncher
        ? "https://apisite.pzdev.com.br/api/payment/create-launcher"
        : "https://apisite.pzdev.com.br/api/payment/create";

      const response = await axios.post(
        endpoint,
        {
          userId,
          productId: product._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        window.location.href = response.data.init_point;
      } else {
        toast.error("Erro ao criar pagamento.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao criar pagamento.");
    } finally {
      setLoading(false);
    }
  }, [product]);

  const truncatedDescription =
    product.description.length > 120
      ? `${product.description.substring(0, 120)}...`
      : product.description;

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

          {/* Botão de play para abrir vídeo */}
          {product.video && (
            <button
              onClick={() => setOpenVideo(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
            >
              <PlayCircle className="text-white w-16 h-16 animate-bounce" />
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
            disabled={loading}
            className="rounded-xl bg-[#ff8533] hover:bg-[#ff8533]/90 text-white"
          >
            {loading ? "Redirecionando..." : "Comprar"}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Modal de Vídeo */}
      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Vídeo do Produto</DialogTitle> {/* Título invisível para o usuário, mas visível para screen readers */}
          </DialogHeader>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={product.video}
              title="Vídeo do Produto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
