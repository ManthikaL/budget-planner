"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit, Plus, TrendingUp, Repeat, Calendar } from "lucide-react"
import { ThreeBackground } from "@/components/three-background"
import { SearchFilter } from "@/components/search-filter"
import { PeriodToggle } from "@/components/period-toggle"
import { useFinanceData } from "@/hooks/use-finance-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function IncomePage() {
  const { income, addIncome, updateIncome, deleteIncome, totalIncome, categories, settings } = useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    category: "Salary",
    frequency: "monthly",
    isRecurring: false,
    tags: [] as string[],
    newTag: "",
  })

  const incomeCategories = categories.filter((cat) => cat.type === "income")
  const frequencies = ["daily", "weekly", "monthly", "quarterly", "yearly", "one-time"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.source || !formData.amount) return

    const incomeData = {
      source: formData.source,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      frequency: formData.frequency,
      date: new Date().toISOString(),
      isRecurring: formData.isRecurring,
      tags: formData.tags || [],
    }

    if (editingId) {
      updateIncome(editingId, incomeData)
      setEditingId(null)
    } else {
      addIncome(incomeData)
    }

    setFormData({
      source: "",
      amount: "",
      category: "Salary",
      frequency: "monthly",
      isRecurring: false,
      tags: [],
      newTag: "",
    })
    setIsDialogOpen(false)
  }

  const handleEdit = (item: any) => {
    setFormData({
      source: item.source,
      amount: item.amount.toString(),
      category: item.category,
      frequency: item.frequency,
      isRecurring: item.isRecurring || false,
      tags: item.tags || [],
      newTag: "",
    })
    setEditingId(item.id)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteIncome(id)
  }

  const addTag = () => {
    if (formData.newTag && !formData.tags.includes(formData.newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag],
        newTag: "",
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const getPeriodLabel = () => {
    switch (settings.viewPeriod) {
      case "weekly":
        return "This Week"
      case "monthly":
        return "This Month"
      case "yearly":
        return "This Year"
      default:
        return "This Month"
    }
  }

  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      <div className="relative z-10 container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Income Management
          </h1>
          <p className="text-muted-foreground text-lg">Track and manage your income sources</p>
          <PeriodToggle />
        </div>

        {/* Search and Filter */}
        <SearchFilter />

        {/* Total Income Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <TrendingUp className="h-5 w-5" />
              Total Income ({getPeriodLabel()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 dark:text-green-200">
              {settings.currency}
              {totalIncome.toFixed(2)}
            </div>
            <p className="text-green-600 dark:text-green-400">From {income.length} sources</p>
          </CardContent>
        </Card>

        {/* Add Income Button */}
        <div className="flex justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Income" : "Add New Income"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update your income source details."
                    : "Add a new source of income to track your finances."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Income Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Main Job, Freelance Project"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({settings.currency})</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Recurring Income Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked as boolean })}
                  />
                  <Label htmlFor="recurring" className="flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    Recurring Income
                  </Label>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={formData.newTag}
                      onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-xs hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? "Update Income" : "Add Income"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Income List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {income.map((item) => {
            const category = incomeCategories.find((cat) => cat.name === item.category)
            return (
              <Card
                key={item.id}
                className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category?.icon || "💼"}</span>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {item.source}
                          {item.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              <Repeat className="h-3 w-3 mr-1" />
                              Recurring
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <Badge variant="secondary" className="mt-1">
                            {item.category}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      {settings.currency}
                      {item.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.frequency}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Added: {new Date(item.date).toLocaleDateString()}
                    </div>
                    {item.nextDueDate && (
                      <div className="text-xs text-blue-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Next: {new Date(item.nextDueDate).toLocaleDateString()}
                      </div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {income.length === 0 && (
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardContent className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Income Sources Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first income source to track your finances.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
