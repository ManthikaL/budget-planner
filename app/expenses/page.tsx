"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, TrendingDown, Repeat } from "lucide-react"
import { ThreeBackground } from "@/components/three-background"
import { useFinanceData } from "@/hooks/use-finance-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense, totalExpenses } = useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Food & Dining",
    frequency: "monthly",
    isRecurring: false,
    tags: [] as string[],
    newTag: "",
  })

  const categories = [
    "Food & Dining",
    "transportation",
    "housing",
    "utilities",
    "entertainment",
    "healthcare",
    "shopping",
    "education",
    "insurance",
    "other",
  ]

  const frequencies = ["daily", "weekly", "monthly", "quarterly", "yearly", "one-time"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) return

    const expenseData = {
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      frequency: formData.frequency,
      date: new Date().toISOString(),
      isRecurring: formData.isRecurring,
      tags: formData.tags || [],
    }

    if (editingId) {
      updateExpense(editingId, expenseData)
      setEditingId(null)
    } else {
      addExpense(expenseData)
    }

    setFormData({
      description: "",
      amount: "",
      category: "Food & Dining",
      frequency: "monthly",
      isRecurring: false,
      tags: [],
      newTag: "",
    })
    setIsDialogOpen(false)
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

  const handleEdit = (item: any) => {
    setFormData({
      description: item.description,
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
    deleteExpense(id)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Food & Dining": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      housing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      utilities: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      healthcare: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      education: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      insurance: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return colors[category] || colors.other
  }

  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      <div className="relative z-10 container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Expense Management
          </h1>
          <p className="text-muted-foreground text-lg">Track and categorize your expenses</p>
        </div>

        {/* Total Expenses Card */}
        <Card className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-950 dark:to-pink-900 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <TrendingDown className="h-5 w-5" />
              Total Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800 dark:text-red-200">${totalExpenses.toFixed(2)}</div>
            <p className="text-red-600 dark:text-red-400">Across {expenses.length} expenses</p>
          </CardContent>
        </Card>

        {/* Add Expense Button */}
        <div className="flex justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update your expense details." : "Add a new expense to track your spending."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Groceries, Gas, Rent"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
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
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
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
                {/* Recurring Expense Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked as boolean })}
                  />
                  <Label htmlFor="recurring" className="flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    Recurring Expense
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
                  {editingId ? "Update Expense" : "Add Expense"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Expenses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenses.map((item) => (
            <Card
              key={item.id}
              className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.description}</CardTitle>
                    <CardDescription>
                      <Badge className={`mt-1 ${getCategoryColor(item.category)}`}>{item.category}</Badge>
                    </CardDescription>
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
                  <div className="text-2xl font-bold text-red-600">${item.amount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{item.frequency}</div>
                  <div className="text-xs text-muted-foreground">Added: {new Date(item.date).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {expenses.length === 0 && (
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardContent className="text-center py-12">
              <TrendingDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Expenses Yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first expense to track your spending.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
