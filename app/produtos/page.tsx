"use client"

import { Header } from "@/components/header"
import { useEffect, useState, useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ListFilter } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
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
  categoryId?: string | null
  subcategory?: string | string[] | null
}

interface Category {
  id: string
  name: string
  subcategories?: { id: string; name: string }[]
}

const fetcher = (url: string) => axios.get(url).then(res => res.data.data)

export default function ProdutosPage() {
  const { t } = useTranslation()
  const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://apisite.pzdev.com.br"

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { data: categoriesData, isLoading: loadingCategories } = useSWR(
    `${API}/api/category`,
    fetcher
  )
  const { data: productsData, isLoading: loadingProducts, error: errorProducts } = useSWR(
    `${API}/api/products`,
    fetcher
  )

  // Monta categorias
  useEffect(() => {
    if (!categoriesData) return
    const parsedCats = categoriesData.map((cat: any) => ({
      id: cat._id,
      name: cat.name,
      subcategories: (cat.subcategories || []).map((sub: string) => ({ id: sub, name: sub })),
    }))
    setCategories(parsedCats)

    // Expande todas por padrão
    const exp: Record<string, boolean> = {}
    parsedCats.forEach(c => { exp[c.id] = true })
    setExpandedCategories(exp)
  }, [categoriesData])

  // Monta produtos, garantindo _id
  useEffect(() => {
    if (!productsData) return
    const parsedProds: Product[] = productsData.map((prod: any) => ({
      _id: prod._id,
      name: prod.name,
      tag: prod.tag,
      description: prod.description,
      price: prod.price || 0,
      image: prod.image?.startsWith("http") ? prod.image : `${API}${prod.image}`,
      video: prod.videoUrl,
      isLauncher: prod.isLauncher || false,
      categoryId: prod.category ?? null,
      subcategory: prod.subcategory ?? null,
    }))
    setProducts(parsedProds)
  }, [productsData, API])

  // Filtragem
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const byCat =
        selectedCategories.length === 0 ||
        selectedCategories.includes(prod.categoryId ?? "")
      const subs = Array.isArray(prod.subcategory)
        ? prod.subcategory
        : prod.subcategory
        ? [prod.subcategory]
        : []
      const bySub =
        selectedSubcategories.length === 0 ||
        subs.some(sub => selectedSubcategories.includes(sub))
      return byCat && bySub
    })
  }, [products, selectedCategories, selectedSubcategories])

  // Handlers de toggle
  const toggleCategory = (id: string) => setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleCategoryFilter = (id: string) =>
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  const toggleSubcategoryFilter = (id: string) =>
    setSelectedSubcategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  return (
    <>
      <Header />
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Produtos</h1>
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
                {showFilters ? t("buyModal.closeFilters") : t("buyModal.openFilters")}
              </span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* FILTROS */}
            <div className={cn("md:col-span-1", showFilters ? "block" : "hidden", "md:block")}>
              <div className="sticky top-24 rounded-md border shadow-sm bg-white mb-6">
                <div className="border-b px-3 py-3 bg-primary text-white text-sm font-semibold flex justify-between items-center">
                  Categorias<ListFilter className="text-2xl" />
                </div>
                <div className="flex flex-col">
                  {categories.map(cat => {
                    const isActive = selectedCategories.includes(cat.id)
                    const isExpanded = expandedCategories[cat.id]
                    return (
                      <div key={cat.id} className="border-b">
                        <div className="flex justify-between items-center px-4 py-2 cursor-pointer">
                          <span
                            onClick={() => toggleCategoryFilter(cat.id)}
                            className={cn(
                              "flex-1 hover:text-primary",
                              isActive ? "text-primary font-semibold" : "text-muted-foreground"
                            )}
                          >
                            {cat.name}
                          </span>
                          {cat.subcategories?.length ? (
                            <button onClick={e => { e.stopPropagation(); toggleCategory(cat.id) }}>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transform transition-transform",
                                  isExpanded && "rotate-180"
                                )}
                              />
                            </button>
                          ) : null}
                        </div>
                        {cat.subcategories && isExpanded && (
                          <div className="py-2 space-y-1">
                            {cat.subcategories.map(sub => {
                              const isSubActive = selectedSubcategories.includes(sub.id)
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => toggleSubcategoryFilter(sub.id)}
                                  className={cn(
                                    "w-full text-left text-sm px-5 py-1 hover:text-primary",
                                    isSubActive
                                      ? "bg-primary/20 text-primary font-medium"
                                      : "hover:bg-muted text-muted-foreground"
                                  )}
                                >
                                  {sub.name}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* PRODUTOS */}
            <div className="md:col-span-3">
              {loadingCategories || loadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
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
              ) : errorProducts ? (
                <div className="text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5">
                  <p className="text-destructive">Erro ao carregar produtos. Tente novamente mais tarde.</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center p-8 rounded-2xl border">
                  <p className="text-muted-foreground">Nenhum produto encontrado com os filtros selecionados</p>
                </div>
              ) : (
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
    </>
  )
}
