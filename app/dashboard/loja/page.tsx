"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { BuyLauncherModal } from "@/components/buy-launcher-modal"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  video?: string
  isLauncher?: boolean
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulando carregamento de produtos da API
    const fetchProducts = async () => {
      try {
        // Aqui você faria uma requisição para a API
        // const response = await fetch('/api/products')
        // const data = await response.json()
        // setProducts(data)

        // Simulando dados
        setTimeout(() => {
          setProducts([
            {
              id: "1",
              name: "PZ Launcher Premium",
              description:
                "Um launcher completo para seu servidor MU Online com recursos avançados de personalização, atualizações automáticas e proteção contra hacks.",
              price: 299.9,
              image: "/placeholder.svg?height=200&width=400",
              isLauncher: true,
            },
            {
              id: "2",
              name: "PZ Scripts Pack",
              description:
                "Pacote completo de scripts otimizados para servidores MU Online, incluindo sistemas de eventos, rankings, loja virtual e muito mais.",
              price: 499.9,
              image: "/placeholder.svg?height=200&width=400",
            },
            {
              id: "3",
              name: "PZ Admin Dashboard",
              description:
                "Painel administrativo completo para gerenciar seu servidor MU Online com estatísticas em tempo real, gerenciamento de usuários e configurações avançadas.",
              price: 399.9,
              image: "/placeholder.svg?height=200&width=400",
            },
            {
              id: "4",
              name: "PZ Anti-Hack Solution",
              description:
                "Sistema avançado de proteção contra hacks e cheats para seu servidor MU Online, garantindo uma experiência justa para todos os jogadores.",
              price: 349.9,
              image: "/placeholder.svg?height=200&width=400",
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleBuyClick = (product: Product) => {
    if (product.isLauncher) {
      setSelectedProduct(product)
      setIsModalOpen(true)
    } else {
      // Simulação de compra direta para produtos que não são launchers
      console.log("Comprando produto:", product.id)
      // Aqui você faria o fetch para POST /api/buy/product
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loja</h1>
        <p className="text-muted-foreground mt-2">Adquira novos produtos para seu servidor</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum produto disponível no momento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="rounded-2xl overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                {product.image && (
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                </div>
                <Button className="rounded-xl" onClick={() => handleBuyClick(product)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Comprar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedProduct && (
        <BuyLauncherModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
        />
      )}
    </div>
  )
}
