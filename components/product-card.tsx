"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useCart } from "./providers/cart-provider"
import { useState, useEffect } from "react"
import { Badge } from "./ui/badge"
import Link from "next/link"
import type { FoodItem } from "./providers/menu-provider"
import { useFavorites } from "./providers/favorites-provider"
import { motion } from "framer-motion"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "./providers/auth-provider"

interface ProductCardProps {
  product: FoodItem
  featured?: boolean
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { id, image, title, price, discount, type, category } = product
  const { items, addToCart } = useCart()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const [isProductFavorite, setIsProductFavorite] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const router = useRouter()


  // Check if product is in favorites
  useEffect(() => {
    setIsProductFavorite(isFavorite(id))
  }, [id, isFavorite])

  const discountedPrice = discount ? price - (price * discount) / 100 : price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()



    if (!isAuthenticated) {
      router.push("/login")
      return
    }


    // Create a complete cart item
    const cartItem = {
      id,
      title,
      price: discountedPrice,
      image,
      type,
    }

    addToCart(cartItem)

    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart.`,
      duration: 2000,
    })

    // Log for debugging
    console.log("Added to cart:", cartItem)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()


    if (!isAuthenticated) {
      router.push("/login")
      return
    }


    if (isProductFavorite) {
      removeFromFavorites(id)
      toast({
        title: "Removed from favorites",
        description: `${title} has been removed from your favorites.`,
        duration: 2000,
      })
    } else {
      addToFavorites(id)
      toast({
        title: "Added to favorites",
        description: `${title} has been added to your favorites.`,
        duration: 2000,
      })
    }

    setIsProductFavorite(!isProductFavorite)
  }

  return (
    <Link href={`/product/${id}`}>
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group border-transparent hover:border-brand-primary/20">
          <div className="relative">
            <img
              src={image || "/placeholder.svg?height=200&width=300"}
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=300"
              }}
            />
            {discount && (
              <Badge
                variant="brand"
                className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold"
              >
                {discount}% Off
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white shadow-md ${isProductFavorite ? "text-red-500" : "text-gray-500"}`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isProductFavorite ? "fill-current" : ""}`} />
            </Button>
            {featured && (
              <Badge
                variant="brand"
                className="absolute bottom-2 left-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
              >
                Featured
              </Badge>
            )}
          </div>
          <div className="p-4 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium line-clamp-2 flex-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {title}
              </h3>
              <div className={`flex items-center gap-1 ${type === "Veg" ? "text-green-600" : "text-red-600"}`}>
                <span className={`w-2 h-2 rounded-full ${type === "Veg" ? "bg-green-600" : "bg-red-600"}`}></span>
                <span className="text-xs">{type}</span>
              </div>
            </div>

            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs ml-1 text-gray-500">(24)</span>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {discount && <span className="text-sm text-gray-500 line-through">${price.toFixed(2)}</span>}
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{category}</span>
              </div>

              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}

