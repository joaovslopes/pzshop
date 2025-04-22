"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"
import { EditLicenseModal } from "@/components/dashboard/edit-license-modal"

interface License {
  id: string
  token: string
  domain: string
  expirationDate: string
  status: "active" | "expired"
  downloader: "active" | "disabled"
  dashboard: "active" | "disabled"
}

export default function LauncherPage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulando carregamento de licenças da API
    const fetchLicenses = async () => {
      try {
        // Aqui você faria uma requisição para a API
        // const response = await fetch('/api/users/me', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // })
        // const data = await response.json()
        // setLicenses(data.licenses)

        // Simulando dados
        setTimeout(() => {
          setLicenses([
            {
              id: "1",
              token: "ABC123XYZ",
              domain: "meuservidor.com.br",
              expirationDate: "2025-12-31",
              status: "active",
              downloader: "active",
              dashboard: "active",
            },
            {
              id: "2",
              token: "DEF456UVW",
              domain: "outroservidor.com.br",
              expirationDate: "2025-05-15",
              status: "active",
              downloader: "active",
              dashboard: "disabled",
            },
            {
              id: "3",
              token: "GHI789RST",
              domain: "servidorexpirado.com.br",
              expirationDate: "2025-03-01",
              status: "expired",
              downloader: "disabled",
              dashboard: "disabled",
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erro ao carregar licenças:", error)
        setLoading(false)
      }
    }

    fetchLicenses()
  }, [])

  const handleEditLicense = (license: License) => {
    setSelectedLicense(license)
    setIsModalOpen(true)
  }

  const handleSaveLicense = async (updatedLicense: Partial<License>) => {
    try {
      // Aqui você faria uma requisição para a API
      // const response = await fetch(`/api/launcher/${updatedLicense.token}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(updatedLicense)
      // })

      // Simulando atualização
      setLicenses(
        licenses.map((license) => (license.id === selectedLicense?.id ? { ...license, ...updatedLicense } : license)),
      )

      setIsModalOpen(false)
      setSelectedLicense(null)
    } catch (error) {
      console.error("Erro ao atualizar licença:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PZ Launcher</h1>
        <p className="text-muted-foreground mt-2">Gerencie suas licenças do PZ Launcher</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : licenses.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Você não possui licenças do PZ Launcher</p>
            <Button className="mt-4 rounded-xl">Adquirir licença</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {licenses.map((license) => (
            <Card key={license.id} className="rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 p-6">
                  <div className="md:col-span-2">
                    <div className="font-medium">Token</div>
                    <div className="text-sm text-muted-foreground mt-1">{license.token}</div>
                  </div>
                  <div>
                    <div className="font-medium">Domain</div>
                    <div className="text-sm text-muted-foreground mt-1">{license.domain}</div>
                  </div>
                  <div>
                    <div className="font-medium">Expiration</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(license.expirationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Status</div>
                    <div className="mt-1">
                      <Badge variant={license.status === "active" ? "default" : "destructive"}>
                        {license.status === "active" ? "Ativo" : "Expirado"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Features</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={license.downloader === "active" ? "outline" : "secondary"}>Downloader</Badge>
                      <Badge variant={license.dashboard === "active" ? "outline" : "secondary"}>Dashboard</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => handleEditLicense(license)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedLicense && (
        <EditLicenseModal
          license={selectedLicense}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveLicense}
        />
      )}
    </div>
  )
}
