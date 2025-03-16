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
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MenuProvider } from "@/components/providers/menu-provider"

// Sample food items for MenuProvider
const dummyItems = []

export default function TableServicesPage() {
  const [tables, setTables] = useState([
    { id: 1, number: "T1", status: "Occupied", customer: "John Doe", time: "1:30 PM" },
    { id: 2, number: "T2", status: "Available", customer: "", time: "" },
    { id: 3, number: "T3", status: "Reserved", customer: "Jane Smith", time: "2:00 PM" },
    { id: 4, number: "T4", status: "Occupied", customer: "Floyd Miles", time: "12:45 PM" },
    { id: 5, number: "T5", status: "Available", customer: "", time: "" },
    { id: 6, number: "T6", status: "Available", customer: "", time: "" },
    { id: 7, number: "T7", status: "Reserved", customer: "Robert Johnson", time: "3:15 PM" },
    { id: 8, number: "T8", status: "Occupied", customer: "Emily Davis", time: "1:00 PM" },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<any>(null)
  const [formData, setFormData] = useState({
    customer: "",
    status: "Available",
    time: "",
  })

  const { toast } = useToast()

  const handleTableClick = (table: any) => {
    setSelectedTable(table)
    setFormData({
      customer: table.customer,
      status: table.status,
      time: table.time,
    })
    setIsDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (formData.status !== "Available" && !formData.customer) {
      toast({
        title: "Customer name required",
        description: "Please enter a customer name for occupied or reserved tables.",
        variant: "destructive",
      })
      return
    }

    setTables(
      tables.map((table) =>
        table.id === selectedTable.id
          ? {
              ...table,
              status: formData.status,
              customer: formData.customer,
              time:
                formData.status === "Available"
                  ? ""
                  : formData.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : table,
      ),
    )

    toast({
      title: "Table updated",
      description: `Table ${selectedTable.number} has been updated.`,
    })

    setIsDialogOpen(false)
  }

  return (
    <MenuProvider initialItems={dummyItems}>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-auto p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Table Services</h1>
              <p className="text-gray-500">Manage restaurant tables and seating</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <Card
                  key={table.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    table.status === "Available"
                      ? "border-green-200"
                      : table.status === "Occupied"
                        ? "border-red-200"
                        : "border-yellow-200"
                  }`}
                  onClick={() => handleTableClick(table)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>Table {table.number}</span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          table.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : table.status === "Occupied"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {table.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {table.status !== "Available" && (
                      <>
                        <p className="text-sm font-medium">{table.customer}</p>
                        <p className="text-xs text-gray-500">Since {table.time}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Table {selectedTable?.number}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Table Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              {formData.status !== "Available" && (
                <>
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
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      placeholder="Enter time"
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </MenuProvider>
  )
}

