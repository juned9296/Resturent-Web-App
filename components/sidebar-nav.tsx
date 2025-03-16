"use client"

import {
  Menu,
  TableIcon,
  CalendarRange,
  Truck,
  Calculator,
  Settings,
  LogOut,
  ShoppingCart,
  User,
  Package,
  LayoutDashboard,
  Store,
  Heart,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "./providers/sidebar-provider"
import { cn } from "@/lib/utils"
import { useAuth } from "./providers/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

const customerNavItems = [
  { icon: Home, label: "Home", href: "/", color: "text-brand-primary" },
  { icon: Store, label: "Shop", href: "/search", color: "text-gray-600" },
  { icon: ShoppingCart, label: "Cart", href: "/cart", color: "text-gray-600" },
  { icon: Heart, label: "Favorites", href: "/favorites", color: "text-gray-600" },
  { icon: Package, label: "My Orders", href: "/orders", color: "text-gray-600" },
  { icon: User, label: "Profile", href: "/profile", color: "text-gray-600" },
]

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", color: "text-brand-primary" },
  { icon: Store, label: "Products", href: "/admin/products", color: "text-gray-600" },
  { icon: Package, label: "Orders", href: "/admin/orders", color: "text-gray-600" },
  { icon: TableIcon, label: "Table Services", href: "/table-services", color: "text-gray-600" },
  { icon: CalendarRange, label: "Reservation", href: "/reservation", color: "text-gray-600" },
  { icon: Truck, label: "Delivery", href: "/delivery", color: "text-gray-600" },
  { icon: Calculator, label: "Accounting", href: "/accounting", color: "text-gray-600" },
  { icon: Settings, label: "Settings", href: "/settings", color: "text-gray-600" },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const { user, isAuthenticated, logout } = useAuth()

  // Determine which nav items to show based on user role
  const navItems = user?.role === "admin" ? adminNavItems : customerNavItems

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="w-64 p-4 border-r h-screen bg-white flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary via-orange-500 to-brand-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg">
              <span className="font-satisfy">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-satisfy text-2xl bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent leading-tight">
                Chili Eats
              </span>
              <span className="text-xs text-gray-500">Delicious & Fresh</span>
            </div>
          </motion.div>

          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50 border border-pink-100"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.avatar || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          <nav className="space-y-2 flex-1 overflow-y-auto">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-gradient-to-r from-brand-primary/10 to-purple-500/10 text-brand-primary font-medium"
                        : item.color
                    } hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-purple-500/5`}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                </motion.div>
              )
            })}
          </nav>

          <div className="mt-auto pt-4">
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button variant="ghost" className="w-full justify-start text-gray-600" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button variant="ghost" className="w-full justify-start text-gray-600" asChild>
                  <Link href="/login">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

