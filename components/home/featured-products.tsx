"use client"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/hooks/use-translation"
import useSWR from "swr"
import axios from "axios"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  video?: string
  isLauncher?: boolean
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data.data)

export function FeaturedProducts() {
  const { t } = useTranslation()

  const {
    data: products,
    error,
    isLoading,
  } = useSWR<Product[]>("https://apisite.pzdev.com.br/api/products", fetcher)

  const processedProducts = (products || []).slice(0, 4).map((product) => ({
    ...product,
    image: product.image?.startsWith("http")
      ? product.image
      : `https://apisite.pzdev.com.br/${product.image}`,
  }))

  return (
    <section id="produtos" className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t("common.featuredProducts")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t("common.featuredDescription")}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5">
            <p className="text-destructive">{t("common.errorLoadingProducts")}</p>
          </div>
        ) : processedProducts.length === 0 ? (
          <div className="text-center p-8 rounded-2xl border">
            <p className="text-muted-foreground">{t("common.noProductsFound")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-[#ff8533] hover:bg-[#ff8533]/90 text-white"
          >
            <a href="/produtos">{t("common.viewAllProducts")}</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
