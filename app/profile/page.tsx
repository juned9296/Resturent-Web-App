"use client"

import type React from "react"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { MenuProvider } from "@/components/providers/menu-provider"
import { Toaster } from "@/components/ui/toaster"
import { ProductData } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Edit, LogOut, Save } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, updateUserProfile, logout } = useAuth()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user])

  // Improve the profile page editability
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserProfile(formData)
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  if (!user) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Loading profile...</h2>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <MenuProvider initialItems={ProductData}>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-satisfy text-brand-primary mb-6">My Profile</h1>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-primary p-8 text-white relative">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white">
                        <AvatarImage src={user?.avatar || ""} />
                        <AvatarFallback className="bg-brand-secondary text-white text-2xl">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white text-brand-primary hover:bg-gray-100"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <h2 className="text-2xl font-medium">{user?.name}</h2>
                      <p className="text-white/80">{user?.email}</p>
                      <p className="text-white/80 mt-1">Member since January 2025</p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="profile" className="p-6">
                  <TabsList className="mb-6">
                    <TabsTrigger value="profile">Profile Information</TabsTrigger>
                    <TabsTrigger value="orders">Order History</TabsTrigger>
                    <TabsTrigger value="addresses">Saved Addresses</TabsTrigger>
                    <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-medium">Personal Information</h3>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? (
                          <>
                            <Edit className="mr-2 h-4 w-4" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Replace the form section with this improved version */}
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={isEditing ? "border-brand-primary focus:border-brand-primary" : ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={isEditing ? "border-brand-primary focus:border-brand-primary" : ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={isEditing ? "border-brand-primary focus:border-brand-primary" : ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Default Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={isEditing ? "border-brand-primary focus:border-brand-primary" : ""}
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-6 flex justify-end">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </form>

                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-xl font-medium mb-4">Account Settings</h3>

                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href="/change-password">Change Password</a>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={logout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders">
                    <h3 className="text-xl font-medium mb-6">Order History</h3>

                    <div className="space-y-4">
                      {[1, 2, 3].map((order) => (
                        <div key={order} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row justify-between mb-4">
                            <div>
                              <div className="font-medium">Order #{1000 + order}</div>
                              <div className="text-sm text-gray-500">March {order + 10}, 2025</div>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Delivered
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="sm:w-16 sm:h-16 flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop"
                                alt="Order item"
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Order Items (3)</div>
                              <div className="text-sm text-gray-500">Vegetable Salad, Burger, Orange Juice</div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="font-medium">Total: $47.98</div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/orders/${1000 + order}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="addresses">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-medium">Saved Addresses</h3>
                      <Button variant="outline" size="sm">
                        Add New Address
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 relative">
                        <div className="absolute top-4 right-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="font-medium mb-1">Home</div>
                        <div className="text-sm text-gray-600 mb-2">
                          123 Main Street, Apt 4B
                          <br />
                          New York, NY 10001
                          <br />
                          United States
                        </div>
                        <div className="text-sm text-gray-600">Phone: +1 (555) 123-4567</div>

                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <span className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full">
                            Default Address
                          </span>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 relative">
                        <div className="absolute top-4 right-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="font-medium mb-1">Work</div>
                        <div className="text-sm text-gray-600 mb-2">
                          456 Office Plaza, Suite 200
                          <br />
                          New York, NY 10002
                          <br />
                          United States
                        </div>
                        <div className="text-sm text-gray-600">Phone: +1 (555) 987-6543</div>

                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <Button variant="outline" size="sm">
                            Set as Default
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="payment">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-medium">Payment Methods</h3>
                      <Button variant="outline" size="sm">
                        Add Payment Method
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 relative">
                        <div className="absolute top-4 right-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                            Visa
                          </div>
                          <div>
                            <div className="font-medium">Visa ending in 4242</div>
                            <div className="text-sm text-gray-500">Expires 12/2026</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <span className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full">
                            Default Payment Method
                          </span>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 relative">
                        <div className="absolute top-4 right-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold">
                            MC
                          </div>
                          <div>
                            <div className="font-medium">Mastercard ending in 5555</div>
                            <div className="text-sm text-gray-500">Expires 08/2025</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <Button variant="outline" size="sm">
                            Set as Default
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </MenuProvider>
  )
}

