"use client"

import type React from "react"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { ProductData } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Filter, SearchIcon, SlidersHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchResults, setSearchResults] = useState(ProductData)
  const [sortBy, setSortBy] = useState("relevance")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [searchQuery, setSearchQuery] = useState(query)

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(ProductData.map((p) => p.category)))]

  // Filter products based on search query and filters
  useEffect(() => {
    let filtered = ProductData

    // Search query filter
    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.type.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((product) => product.type === typeFilter)
    }

    // Price range filter
    filtered = filtered.filter((product) => {
      const price = product.discount ? product.price - (product.price * product.discount) / 100 : product.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort results
    if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const priceA = a.discount ? a.price - (a.price * a.discount) / 100 : a.price
        const priceB = b.discount ? b.price - (b.price * b.discount) / 100 : b.price
        return priceA - priceB
      })
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const priceA = a.discount ? a.price - (a.price * a.discount) / 100 : a.price
        const priceB = b.discount ? b.price - (b.price * b.discount) / 100 : b.price
        return priceB - priceA
      })
    } else if (sortBy === "discount") {
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    }

    setSearchResults(filtered)
  }, [query, categoryFilter, typeFilter, priceRange, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchQuery)
    window.history.pushState({}, "", url.toString())

    // Filter products based on search query
    const filtered = ProductData.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(filtered)
  }

  const clearFilters = () => {
    setCategoryFilter("all")
    setTypeFilter("all")
    setPriceRange([0, 50])
    setSortBy("relevance")
  }

  const activeFiltersCount =
    (categoryFilter !== "all" ? 1 : 0) +
    (typeFilter !== "all" ? 1 : 0) +
    (sortBy !== "relevance" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50 ? 1 : 0)

  return (
    <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
      <Header />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-satisfy bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-gray-600">
                Showing results for <span className="font-medium">"{query}"</span>
              </p>
            )}
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && <Badge className="ml-2 bg-brand-primary">{activeFiltersCount}</Badge>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search results</SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Category</h3>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Type</h3>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Veg">Vegetarian</SelectItem>
                          <SelectItem value="Non Veg">Non-Vegetarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">Price Range</h3>
                        <span className="text-sm text-gray-500">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 50]}
                        max={50}
                        step={1}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-2"
                      />
                    </div>

                    <Button variant="outline" className="w-full mt-4" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 bg-white p-6 rounded-xl shadow-md h-fit sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm text-brand-primary hover:text-brand-primary/80"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Category</h3>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Type</h3>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Veg">Vegetarian</SelectItem>
                      <SelectItem value="Non Veg">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <span className="text-sm text-gray-500">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 50]}
                    max={50}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1">
              {/* Search and Sort */}
              <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="bg-brand-primary hover:bg-brand-primary/90">
                    Search
                  </Button>
                </form>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
                  </p>

                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="discount">Highest Discount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Results */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {searchResults.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-lg p-8 text-center border border-orange-100"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                      <SearchIcon className="h-10 w-10 text-brand-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-medium mb-2">No results found</h2>
                  <p className="text-gray-600 mb-6">We couldn't find any products matching your search criteria.</p>
                  <Button
                    className="bg-gradient-to-r from-brand-primary to-orange-500 hover:from-brand-primary/90 hover:to-orange-600 text-white"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <SearchContent />
    </div>
  )
}

