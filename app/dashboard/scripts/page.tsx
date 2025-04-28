"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import Image from "next/image"
import axios from "axios"

interface ScriptLicense {
  id: string
  productName: string
  description: string
  downloadLink: string
  image?: string
  subcategory?: string
  status: "active" | "expired"
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<ScriptLicense[]>([])
  const [launcher, setLauncher] = useState<ScriptLicense | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScriptsAndLauncher = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error("Token não encontrado")
        }

        // Buscar usuário e seus scripts
        const userResponse = await axios.get('https://apisite.pzdev.com.br/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const user = userResponse.data.data

        // Montar os scripts do usuário
        const userScripts: ScriptLicense[] = user.licenseScript?.map((product: any) => ({
          id: product._id,
          productName: product.name,
          description: product.description,
          downloadLink: product.downloadUrl,
          image: product.image,
          subcategory: product.subcategory, // PEGANDO A SUBCATEGORIA AQUI
          status: "active",
        })) || []


        setScripts(userScripts)

        // Buscar todos os produtos para encontrar o launcher
        const productsResponse = await axios.get('https://apisite.pzdev.com.br/api/products')
        const products = productsResponse.data.data

        // Encontrar o produto que é o launcher
        const launcherProduct = products.find((p: any) => p.isLauncher)

        if (launcherProduct) {
          setLauncher({
            id: launcherProduct._id,
            productName: launcherProduct.name,
            description: launcherProduct.description,
            downloadLink: launcherProduct.downloadUrl,
            image: launcherProduct.image,
            status: "active",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar scripts ou launcher:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScriptsAndLauncher()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PZ Downloads</h1>
        <p className="text-muted-foreground mt-2">Lista de Downloads</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Launcher download primeiro */}
          {launcher && (
            <Card key={launcher.id} className="rounded-2xl overflow-hidden border-2 border-primary">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                  {launcher.image && (
                    <div className="w-full h-32 relative">
                      <Image
                        src={launcher.image.startsWith('http') ? launcher.image : `https://apisite.pzdev.com.br/${launcher.image}`}
                        alt={launcher.productName}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <div className="font-medium">{launcher.productName}</div>
                    <p className="text-sm text-muted-foreground mt-1">{launcher.description}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Badge variant="default">Launcher</Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl mt-4"
                      asChild
                    >
                      <a href={launcher.downloadLink} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scripts normais depois */}
          {scripts.length > 0 ? scripts.map((script) => (
            <Card key={script.id} className="rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                  {script.image && (
                    <div className="w-full h-32 relative">
                      <Image
                        src={script.image.startsWith('http') ? script.image : `https://apisite.pzdev.com.br/${script.image}`}
                        alt={script.productName}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <div className="font-medium">{script.productName}</div>
                    <p className="text-sm text-muted-foreground mt-1">{script.description}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Badge variant="default">
                      {script.subcategory && script.subcategory.length === 1
                        ? script.subcategory[0]
                        : "Script"}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl mt-4"
                      asChild
                    >
                      <a href={script.downloadLink} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Você não possui downloads de scripts</p>
                <Button className="mt-4 rounded-xl" asChild>
                  <a href="/produtos">Adquirir produtos</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
