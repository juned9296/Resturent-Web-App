"use client"

import { FoodCard } from "./food-card"
import { useMenu } from "./providers/menu-provider"

export function FoodGrid() {
  const { filteredItems } = useMenu()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredItems.map((item, index) => (
        <FoodCard key={index} {...item} />
      ))}

      {filteredItems.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
          <span className="text-4xl mb-4">🍽️</span>
          <h3 className="text-xl font-medium mb-2">No items found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  )
}

