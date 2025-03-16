"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search, Package, Truck, Calendar, MapPin, Phone, Clock, ArrowRight } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

// Sample order data with real images
const orders = [
  {
    id: "1001",
    date: "March 15, 2025",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800",
    items: [
      {
        id: "1",
        name: "Fresh Vegetable Salad",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
      },
      {
        id: "4",
        name: "Fresh Orange Juice",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1887&auto=format&fit=crop",
      },
    ],
    total: 43.97,
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    deliveryPerson: "John Delivery",
    deliveryPhone: "+1 (555) 123-4567",
    estimatedDelivery: "Delivered on March 15, 2025 at 2:30 PM",
  },
  {
    id: "1002",
    date: "March 12, 2025",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800",
    items: [
      {
        id: "2",
        name: "Gourmet Beef Burger",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
      },
      {
        id: "6",
        name: "Gourmet Veggie Burger",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop",
      },
    ],
    total: 34.58,
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    deliveryPerson: "Sarah Delivery",
    deliveryPhone: "+1 (555) 987-6543",
    estimatedDelivery: "Delivered on March 12, 2025 at 1:15 PM",
  },
  {
    id: "1003",
    date: "March 18, 2025",
    status: "Processing",
    statusColor: "bg-blue-100 text-blue-800",
    items: [
      {
        id: "8",
        name: "Classic Spaghetti Carbonara",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1771&auto=format&fit=crop",
      },
      {
        id: "11",
        name: "Chocolate Lava Cake",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop",
      },
    ],
    total: 23.98,
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    deliveryPerson: "Pending Assignment",
    deliveryPhone: "",
    estimatedDelivery: "Expected delivery on March 18, 2025 between 1:00 PM - 2:00 PM",
  },
]

export default function OrdersPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter orders based on search query and active tab
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "processing") return matchesSearch && order.status === "Processing"
    if (activeTab === "delivered") return matchesSearch && order.status === "Delivered"
    return matchesSearch
  })

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-satisfy bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent mb-2">
                My Orders
              </h1>
              <p className="text-gray-600 mb-6">Track and manage your food orders</p>
            </motion.div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList className="bg-gray-100 p-1 rounded-full">
                      <TabsTrigger
                        value="all"
                        className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
                      >
                        All Orders
                      </TabsTrigger>
                      <TabsTrigger
                        value="processing"
                        className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
                      >
                        Processing
                      </TabsTrigger>
                      <TabsTrigger
                        value="delivered"
                        className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
                      >
                        Delivered
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
                      className="pl-9 border-2 border-gray-200 focus:border-brand-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {filteredOrders.length > 0 ? (
                  <div className="space-y-6">
                    {filteredOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <div className="font-medium flex items-center">
                              <Package className="mr-2 h-4 w-4 text-brand-primary" />
                              Order #{order.id}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {order.date}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={order.statusColor}>{order.status}</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-2 border-gray-200 hover:border-brand-primary"
                              asChild
                            >
                              <Link href={`/orders/${order.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="mb-4">
                            <div className="font-medium mb-2">Items</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                            <div>
                              <div className="font-medium mb-1 flex items-center">
                                <Truck className="mr-2 h-4 w-4 text-brand-primary" />
                                Delivery Information
                              </div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {order.estimatedDelivery}
                              </div>
                              {order.status === "Processing" ? (
                                <div className="text-sm text-gray-600 mt-2 flex items-center">
                                  <MapPin className="mr-1 h-3 w-3" />
                                  Your order is being prepared. You'll be notified when it's on the way.
                                </div>
                              ) : (
                                <div className="text-sm text-gray-600 mt-2 flex items-center">
                                  <Phone className="mr-1 h-3 w-3" />
                                  Delivered by: {order.deliveryPerson} • {order.deliveryPhone}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium mb-1">Order Total</div>
                              <div className="text-xl font-bold bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
                                ${order.total.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                      <Package className="h-10 w-10 text-brand-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchQuery ? "Try adjusting your search" : "You haven't placed any orders yet"}
                    </p>
                    <Button
                      className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                      asChild
                    >
                      <Link href="/">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Browse Menu
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

