"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

interface ScriptLicense {
  id: string
  productName: string
  downloadLink: string
  status: "active" | "expired"
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<ScriptLicense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulando carregamento de scripts da API
    const fetchScripts = async () => {
      try {
        // Aqui você faria uma requisição para a API
        // const response = await fetch('/api/users/me', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // })
        // const data = await response.json()
        // setScripts(data.licenseScript)

        // Simulando dados
        setTimeout(() => {
          setScripts([
            {
              id: "1",
              productName: "PZ Scripts Pack",
              downloadLink: "#",
              status: "active",
            },
            {
              id: "2",
              productName: "PZ Admin Dashboard",
              downloadLink: "#",
              status: "active",
            },
            {
              id: "3",
              productName: "PZ Anti-Hack Solution",
              downloadLink: "#",
              status: "expired",
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erro ao carregar scripts:", error)
        setLoading(false)
      }
    }

    fetchScripts()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PZ Scripts</h1>
        <p className="text-muted-foreground mt-2">Gerencie seus scripts e licenças</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : scripts.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Você não possui scripts</p>
            <Button className="mt-4 rounded-xl">Adquirir scripts</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scripts.map((script) => (
            <Card key={script.id} className="rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                  <div className="md:col-span-2">
                    <div className="font-medium">{script.productName}</div>
                  </div>
                  <div>
                    <div className="font-medium">Status</div>
                    <div className="mt-1">
                      <Badge variant={script.status === "active" ? "default" : "destructive"}>
                        {script.status === "active" ? "Ativo" : "Expirado"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button variant="outline" size="sm" className="rounded-xl" disabled={script.status === "expired"}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
