"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import api from "@/service/api"

type User = {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  avatar?: string
  phone?: string
  address?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        interface ApiResponse {
          data: {
            user: User;
          };
        }

        const fetchUserProfile = async () => {
          try {
            setIsLoading(true);
            const response: ApiResponse = await api.get("/profile", {
              withCredentials: true,
            });
            setUser(response.data.user);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setIsAuthenticated(false);
            setUser(null);
          } finally {
            setIsLoading(false);
          }
        };

              fetchUserProfile();
            } catch (error) {
              console.error("Error fetching user profile:", error);
              setIsAuthenticated(false);
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          };
      
          fetchUserProfile();
        }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        // login,
        // logout,
        // updateUserProfile,
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

