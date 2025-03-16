"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { MenuProvider } from "@/components/providers/menu-provider"
import { Toaster } from "@/components/ui/toaster"
import { ProductData } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { toast } = useToast()

  // Get unique categories
  const categories = ["all", ...new Set(ProductData.map((product) => product.category))]

  // Filter products based on search query and category
  const filteredProducts = ProductData.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (categoryFilter === "all") return matchesSearch
    return matchesSearch && product.category === categoryFilter
  })

  const handleDeleteProduct = (id: string) => {
    toast({
      title: "Product deleted",
      description: "The product has been successfully deleted.",
    })
  }

  return (
    <MenuProvider initialItems={ProductData}>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-satisfy text-brand-primary">Product Management</h1>
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={product.image || "/placeholder.svg?height=48&width=48"}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{product.title}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                              <Badge variant={product.type === "Veg" ? "default" : "destructive"}>{product.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">${product.price.toFixed(2)}</span>
                                {product.discount && (
                                  <Badge variant="outline" className="text-brand-primary">
                                    {product.discount}% Off
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}

                        {filteredProducts.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <div className="text-gray-500">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-xl font-medium mb-2">No products found</h3>
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
      <Toaster />
    </MenuProvider>
  )
}

