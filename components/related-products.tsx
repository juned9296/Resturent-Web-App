"use client"

import { ProductCard } from "./product-card"
import { ProductData } from "@/data/products"

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

// Remove the nested CartProvider from the RelatedProducts component
export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  // Get related products from the same category, excluding the current product
  const relatedProducts = ProductData.filter(
    (product) => product.category === category && product.id !== currentProductId,
  ).slice(0, 4)

  if (relatedProducts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-satisfy text-brand-primary mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

