"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col ">
        <HeroSection />
        <FeaturedProducts />
      </div>
    </>
  )
}
