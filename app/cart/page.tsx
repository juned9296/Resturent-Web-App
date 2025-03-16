"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart, Trash2, CreditCard, ArrowRight } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { ProductData } from "@/data/products"
import { motion } from "framer-motion"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, tax, total, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Force a re-render when the component mounts to ensure cart data is loaded
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("Cart page mounted, items:", items)

    // Debug: Check localStorage directly
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart-items")
      console.log("Cart from localStorage:", savedCart ? JSON.parse(savedCart) : "No cart found")
    }
  }, [])

  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid or expired.",
        variant: "destructive",
      })
      setIsApplyingCoupon(false)
    }, 1000)
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout")
      return
    }

    router.push("/checkout")
  }

  // Add this at the beginning of the return statement
  if (!mounted) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your cart...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  console.log("Rendering cart page with items:", items)

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-orange-50 to-pink-50">
          <div className="container mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-satisfy bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent mb-2">
                Your Shopping Cart
              </h1>
              <p className="text-gray-600 mb-6">Review your items and proceed to checkout</p>
            </motion.div>

            {items && items.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="lg:w-2/3"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
                    <div className="p-6">
                      <h2 className="text-xl font-medium mb-4 flex items-center">
                        <ShoppingCart className="mr-2 h-5 w-5 text-brand-primary" />
                        Cart Items ({items.length})
                      </h2>

                      <div className="divide-y">
                        {items.map((item, index) => {
                          const product = ProductData.find((p) => p.id === item.id)
                          const discount = product?.discount || 0
                          const discountedPrice = discount ? item.price - (item.price * discount) / 100 : item.price

                          return (
                            <motion.div
                              key={item.id}
                              className="py-6 flex flex-col sm:flex-row gap-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <div className="sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                                <img
                                  src={
                                    item.image ||
                                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop" ||
                                    "/placeholder.svg"
                                  }
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop"
                                  }}
                                />
                              </div>

                              <div className="flex-1">
                                <Link
                                  href={`/product/${item.id}`}
                                  className="text-lg font-medium hover:text-brand-primary"
                                >
                                  {item.title}
                                </Link>

                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={`w-2 h-2 rounded-full ${item.type === "Veg" ? "bg-green-600" : "bg-red-600"}`}
                                  ></span>
                                  <span className="text-sm text-gray-500">{item.type}</span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 rounded-full border-2 border-gray-200"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 rounded-full border-2 border-gray-200"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <div className="font-medium text-brand-primary">
                                        ${(discountedPrice * item.quantity).toFixed(2)}
                                      </div>
                                      {discount > 0 && (
                                        <div className="text-sm text-gray-500 line-through">
                                          ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                      )}
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" className="border-2 border-gray-200 hover:border-brand-primary" asChild>
                      <Link href="/">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Continue Shopping
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="text-red-500 border-2 border-red-200 hover:bg-red-50 hover:border-red-500"
                      onClick={() => clearCart()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Cart
                    </Button>
                  </div>
                </motion.div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:w-1/3"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 border border-pink-100">
                    <h2 className="text-xl font-medium mb-4 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-brand-primary" />
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (5%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between font-medium text-lg">
                          <span>Total</span>
                          <span className="bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent font-bold">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Including all taxes and fees</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="border-2 border-gray-200 focus:border-brand-primary"
                        />
                        <Button
                          variant="outline"
                          className="border-2 border-gray-200 hover:border-brand-primary"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode || isApplyingCoupon}
                        >
                          {isApplyingCoupon ? "Applying..." : "Apply"}
                        </Button>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                      size="lg"
                      onClick={handleCheckout}
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Button>

                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>Secure checkout powered by Stripe</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto border border-pink-100"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center">
                    <ShoppingCart className="h-10 w-10 text-brand-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <Button
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                  size="lg"
                  asChild
                >
                  <Link href="/">Start Shopping</Link>
                </Button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

