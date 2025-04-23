"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

import Image from "next/image"
import { ExternalLink, PlayCircle } from "lucide-react"
import { BuyLauncherModal } from "@/components/buy-launcher-modal"
import { useTranslation } from "@/hooks/use-translation"

interface Product {
  _id: string
  name: string
  description: string
  price: string
  image?: string
  video?: string
  tag: string
  isLauncher?: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const truncatedDescription =
    product.description.length > 120 ? `${product.description.substring(0, 120)}...` : product.description

  const handleBuyClick = () => {
    if (product.isLauncher) {
      setIsModalOpen(true)
    } else {
      console.log("Comprando produto:", product._id)
    }
  }

  return (
    <>
      <Card className="overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        {/* Bloco de imagem com ícone de vídeo */}
        <div className="relative aspect-video w-full overflow-hidden group">
          {product.image ? (
            <Image
              src={product.image || "/placeholder.svg"}
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
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Assistir vídeo"
            >
              <PlayCircle className="text-white h-16 w-16" />
            </button>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <CardDescription className="text-base">{truncatedDescription}</CardDescription>
        </CardHeader>

        <CardContent className="flex gap-1">
          <div className="text-2xl font-bold text-[#ff8533]">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(product.price))}
          </div>
          <div className="text-muted-foreground text-sm mt-1">/{product.tag}</div>
        </CardContent>

        <CardFooter className="flex justify-end pb-6">
          <Button className="rounded-xl bg-[#ff8533] hover:bg-[#ff8533]/90 text-white" onClick={handleBuyClick}>
            {t("common.buyNow")}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {product.isLauncher && (
        <BuyLauncherModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productId={product._id}
          productName={product.name}
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
  )
}
