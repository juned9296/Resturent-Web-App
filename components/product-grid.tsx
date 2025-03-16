"use client"

import { ProductCard } from "./product-card"
import { useMenu } from "./providers/menu-provider"
import { motion } from "framer-motion"

export function ProductGrid() {
  const { filteredItems } = useMenu()

  return (
    <div id="menu" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {filteredItems.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}

      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500"
        >
          <span className="text-6xl mb-4">🍽️</span>
          <h3 className="text-2xl font-medium mb-2">No items found</h3>
          <p>Try adjusting your search or category filter</p>
        </motion.div>
      )}
    </div>
  )
}

