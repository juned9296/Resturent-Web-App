"use client"

import { ProductCard } from "./product-card"
import { ProductData } from "@/data/products"
import Link from "next/link"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

// Remove the nested CartProvider from the FeaturedProducts component
export function FeaturedProducts() {
  // Get 4 featured products
  const featuredProducts = ProductData.filter((product) => product.featured).slice(0, 4)

  return (
    <section className="py-16 bg-gradient-to-br from-white to-orange-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-4xl font-satisfy bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
            Featured Dishes
          </h2>
          <Button
            variant="outline"
            className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 group"
            asChild
          >
            <Link href="/#menu" className="flex items-center">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} featured />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

