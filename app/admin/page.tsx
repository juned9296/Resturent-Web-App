"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { MenuProvider } from "@/components/providers/menu-provider"
import { Toaster } from "@/components/ui/toaster"
import { ProductData } from "@/data/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, Package, ShoppingBag, Users } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import { useEffect, useState } from "react"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to ensure charts only render on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sample data for charts
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12500, 19200, 15700, 18900, 22400, 24800],
        borderColor: "hsl(16, 85%, 53%)",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const categoryData = {
    labels: ["Breakfast", "Main Course", "Burgers", "Pasta", "Soups", "Desserts"],
    datasets: [
      {
        label: "Orders",
        data: [65, 92, 78, 43, 29, 38],
        backgroundColor: [
          "hsl(16, 85%, 53%)",
          "hsl(200, 98%, 39%)",
          "hsl(43, 96%, 56%)",
          "hsl(280, 85%, 60%)",
          "hsl(120, 70%, 45%)",
          "hsl(340, 85%, 60%)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const orderStatusData = {
    labels: ["Completed", "Processing", "Cancelled"],
    datasets: [
      {
        data: [75, 20, 5],
        backgroundColor: ["hsl(120, 70%, 45%)", "hsl(200, 98%, 39%)", "hsl(0, 84%, 60%)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <MenuProvider initialItems={ProductData}>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-satisfy text-brand-primary mb-6">Admin Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold mt-1">$24,780</h3>
                        <div className="flex items-center mt-1 text-green-600">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">12% from last month</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-brand-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <h3 className="text-2xl font-bold mt-1">345</h3>
                        <div className="flex items-center mt-1 text-green-600">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">8% from last month</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-brand-secondary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Products</p>
                        <h3 className="text-2xl font-bold mt-1">{ProductData.length}</h3>
                        <div className="flex items-center mt-1 text-green-600">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">4% from last month</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-brand-accent/10 rounded-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-brand-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Customers</p>
                        <h3 className="text-2xl font-bold mt-1">1,245</h3>
                        <div className="flex items-center mt-1 text-red-600">
                          <ArrowDown className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">3% from last month</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isClient && <Line data={salesData} height={300} options={{ maintainAspectRatio: false }} />}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Orders by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isClient && <Bar data={categoryData} height={300} options={{ maintainAspectRatio: false }} />}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    {isClient && (
                      <div style={{ height: "250px", width: "250px" }}>
                        <Doughnut
                          data={orderStatusData}
                          options={{
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "bottom",
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Order ID</th>
                            <th className="text-left py-3 px-2">Customer</th>
                            <th className="text-left py-3 px-2">Date</th>
                            <th className="text-left py-3 px-2">Amount</th>
                            <th className="text-left py-3 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              id: "#1001",
                              customer: "John Doe",
                              date: "Mar 15, 2025",
                              amount: "$43.97",
                              status: "Delivered",
                            },
                            {
                              id: "#1002",
                              customer: "Jane Smith",
                              date: "Mar 14, 2025",
                              amount: "$28.50",
                              status: "Processing",
                            },
                            {
                              id: "#1003",
                              customer: "Robert Johnson",
                              date: "Mar 14, 2025",
                              amount: "$56.75",
                              status: "Processing",
                            },
                            {
                              id: "#1004",
                              customer: "Emily Davis",
                              date: "Mar 13, 2025",
                              amount: "$32.99",
                              status: "Delivered",
                            },
                            {
                              id: "#1005",
                              customer: "Michael Brown",
                              date: "Mar 12, 2025",
                              amount: "$19.99",
                              status: "Delivered",
                            },
                          ].map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-2">{order.id}</td>
                              <td className="py-3 px-2">{order.customer}</td>
                              <td className="py-3 px-2">{order.date}</td>
                              <td className="py-3 px-2">{order.amount}</td>
                              <td className="py-3 px-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </MenuProvider>
  )
}

