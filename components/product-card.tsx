import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  video?: string
  isLauncher?: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col justify-between">
      {product.image && (
       <Image
       src={product.image || "/placeholder.svg"}
       alt={product.name}
       width={600}
       height={340}
       className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
     />
      )}

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-primary text-base">
            R$ {product.price?.toFixed(2) ?? "0,00"}
          </span>

          <Button size="sm" className="rounded-xl">
            Comprar
          </Button>
        </div>
      </div>
    </div>
  )
}
