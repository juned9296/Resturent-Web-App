"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export type FoodItem = {
  id: string
  image: string
  title: string
  price: number
  discount?: number
  type: "Veg" | "Non Veg"
  category: string
}

type MenuContextType = {
  items: FoodItem[]
  filteredItems: FoodItem[]
  categories: { icon: any; label: string; items: string; active: boolean }[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

// Export the context so it can be checked for existence
export const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({
  children,
  initialItems,
}: {
  children: React.ReactNode
  initialItems: FoodItem[]
}) {
  const [items] = useState<FoodItem[]>(initialItems)
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState<{ icon: any; label: string; items: string; active: boolean }[]>([])

  // Update categories based on items
  useEffect(() => {
    // Get unique categories and count items
    const categoryMap = new Map<string, number>()
    items.forEach((item) => {
      const count = categoryMap.get(item.category) || 0
      categoryMap.set(item.category, count + 1)
    })

    // Create categories array with counts
    const newCategories = Array.from(categoryMap.entries()).map(([label, count]) => ({
      icon: null, // We'll set icons separately
      label,
      items: `${count} Items`,
      active: label === selectedCategory,
    }))

    // Add "All" category
    newCategories.unshift({
      icon: null,
      label: "All",
      items: `${items.length} Items`,
      active: selectedCategory === "All",
    })

    setCategories(newCategories)
  }, [items, selectedCategory])

  // Filter items based on search query and selected category
  useEffect(() => {
    let filtered = items

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) => item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query),
      )
    }

    setFilteredItems(filtered)
  }, [items, searchQuery, selectedCategory])

  return (
    <MenuContext.Provider
      value={{
        items,
        filteredItems,
        categories,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}

