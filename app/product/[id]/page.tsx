"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { ProductData } from "@/data/products"

// Create a separate component that uses the cart hooks
function ProductDetailContent() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
      <Header />
      <ProductDetailMain />
    </div>
  )
}

// Move all cart-related logic to this component
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RelatedProducts } from "@/components/related-products"
import { useCart } from "@/components/providers/cart-provider"
import { useFavorites } from "@/components/providers/favorites-provider"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

function ProductDetailMain() {
  const params = useParams()
  const productId = params.id as string
  const product = ProductData.find((p) => p.id === productId)

  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const [isProductFavorite, setIsProductFavorite] = useState(false)
  const { toast } = useToast()

  // Check if product is in favorites
  useEffect(() => {
    if (productId) {
      setIsProductFavorite(isFavorite(productId))
    }
  }, [productId, isFavorite])

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    )
  }

  const { title, price, image, discount, type, category, description, ingredients, nutritionalInfo } = product
  const discountedPrice = discount ? price - (price * discount) / 100 : price

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      title,
      price: discountedPrice,
      image,
      type,
      quantity,
    })

    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity > 1 ? "items" : "item"} added to your cart.`,
      duration: 2000,
    })
  }

  const toggleFavorite = () => {
    if (isProductFavorite) {
      removeFromFavorites(productId)
      toast({
        title: "Removed from favorites",
        description: `${title} has been removed from your favorites.`,
        duration: 2000,
      })
    } else {
      addToFavorites(productId)
      toast({
        title: "Added to favorites",
        description: `${title} has been added to your favorites.`,
        duration: 2000,
      })
    }

    setIsProductFavorite(!isProductFavorite)
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <main className="flex-1 overflow-auto bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <div className="relative bg-white rounded-xl overflow-hidden shadow-xl">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={image || "/placeholder.svg?height=500&width=600"}
                alt={title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=500&width=600"
                }}
              />
              {discount && (
                <Badge
                  variant="brand"
                  className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold"
                >
                  {discount}% Off
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                {category}
              </Badge>
              <Badge
                variant={type === "Veg" ? "default" : "destructive"}
                className={
                  type === "Veg"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }
              >
                {type}
              </Badge>
            </div>

            <h1 className="text-4xl font-satisfy bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent mb-4">
              {title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(24 reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
                ${discountedPrice.toFixed(2)}
              </span>
              {discount && <span className="text-xl text-gray-500 line-through">${price.toFixed(2)}</span>}
            </div>

            <p className="text-gray-700 mb-6">{description}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10 rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`border-2 ${isProductFavorite ? "text-red-500 border-red-500" : "border-gray-200"}`}
                onClick={toggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isProductFavorite ? "fill-current" : ""}`} />
              </Button>

              <Button variant="outline" size="icon" className="border-2 border-gray-200">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Tabs defaultValue="details" className="mt-8">
              <TabsList className="mb-4 bg-gray-100 p-1 rounded-full">
                <TabsTrigger
                  value="details"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="ingredients"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
                >
                  Ingredients
                </TabsTrigger>
                <TabsTrigger
                  value="nutrition"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
                >
                  Nutrition
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="font-medium mb-3 text-lg">Product Details</h3>
                <p className="text-gray-700 mb-4">{description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">{category}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-600">{type}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">Preparation Time:</span>
                    <span className="ml-2 text-gray-600">20 mins</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">Serving Size:</span>
                    <span className="ml-2 text-gray-600">1 person</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="font-medium mb-3 text-lg">Ingredients</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ingredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <span className="w-2 h-2 bg-brand-primary rounded-full mr-2"></span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="nutrition" className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="font-medium mb-3 text-lg">Nutritional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">Calories:</span>
                    <span className="ml-2 text-gray-600">{nutritionalInfo?.calories} kcal</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">Protein:</span>
                    <span className="ml-2 text-gray-600">{nutritionalInfo?.protein}g</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">Carbohydrates:</span>
                    <span className="ml-2 text-gray-600">{nutritionalInfo?.carbs}g</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">Fat:</span>
                    <span className="ml-2 text-gray-600">{nutritionalInfo?.fat}g</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <RelatedProducts currentProductId={productId} category={category} />
      </div>
    </main>
  )
}

export default function ProductDetailPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <ProductDetailContent />
    </div>
  )
}

