import { NextResponse } from "next/server"

// Dados de exemplo para simular a API
const products = [
  {
    id: "1",
    name: "PZ Launcher Premium",
    description:
      "Um launcher completo para seu servidor MU Online com recursos avançados de personalização, atualizações automáticas e proteção contra hacks.",
    price: 299.9,
    image: "/placeholder.svg?height=340&width=600",
    isLauncher: true,
  },
  {
    id: "2",
    name: "PZ Scripts Pack",
    description:
      "Pacote completo de scripts otimizados para servidores MU Online, incluindo sistemas de eventos, rankings, loja virtual e muito mais.",
    price: 499.9,
    image: "/placeholder.svg?height=340&width=600",
  },
  {
    id: "3",
    name: "PZ Admin Dashboard",
    description:
      "Painel administrativo completo para gerenciar seu servidor MU Online com estatísticas em tempo real, gerenciamento de usuários e configurações avançadas.",
    price: 399.9,
    image: "/placeholder.svg?height=340&width=600",
  },
  {
    id: "4",
    name: "PZ Anti-Hack Solution",
    description:
      "Sistema avançado de proteção contra hacks e cheats para seu servidor MU Online, garantindo uma experiência justa para todos os jogadores.",
    price: 349.9,
    image: "/placeholder.svg?height=340&width=600",
  },
]

export async function GET() {
  // Simulando um pequeno delay para mostrar o estado de loading
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return NextResponse.json(products)
}
