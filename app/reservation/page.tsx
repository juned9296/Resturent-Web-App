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
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Clock, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function ReservationPage() {
  const [reservations, setReservations] = useState([
    { id: 1, name: "John Doe", date: new Date(2025, 2, 15), time: "19:00", guests: 4, phone: "555-1234", table: "T3" },
    {
      id: 2,
      name: "Jane Smith",
      date: new Date(2025, 2, 16),
      time: "20:30",
      guests: 2,
      phone: "555-5678",
      table: "T7",
    },
    {
      id: 3,
      name: "Robert Johnson",
      date: new Date(2025, 2, 17),
      time: "18:00",
      guests: 6,
      phone: "555-9012",
      table: "T1",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    date: new Date(),
    time: "",
    guests: 2,
    phone: "",
    table: "",
  })

  const { toast } = useToast()

  const handleNewReservation = () => {
    setSelectedReservation(null)
    setFormData({
      name: "",
      date: new Date(),
      time: "",
      guests: 2,
      phone: "",
      table: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation)
    setFormData({
      name: reservation.name,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      phone: reservation.phone,
      table: reservation.table,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteReservation = (id: number) => {
    setReservations(reservations.filter((r) => r.id !== id))
    toast({
      title: "Reservation deleted",
      description: "The reservation has been removed from the system.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }))
    }
  }

  const handleSubmit = () => {
    // Validation
    if (!formData.name || !formData.time || !formData.phone || !formData.table) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (selectedReservation) {
      // Update existing reservation
      setReservations(reservations.map((r) => (r.id === selectedReservation.id ? { ...formData, id: r.id } : r)))
      toast({
        title: "Reservation updated",
        description: `Reservation for ${formData.name} has been updated.`,
      })
    } else {
      // Create new reservation
      const newId = Math.max(0, ...reservations.map((r) => r.id)) + 1
      setReservations([...reservations, { ...formData, id: newId }])
      toast({
        title: "Reservation created",
        description: `New reservation for ${formData.name} has been created.`,
      })
    }

    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-satisfy bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent mb-2">
                Reservations
              </h1>
              <p className="text-gray-500">Manage upcoming restaurant reservations</p>
            </motion.div>
            <Button
              onClick={handleNewReservation}
              className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> New Reservation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow border border-pink-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>{reservation.name}</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Table {reservation.table}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{format(reservation.date, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Guests:</span> {reservation.guests}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Phone:</span> {reservation.phone}
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditReservation(reservation)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteReservation(reservation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {reservations.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <span className="text-4xl mb-4">📅</span>
                <h3 className="text-xl font-medium mb-2">No reservations</h3>
                <p>Create a new reservation to get started</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>{selectedReservation ? "Edit Reservation" : "New Reservation"}</DialogTitle>
  </DialogHeader>

  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="name">Customer Name</Label>
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter customer name"
      />
    </div>

    <div className="space-y-2">
      <Label>Reservation Date</Label>
      <Calendar
        mode="single"
        selected={formData.date}
        onSelect={handleDateChange}
        className="border rounded-md p-2"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="time">Reservation Time</Label>
      <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="guests">Number of Guests</Label>
      <Input
        id="guests"
        name="guests"
        type="number"
        min="1"
        value={formData.guests}
        onChange={handleInputChange}
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

    <div className="space-y-2">
      <Label htmlFor="table">Table Number</Label>
      <Input
        id="table"
        name="table"
        value={formData.table}
        onChange={handleInputChange}
        placeholder="Enter table number"
      />
    </div>
  </div>

  <DialogFooter>
    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
      {selectedReservation ? "Update" : "Create"} Reservation
    </Button>
  </DialogFooter>
</DialogContent>

      </Dialog>
    </div>
  )
}

