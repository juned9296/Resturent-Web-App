"use client"

import type React from "react"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Clock, MapPin, Phone, Plus, Truck, User } from "lucide-react"
import { MenuProvider } from "@/components/providers/menu-provider"

export default function DeliveryPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      customer: "John Doe",
      address: "123 Main St, Apt 4B",
      phone: "555-1234",
      items: 3,
      total: 42.99,
      status: "Preparing",
      estimatedTime: "30-40 min",
      driver: "Mike Wilson",
    },
    {
      id: 2,
      customer: "Jane Smith",
      address: "456 Oak Ave",
      phone: "555-5678",
      items: 2,
      total: 28.5,
      status: "On the way",
      estimatedTime: "15-20 min",
      driver: "Sarah Johnson",
    },
    {
      id: 3,
      customer: "Robert Johnson",
      address: "789 Pine Blvd",
      phone: "555-9012",
      items: 4,
      total: 56.75,
      status: "Delivered",
      estimatedTime: "0 min",
      driver: "David Brown",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)
  const [formData, setFormData] = useState({
    customer: "",
    address: "",
    phone: "",
    items: 1,
    total: 0,
    status: "Preparing",
    estimatedTime: "30-40 min",
    driver: "",
  })

  const { toast } = useToast()

  const handleNewDelivery = () => {
    setSelectedDelivery(null)
    setFormData({
      customer: "",
      address: "",
      phone: "",
      items: 1,
      total: 0,
      status: "Preparing",
      estimatedTime: "30-40 min",
      driver: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditDelivery = (delivery: any) => {
    setSelectedDelivery(delivery)
    setFormData({
      customer: delivery.customer,
      address: delivery.address,
      phone: delivery.phone,
      items: delivery.items,
      total: delivery.total,
      status: delivery.status,
      estimatedTime: delivery.estimatedTime,
      driver: delivery.driver,
    })
    setIsDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // Validation
    if (!formData.customer || !formData.address || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (selectedDelivery) {
      // Update existing delivery
      setDeliveries(deliveries.map((d) => (d.id === selectedDelivery.id ? { ...formData, id: d.id } : d)))
      toast({
        title: "Delivery updated",
        description: `Delivery for ${formData.customer} has been updated.`,
      })
    } else {
      // Create new delivery
      const newId = Math.max(0, ...deliveries.map((d) => d.id)) + 1
      setDeliveries([...deliveries, { ...formData, id: newId }])
      toast({
        title: "Delivery created",
        description: `New delivery for ${formData.customer} has been created.`,
      })
    }

    setIsDialogOpen(false)
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    if (activeTab === "active") {
      return delivery.status !== "Delivered"
    } else {
      return delivery.status === "Delivered"
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparing":
        return "bg-yellow-100 text-yellow-800"
      case "On the way":
        return "bg-blue-100 text-blue-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const dummyItems = []

  return (
    <MenuProvider initialItems={dummyItems}>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Delivery Management</h1>
                <p className="text-gray-500">Track and manage food deliveries</p>
              </div>
              <Button onClick={handleNewDelivery} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> New Delivery
              </Button>
            </div>

            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Deliveries</TabsTrigger>
                <TabsTrigger value="completed">Completed Deliveries</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDeliveries.map((delivery) => (
                    <Card
                      key={delivery.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleEditDelivery(delivery)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center">
                          <span>{delivery.customer}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="line-clamp-1">{delivery.address}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-4 w-4 text-gray-500" />
                            <span>{delivery.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                            <span>ETA: {delivery.estimatedTime}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Truck className="mr-2 h-4 w-4 text-gray-500" />
                            <span>{delivery.driver}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t mt-2">
                            <span className="text-sm text-gray-500">{delivery.items} items</span>
                            <span className="font-bold">${delivery.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredDeliveries.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                      <span className="text-4xl mb-4">🚚</span>
                      <h3 className="text-xl font-medium mb-2">No active deliveries</h3>
                      <p>All deliveries have been completed</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDeliveries.map((delivery) => (
                    <Card
                      key={delivery.id}
                      className="hover:shadow-md transition-shadow cursor-pointer opacity-80"
                      onClick={() => handleEditDelivery(delivery)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center">
                          <span>{delivery.customer}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="line-clamp-1">{delivery.address}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="mr-2 h-4 w-4 text-gray-500" />
                            <span>{delivery.driver}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t mt-2">
                            <span className="text-sm text-gray-500">{delivery.items} items</span>
                            <span className="font-bold">${delivery.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredDeliveries.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                      <span className="text-4xl mb-4">📦</span>
                      <h3 className="text-xl font-medium mb-2">No completed deliveries</h3>
                      <p>Deliveries will appear here when completed</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedDelivery ? "Edit Delivery" : "New Delivery"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  id="customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter delivery address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="items">Number of Items</Label>
                  <Input
                    id="items"
                    name="items"
                    type="number"
                    min="1"
                    value={formData.items}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total">Total Amount</Label>
                  <Input
                    id="total"
                    name="total"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.total}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Delivery Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Preparing">Preparing</option>
                  <option value="On the way">On the way</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Time</Label>
                <Input
                  id="estimatedTime"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 30-40 min"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Driver Name</Label>
                <Input
                  id="driver"
                  name="driver"
                  value={formData.driver}
                  onChange={handleInputChange}
                  placeholder="Enter driver name"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                {selectedDelivery ? "Update" : "Create"} Delivery
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </MenuProvider>
  )
}

