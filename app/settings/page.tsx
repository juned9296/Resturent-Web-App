"use client"

import type React from "react"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()

  const [generalSettings, setGeneralSettings] = useState({
    restaurantName: "Chili Restaurant",
    address: "123 Main Street, City, Country",
    phone: "+1 (555) 123-4567",
    email: "contact@chilirestaurant.com",
    taxRate: 5,
    currency: "USD",
  })

  const [userSettings, setUserSettings] = useState({
    name: "Admin User",
    email: "admin@chilirestaurant.com",
    password: "********",
    role: "Administrator",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowInventoryAlerts: true,
    marketingEmails: false,
    dailyReports: true,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    compactMode: false,
    highContrast: false,
    fontSize: "medium",
  })

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (name: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof notificationSettings],
    }))
  }

  const handleAppearanceChange = (name: string, value: any) => {
    setAppearanceSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been successfully saved.",
    })
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div className="mb-6">
            <h1 className="text-4xl font-satisfy bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-gray-500">Configure your restaurant POS system</p>
          </div>

          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-gray-100 p-1 rounded-full">
              <TabsTrigger
                value="general"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-primary"
              >
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="restaurantName">Restaurant Name</Label>
                      <Input
                        id="restaurantName"
                        name="restaurantName"
                        value={generalSettings.restaurantName}
                        onChange={handleGeneralSettingsChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={generalSettings.address}
                        onChange={handleGeneralSettingsChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={generalSettings.phone}
                        onChange={handleGeneralSettingsChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={generalSettings.email}
                        onChange={handleGeneralSettingsChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        name="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        value={generalSettings.taxRate}
                        onChange={handleGeneralSettingsChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        name="currency"
                        value={generalSettings.currency}
                        onChange={handleGeneralSettingsChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={userSettings.name} onChange={handleUserSettingsChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email Address</Label>
                      <Input
                        id="userEmail"
                        name="email"
                        type="email"
                        value={userSettings.email}
                        onChange={handleUserSettingsChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={userSettings.password}
                        onChange={handleUserSettingsChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        name="role"
                        value={userSettings.role}
                        onChange={handleUserSettingsChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Manager">Manager</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Waiter">Waiter</option>
                        <option value="Kitchen Staff">Kitchen Staff</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Staff Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">Manage staff accounts and permissions</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                      <span className="font-medium">Add New User</span>
                      <span className="text-xs text-gray-500">Create staff account</span>
                    </Button>

                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                      <span className="font-medium">Manage Roles</span>
                      <span className="text-xs text-gray-500">Set permissions</span>
                    </Button>

                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                      <span className="font-medium">View Activity</span>
                      <span className="text-xs text-gray-500">User logs</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order Alerts</h3>
                        <p className="text-sm text-gray-500">Get notified about new orders</p>
                      </div>
                      <Switch
                        checked={notificationSettings.orderAlerts}
                        onCheckedChange={() => handleNotificationToggle("orderAlerts")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Low Inventory Alerts</h3>
                        <p className="text-sm text-gray-500">Get notified when inventory is low</p>
                      </div>
                      <Switch
                        checked={notificationSettings.lowInventoryAlerts}
                        onCheckedChange={() => handleNotificationToggle("lowInventoryAlerts")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-gray-500">Receive promotional content</p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={() => handleNotificationToggle("marketingEmails")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Daily Reports</h3>
                        <p className="text-sm text-gray-500">Receive daily sales reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={() => handleNotificationToggle("dailyReports")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <select
                        id="theme"
                        value={appearanceSettings.theme}
                        onChange={(e) => handleAppearanceChange("theme", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Compact Mode</h3>
                        <p className="text-sm text-gray-500">Use a more compact UI layout</p>
                      </div>
                      <Switch
                        checked={appearanceSettings.compactMode}
                        onCheckedChange={(checked) => handleAppearanceChange("compactMode", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">High Contrast</h3>
                        <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                      </div>
                      <Switch
                        checked={appearanceSettings.highContrast}
                        onCheckedChange={(checked) => handleAppearanceChange("highContrast", checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <select
                        id="fontSize"
                        value={appearanceSettings.fontSize}
                        onChange={(e) => handleAppearanceChange("fontSize", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

