"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { MenuProvider } from "@/components/providers/menu-provider"
import { Toaster } from "@/components/ui/toaster"
import { ProductData } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Search } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample orders data
const ordersData = [
  {
    id: "1001",
    customer: "John Doe",
    email: "john@example.com",
    date: "Mar 15, 2025",
    total: 43.97,
    status: "Delivered",
    items: [
      { id: "1", name: "Vegetable Salad", quantity: 1, price: 17.99 },
      { id: "4", name: "Orange Juice", quantity: 2, price: 12.99 },
    ],
    address: "123 Main St, Apt 4B, New York, NY 10001",
    payment: "Credit Card (Visa ending in 4242)",
  },
  {
    id: "1002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "Mar 14, 2025",
    total: 28.5,
    status: "Processing",
    items: [
      { id: "2", name: "Meat Burger", quantity: 1, price: 23.99 },
      { id: "7", name: "Tomato Soup", quantity: 1, price: 8.99 },
    ],
    address: "456 Oak Ave, Brooklyn, NY 10002",
    payment: "PayPal",
  },
  {
    id: "1003",
    customer: "Robert Johnson",
    email: "robert@example.com",
    date: "Mar 14, 2025",
    total: 56.75,
    status: "Processing",
    items: [
      { id: "5", name: "Sushi Maki", quantity: 2, price: 9.99 },
      { id: "8", name: "Spaghetti Carbonara", quantity: 1, price: 15.99 },
      { id: "11", name: "Chocolate Cake", quantity: 1, price: 7.99 },
    ],
    address: "789 Pine Blvd, Queens, NY 10003",
    payment: "Cash on Delivery",
  },
  {
    id: "1004",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "Mar 13, 2025",
    total: 32.99,
    status: "Delivered",
    items: [
      { id: "3", name: "Tacos Salsa", quantity: 2, price: 14.99 },
      { id: "12", name: "Mixed Berry Smoothie", quantity: 1, price: 6.99 },
    ],
    address: "321 Elm St, Manhattan, NY 10004",
    payment: "Credit Card (Mastercard ending in 5555)",
  },
  {
    id: "1005",
    customer: "Michael Brown",
    email: "michael@example.com",
    date: "Mar 12, 2025",
    total: 19.99,
    status: "Cancelled",
    items: [
      { id: "6", name: "Cheese Burger", quantity: 1, price: 10.59 },
      { id: "7", name: "Tomato Soup", quantity: 1, price: 8.99 },
    ],
    address: "654 Maple Ave, Bronx, NY 10005",
    payment: "Credit Card (Visa ending in 1234)",
  },
]

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Filter orders based on search query and status
  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && order.status.toLowerCase() === statusFilter.toLowerCase()
  })

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Delivered</Badge>
      case "Processing":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleUpdateStatus = (status: string) => {
    if (!selectedOrder) return

    toast({
      title: "Order status updated",
      description: `Order #${selectedOrder.id} status changed to ${status}`,
    })

    setIsDialogOpen(false)
  }

  return (
    <MenuProvider initialItems={ProductData}>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-satisfy text-brand-primary mb-6">Order Management</h1>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search orders..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              <div>
                                <div>{order.customer}</div>
                                <div className="text-sm text-gray-500">{order.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                        {filteredOrders.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="text-gray-500">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-xl font-medium mb-2">No orders found</h3>
                                <p>Try adjusting your search or filter</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span> {selectedOrder.customer}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedOrder.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Date:</span> {selectedOrder.date}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span> {selectedOrder.status}
                    </p>
                    <p>
                      <span className="font-medium">Payment:</span> {selectedOrder.payment}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-sm">{selectedOrder.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right">${selectedOrder.total.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Tax
                        </TableCell>
                        <TableCell className="text-right">${(selectedOrder.total * 0.05).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${(selectedOrder.total * 1.05).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                    onClick={() => handleUpdateStatus("Processing")}
                  >
                    Processing
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                    onClick={() => handleUpdateStatus("Delivered")}
                  >
                    Delivered
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-100 text-red-800 hover:bg-red-200"
                    onClick={() => handleUpdateStatus("Cancelled")}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </MenuProvider>
  )
}

