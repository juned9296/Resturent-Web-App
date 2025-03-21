"use client"

import type React from "react"

import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useAuth } from "@/components/providers/auth-provider"
import { useState , useEffect} from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { login } from "@/service/auth"
import { useAuth } from "@/components/providers/auth-provider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn , setIsLogin] = useState(false)
  const { setIsAuthenticated} = useAuth()

  // const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/"
  const { toast } = useToast()


  
useEffect(() => {
  if (isLoggedIn) {
    setIsAuthenticated(true);
    router.push(redirectUrl);
  }
}, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        setIsLogin(true)
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col md:ml-64">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-satisfy text-brand-primary mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-brand-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-brand-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-4">Or sign in with</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button">
                    Google
                  </Button>
                  <Button variant="outline" type="button">
                    Facebook
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

