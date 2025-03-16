"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { useFavorites } from "@/components/providers/favorites-provider"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { motion } from "framer-motion"

// Create a separate component that uses the favorites hooks
function FavoritesContent() {
  const { favoriteItems } = useFavorites()

  return (
    <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
      <Header />
      <main className="flex-1 overflow-auto bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-satisfy text-brand-primary mb-2 bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
              Your Favorites
            </h1>
            <p className="text-gray-600">All your favorite dishes in one place</p>
          </motion.div>

          {favoriteItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteItems.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto border border-pink-100"
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-brand-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-medium mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-6">Start adding your favorite dishes to create your personal collection</p>
              <Button
                className="bg-gradient-to-r from-brand-primary to-purple-600 hover:from-brand-primary/90 hover:to-purple-700 text-white"
                size="lg"
                asChild
              >
                <Link href="/">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Menu
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function FavoritesPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <FavoritesContent />
    </div>
  )
}

