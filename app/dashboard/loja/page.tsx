"use client"

import React, { useEffect, useState, useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ListFilter } from "lucide-react"
import axios from "axios"
import useSWR from "swr"
import { cn } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  tag: string
  image?: string
  video?: string
  isLauncher?: boolean
  categoryId?: string
  subcategory?: string | string[]
}

interface Category {
  id: string
  name: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data.data)

export default function StorePage() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { data: categoriesData, isLoading: loadingCategories } = useSWR(
    "https://apisite.pzdev.com.br/api/category",
    fetcher
  )
  const { data: productsData, isLoading: loadingProducts, error: errorProducts } = useSWR(
    "https://apisite.pzdev.com.br/api/products",
    fetcher
  )

  // parse categories
  const categories: Category[] = useMemo(() => {
    if (!categoriesData) return []
    return categoriesData.map((cat: any) => ({
      id: cat._id,
      name: cat.name,
      subcategories: (cat.subcategories || []).map((sub: string) => ({
        id: sub,
        name: sub,
      })),
    }))
  }, [categoriesData])

  // init expanded
  useEffect(() => {
    const exp: Record<string, boolean> = {}
    categories.forEach(cat => (exp[cat.id] = true))
    setExpandedCategories(exp)
  }, [categories])

  // parse products, include _id for ProductCard
  const products: Product[] = useMemo(() => {
    if (!productsData) return []
    return productsData.map((p: any) => ({
      _id: p._id,
      name: p.name,
      tag: p.tag,
      description: p.description,
      price: p.price ?? 0,
      image: p.image?.startsWith("http")
        ? p.image
        : `https://apisite.pzdev.com.br${p.image}`,
      video: p.videoUrl,
      isLauncher: p.isLauncher ?? false,
      categoryId: p.category ?? null,
      subcategory: p.subcategory ?? null,
    }))
  }, [productsData])

  // filtering
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      if (selectedCategories.length && !selectedCategories.includes(prod.categoryId || "")) return false
      if (selectedSubcategories.length) {
        const prodSubs = Array.isArray(prod.subcategory)
          ? prod.subcategory
          : prod.subcategory
          ? [prod.subcategory]
          : []
        if (!prodSubs.some(sub => selectedSubcategories.includes(sub))) return false
      }
      return true
    })
  }, [products, selectedCategories, selectedSubcategories])

  const toggleCategory = (id: string) =>
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleCategoryFilter = (id: string) =>
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  const toggleSubcategoryFilter = (id: string) =>
    setSelectedSubcategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  return (
    <div className="px-4 py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Loja</h1>
          <p className="text-muted-foreground mt-2">
            Encontre os melhores scripts e launchers para seu servidor MU Online
          </p>
        </div>

        <div className="md:hidden">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => setShowFilters(v => !v)}
          >
            <span className="flex items-center">
              <ListFilter className="mr-2 h-4 w-4" />
              {showFilters ? "Fechar Filtros" : "Abrir Filtros"}
            </span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <div className={cn(showFilters ? "block md:block" : "hidden md:block", "md:col-span-1")}>          
            <div className="sticky top-24 h-fit rounded-md border shadow-sm bg-white mb-6">
              <div className="border-b px-3 py-3 bg-primary text-white text-sm font-semibold flex justify-between items-center gap-2">
                Categorias<ListFilter className="text-2xl" />
              </div>
              <div className="flex flex-col">
                {categories.map(cat => (
                  <div key={cat.id} className="border-b">
                    <div className="flex justify-between items-center px-4 py-2 cursor-pointer">
                      <span
                        onClick={() => toggleCategoryFilter(cat.id)}
                        className={cn(
                          "flex-1 hover:text-primary",
                          selectedCategories.includes(cat.id)
                            ? "text-primary font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        {cat.name}
                      </span>
                      {cat.subcategories?.length ? (
                        <button
                          onClick={e => { e.stopPropagation(); toggleCategory(cat.id) }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transform transition-transform",
                              expandedCategories[cat.id] && "rotate-180"
                            )}
                          />
                        </button>
                      ) : null}
                    </div>
                    {cat.subcategories && expandedCategories[cat.id] && (
                      <div className="py-2 space-y-1">
                        {cat.subcategories.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => toggleSubcategoryFilter(sub.id)}
                            className={cn(
                              "w-full text-left text-sm px-5 py-1 hover:text-primary",
                              selectedSubcategories.includes(sub.id)
                                ? "bg-primary/20 text-primary font-medium"
                                : "hover:bg-muted text-muted-foreground"
                            )}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            {(loadingProducts || loadingCategories) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
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
            )}

            {errorProducts && (
              <div className="text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5">
                <p className="text-destructive">
                  Erro ao carregar produtos. Tente novamente mais tarde.
                </p>
              </div>
            )}

            {!loadingProducts && !errorProducts && filteredProducts.length === 0 && (
              <div className="text-center p-8 rounded-2xl border">
                <p className="text-muted-foreground">
                  Nenhum produto encontrado com os filtros selecionados
                </p>
              </div>
            )}

            {!loadingProducts && !errorProducts && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
