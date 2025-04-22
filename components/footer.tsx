import Link from "next/link"
import { FooterContent } from "@/components/footer-content"

export function Footer() {
  return (
    <footer className="w-full py-6 md:py-8 border-t bg-[#070707] text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <FooterContent />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/politica-de-privacidade" className="text-gray-300 hover:text-[#ff8533] transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="text-gray-300 hover:text-[#ff8533] transition-colors">
              Termos de Uso
            </Link>
            <Link href="/contato" className="text-gray-300 hover:text-[#ff8533] transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
