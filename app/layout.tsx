import type React from "react"
import type { Metadata } from "next"
import { Poppins, Satisfy } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/providers/sidebar-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { MenuProvider } from "@/components/providers/menu-provider"
import { FavoritesProvider } from "@/components/providers/favorites-provider"
import { ProductData } from "@/data/products"
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

const satisfy = Satisfy({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-satisfy",
})

export const metadata: Metadata = {
  title: "Chili Eats - Restaurant & Food Delivery",
  description: "A modern restaurant point of sale system with e-commerce capabilities",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${satisfy.variable} font-poppins`}>
        <AuthProvider>
          <CartProvider>
            <MenuProvider initialItems={ProductData}>
              <FavoritesProvider products={ProductData}>
                <SidebarProvider>
                  {children}
                  <Toaster />
                </SidebarProvider>
              </FavoritesProvider>
            </MenuProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'