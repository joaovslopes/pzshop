"use client"

import { Header } from "@/components/header"
import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, ListFilter} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import axios from "axios"
import { cn } from "@/lib/utils"


interface Product {
  id: string
  name: string
  description: string
  price: number
  tag: string
  image?: string
  video?: string
  isLauncher?: boolean
  categoryId?: string
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

export default function ProdutosPage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://apisite.pzdev.com.br/api/category")

        if (response.data.success) {
          const data = response.data.data.map((cat: any) => ({
            id: cat._id,
            name: cat.name,
            subcategories: (cat.subcategories || []).map((sub: string) => ({
              id: sub, // ← usa o nome da subcategoria como ID
              name: sub
            }))
          }))
          setCategories(data)

          const expanded: Record<string, boolean> = {}
          data.forEach((cat) => {
            expanded[cat.id] = true
          })
          setExpandedCategories(expanded)
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err)
      }
    }

    const fetchProducts = async () => {
      try {
        setLoading(true)

        const response = await axios.get("https://apisite.pzdev.com.br/api/products")

        if (response.data.success) {
          const data = response.data.data.map((product: any) => ({
            id: product._id,
            name: product.name,
            tag: product.tag,
            description: product.description,
            price: product.price || 0,
            image: product.image?.startsWith("http")
              ? product.image
              : `https://apisite.pzdev.com.br${product.image}`,
            video: product.videoUrl,
            isLauncher: product.isLauncher || false,
            categoryId: product.category || null, // ← Pega o ID direto
            subcategory: product.subcategory || null,
          }))

          setProducts(data)
        }
      } catch (err) {
        setError("Erro ao carregar produtos. Tente novamente mais tarde.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }


    fetchCategories()
    fetchProducts()
  }, [])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const toggleSubcategoryFilter = (subcategoryId: string) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subcategoryId)) {
        return prev.filter((id) => id !== subcategoryId)
      } else {
        return [...prev, subcategoryId]
      }
    })
  }

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.categoryId)

    const matchSubcategory =
      selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategory)

    return matchCategory && matchSubcategory
  })




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

    
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 rounded-sm">
            {/* Sidebar com filtros */}
            <div className="rounded-md border shadow-sm bg-white mb-6">
              <div className="border-b px-3 py-3 bg-primary text-white text-sm font-semibold flex justify-between items-center gap-2">
               Categorias 
               <ListFilter className="text-2xl"/>
              </div>

              <div className="flex flex-col">
                {categories.map((category) => {
                  const isActive = selectedCategories.includes(category.id)
                  const isExpanded = expandedCategories[category.id]

                  return (
                    <div key={category.id} className="border-b">
                      {/* Categoria principal */}
                      <div className="flex justify-between items-center w-full px-4 py-2 text-sm transition cursor-pointer">
                        <span
                          onClick={() => toggleCategoryFilter(category.id)}
                          className={cn(
                            "flex-1 text-left hover:text-primary",
                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                          )}
                        >
                          {category.name}
                        </span>

                        {category.subcategories && category.subcategories.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCategory(category.id)
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transform transition-transform",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </button>
                        )}
                      </div>


                      {/* Subcategorias (dropdown) */}
                      {category.subcategories && isExpanded && (
                        <div className=" py-2 space-y-1">
                          {category.subcategories.map((subcategory) => {
                            const isSubActive = selectedSubcategories.includes(subcategory.id)
                            return (
                              <button
                                key={subcategory.id}
                                onClick={() => toggleSubcategoryFilter(subcategory.id)}
                                className={cn(
                                  "w-full text-left text-sm px-5 py-1 transition hover:text-primary",
                                  isSubActive
                                    ? "bg-primary/20 text-primary font-medium"
                                    : "hover:bg-muted text-muted-foreground"
                                )}
                              >
                                {subcategory.name}
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



            {/* Lista de produtos */}
            <div className="md:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
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
              ) : error ? (
                <div className="text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center p-8 rounded-2xl border">
                  <p className="text-muted-foreground">Nenhum produto encontrado com os filtros selecionados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
