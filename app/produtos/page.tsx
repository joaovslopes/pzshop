"use client"

import { Header } from "@/components/header"
import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import axios from "axios"

interface Product {
  id: string
  name: string
  description: string
  price: number
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
        const response = await axios.get("http://localhost:5000/api/category")

        if (response.data.success) {
          const data = response.data.data.map((cat: any) => ({
            id: cat._id,
            name: cat.name,
            subcategories: (cat.subcategories || []).map((sub: string, i: number) => ({
              id: `${cat._id}-${i}`,
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

        const response = await axios.get("http://localhost:5000/api/products")

        if (response.data.success) {
          const data = response.data.data.map((product: any) => ({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price || 0,
            image: product.image?.startsWith("http")
              ? product.image
              : `http://localhost:5000${product.image}`,
            video: product.videoUrl,
            isLauncher: product.isLauncher || false,
            categoryId: product.category?._id || null
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
    // Se não há filtros selecionados, mostrar todos os produtos
    if (selectedCategories.length === 0 && selectedSubcategories.length === 0) {
      return true
    }

    // Filtrar por categoria
    if (selectedCategories.length > 0 && product.categoryId) {
      return selectedCategories.includes(product.categoryId)
    }

    // Filtrar por subcategoria (simplificado, em um caso real precisaria de mais lógica)
    if (selectedSubcategories.length > 0) {
      return true // Simplificado para o exemplo
    }

    return false
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

          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar com filtros */}
            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="border rounded-2xl p-4 sticky top-20">
                <h2 className="font-semibold text-lg mb-4">Categorias</h2>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategoryFilter(category.id)}
                          />
                          <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                            {category.name}
                          </Label>
                        </div>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleCategory(category.id)}
                          >
                            {expandedCategories[category.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {category.subcategories && expandedCategories[category.id] && (
                        <div className="ml-6 space-y-1">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`subcategory-${subcategory.id}`}
                                checked={selectedSubcategories.includes(subcategory.id)}
                                onCheckedChange={() => toggleSubcategoryFilter(subcategory.id)}
                              />
                              <Label htmlFor={`subcategory-${subcategory.id}`} className="cursor-pointer">
                                {subcategory.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
