"use client"

import type React from "react"

import { Search, ShoppingCart, Heart, MenuIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "./providers/sidebar-provider"
import { useAuth } from "./providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMenu } from "./providers/menu-provider"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useFavorites } from "./providers/favorites-provider"
import { useCart } from "./providers/cart-provider"
import { logoutUser } from "@/service/auth"

export function Header() {
  const { searchQuery, setSearchQuery } = useMenu()

  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const { user, isAuthenticated } = useAuth()
  const { favorites } = useFavorites()
  const { items } = useCart()
  const router = useRouter()

  const [localSearchQuery, setLocalSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (localSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localSearchQuery)}`)
    }
  }

  const logout = () => {
    logoutUser()
    window.location.reload()
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 flex items-center justify-end gap-4 border-b sticky top-0 z-30 shadow-sm"
    >
      <div className="md:hidden flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <MenuIcon className="h-5 w-5" />
        </Button>
        <span className="font-satisfy text-xl bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
          Chili
        </span>
      </div>
       
      <div className="flex-1 relative max-w-xl">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          className="pl-10 w-full pr-16 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
        >
          Search
        </Button>
      </form>
    </div>
      

      <div className="flex items-center gap-2">
          <Link href="/favorites">
          <Button variant="ghost" size="icon" className="relative group">
            <Heart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
            {favorites.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 text-white">
                {favorites.length}
              </Badge>
            )}
          </Button>
        </Link>

        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative group">
            <ShoppingCart className="h-5 w-5 group-hover:text-brand-primary transition-colors" />
            {items.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                {items.length}
              </Badge>
            )}
          </Button>
        </Link>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 ring-2 ring-brand-primary/20">
                  <AvatarImage src={user?.avatar || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="h-px bg-gray-200 my-1"></div>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile" className="flex items-center">
                  <span className="bg-gradient-to-r from-brand-primary to-brand-secondary w-2 h-2 rounded-full mr-2"></span>
                  My Profile
                </Link>
              </DropdownMenuItem>
             {
              user?.role === "USER" && (
                <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/orders" className="flex items-center">
                  <span className="bg-gradient-to-r from-brand-primary to-brand-secondary w-2 h-2 rounded-full mr-2"></span>
                  My Orders
                </Link>
              </DropdownMenuItem>
              )
             }
              {user?.role === "ADMIN" && (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin" className="flex items-center">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 w-2 h-2 rounded-full mr-2"></span>
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <div className="h-px bg-gray-200 my-1"></div>
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="default"
            size="sm"
            asChild
            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
          >
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </motion.div>
  )
}

