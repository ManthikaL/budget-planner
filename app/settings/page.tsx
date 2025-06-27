"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThreeBackground } from "@/components/three-background"
import { useFinanceData } from "@/hooks/use-finance-data"
import { Download, Upload, Trash2, SettingsIcon, Globe, Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { DebugStorage } from "@/components/debug-storage"

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
]

export default function SettingsPage() {
  const {
    income,
    expenses,
    budgetGoals,
    categories,
    settings,
    setSettings,
    totalIncome,
    totalExpenses,
    exportData,
    importData,
    clearAllData,
  } = useFinanceData()

  const [isExporting, setIsExporting] = useState(false)
  const [tempCurrency, setTempCurrency] = useState(settings.currency)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleCurrencyChange = (value: string) => {
    setTempCurrency(value)
    setHasUnsavedChanges(value !== settings.currency)
  }

  const saveCurrencySettings = () => {
    setSettings({ ...settings, currency: tempCurrency })
    setHasUnsavedChanges(false)
    toast.success("Currency settings saved!")
  }

  const handleExport = async (format: "json" | "csv") => {
    setIsExporting(true)
    exportData(format)
    setTimeout(() => setIsExporting(false), 1000)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        importData(file)
      }
    }
    input.click()
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearAllData()
    }
  }

  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      <div className="relative z-10 container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">Manage your preferences and data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appearance Settings */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of your budget planner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Currency Settings */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Currency
              </CardTitle>
              <CardDescription>Set your preferred currency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={tempCurrency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.symbol}>
                        {currency.symbol} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasUnsavedChanges && (
                <Button
                  onClick={saveCurrencySettings}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Currency Settings
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Data Overview */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle>Data Overview</CardTitle>
              <CardDescription>Summary of your financial data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{income.length}</div>
                  <p className="text-sm text-muted-foreground">Income Sources</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{expenses.length}</div>
                  <p className="text-sm text-muted-foreground">Expenses</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{budgetGoals.length}</div>
                  <p className="text-sm text-muted-foreground">Budget Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Income:</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {settings.currency}
                    {totalIncome.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Total Expenses:</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {settings.currency}
                    {totalExpenses.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Status */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Data Storage
              </CardTitle>
              <CardDescription>Your data is stored locally in your browser</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage Type:</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    Browser LocalStorage
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Persistence:</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Automatic
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backend Required:</span>
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    No
                  </Badge>
                </div>
              </div>
              <div className="pt-2 border-t text-xs text-muted-foreground">
                <p>✅ Data saves automatically when you add/edit items</p>
                <p>✅ Data persists between browser sessions</p>
                <p>✅ No internet connection required</p>
                <p>⚠️ Data is device-specific (use export/import to transfer)</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export, import, or clear your financial data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleExport("json")}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export JSON"}
                </Button>

                <Button onClick={() => handleExport("csv")} disabled={isExporting} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>

              <Button variant="outline" className="w-full" onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>

              <Button variant="destructive" onClick={handleClearData} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 lg:col-span-2">
            <CardHeader>
              <CardTitle>About Budget Planner</CardTitle>
              <CardDescription>Information about this application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex justify-between">
                  <span className="text-sm">Version:</span>
                  <Badge variant="outline">2.0.0</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Storage:</span>
                  <Badge variant="outline">Local Storage</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Framework:</span>
                  <Badge variant="outline">Next.js + React</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Features:</span>
                  <Badge variant="outline">Advanced</Badge>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">New Features in v2.0:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>✅ Recurring transactions</div>
                  <div>✅ Budget goals & tracking</div>
                  <div>✅ Advanced search & filters</div>
                  <div>✅ Multiple currencies</div>
                  <div>✅ Period view toggle</div>
                  <div>✅ Tags & categories</div>
                  <div>✅ CSV export</div>
                  <div>✅ Toast notifications</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your data is stored locally in your browser and never sent to external servers. All calculations and
                processing happen on your device for maximum privacy.
              </p>
            </CardContent>
          </Card>
          <DebugStorage />
        </div>
      </div>
    </div>
  )
}
