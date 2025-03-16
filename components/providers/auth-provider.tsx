"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "customer" | "admin"
  avatar?: string
  phone?: string
  address?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Sample users for demo
const DEMO_USERS = [
  {
    id: "1",
    name: "John Customer",
    email: "customer@example.com",
    password: "password123",
    role: "customer" as const,
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
    phone: "+1 (555) 987-6543",
    address: "456 Admin Ave, Adminville, USA",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_USERS[0]) // Auto-login with customer account
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Auto-login with customer account for demo purposes
      const { password, ...userWithoutPassword } = DEMO_USERS[0]
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    }
    setIsLoading(false)
  }, [])

  // Removed protected routes logic to allow access without validation

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true)

    // For demo purposes, always login successfully
    const foundUser = DEMO_USERS.find((u) => u.email === email) || DEMO_USERS[0]

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    // For demo purposes, don't actually log out
    // Just redirect to home
    router.push("/")
  }

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: true, // Always authenticated for demo
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

