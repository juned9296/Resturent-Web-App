"use client"

import { Grid, Coffee, Soup, UtensilsCrossed, ChefHat, Sandwich } from "lucide-react"
import { useMenu } from "./providers/menu-provider"
import { motion } from "framer-motion"

// Map of category names to icons
const categoryIcons: Record<string, any> = {
  All: Grid,
  Breakfast: Coffee,
  Soups: Soup,
  Pasta: UtensilsCrossed,
  "Main Course": ChefHat,
  Burgers: Sandwich,
}

export function CategoryFilter() {
  const { categories, selectedCategory, setSelectedCategory } = useMenu()

  // Map categories to include the correct icons
  const categoriesWithIcons = categories.map((category) => ({
    ...category,
    icon: categoryIcons[category.label] || Grid,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide"
    >
      {categoriesWithIcons.map((category, index) => {
        const isActive = category.label === selectedCategory

        return (
          <motion.div
            key={index}
            whileHover={{ x: +3 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center p-3 rounded-xl min-w-[120px]  ${
              isActive
                ? "bg-gradient-to-br from-brand-primary/10 to-purple-500/10 text-brand-primary border-brand-primary "
                : "bg-white border-transparent"
            } border-2 cursor-pointer hover:shadow-md transition-all duration-300  `}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div
              className={`p-2 rounded-full ${isActive ? "bg-gradient-to-br from-brand-primary to-purple-500 text-white" : "bg-gray-100"}`}
            >
              <category.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium mt-2">{category.label}</span>
            <span className="text-xs text-gray-500">{category.items}</span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

