"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Target, TrendingUp, AlertTriangle } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function BudgetGoals() {
  const { budgetGoals, categories, settings, allExpenses, addBudgetGoal, updateBudgetGoal, deleteBudgetGoal } =
    useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    period: "monthly" as "weekly" | "monthly" | "yearly",
  })

  const expenseCategories = categories.filter((cat) => cat.type === "expense")

  const recalculateSpentAmounts = () => {
    budgetGoals.forEach((goal) => {
      const categoryExpenses = allExpenses.filter((expense) => expense.category === goal.category)
      const actualSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      if (Math.abs(actualSpent - goal.spent) > 0.01) {
        updateBudgetGoal(goal.id, { spent: actualSpent })
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.limit) return

    const goalData = {
      category: formData.category,
      limit: Number.parseFloat(formData.limit),
      period: formData.period,
    }

    if (editingId) {
      updateBudgetGoal(editingId, goalData)
      setEditingId(null)
    } else {
      addBudgetGoal(goalData)
    }

    setFormData({ category: "", limit: "", period: "monthly" })
    setIsDialogOpen(false)
  }

  const handleEdit = (goal: any) => {
    setFormData({
      category: goal.category,
      limit: goal.limit.toString(),
      period: goal.period,
    })
    setEditingId(goal.id)
    setIsDialogOpen(true)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500"
    if (percentage >= 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusBadge = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return <Badge variant="destructive">Over Budget</Badge>
    if (percentage >= 80)
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Warning
        </Badge>
      )
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        On Track
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Budget Goals</h2>
          <p className="text-muted-foreground">Set and track your spending limits</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Budget Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Budget Goal" : "Add Budget Goal"}</DialogTitle>
                <DialogDescription>Set a spending limit for a category to track your budget.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limit">Budget Limit ({settings.currency})</Label>
                  <Input
                    id="limit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value: "weekly" | "monthly" | "yearly") =>
                      setFormData({ ...formData, period: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Update Goal" : "Create Goal"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={recalculateSpentAmounts} className="w-full sm:w-auto">
            Sync with Expenses
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {budgetGoals.map((goal) => {
          const percentage = (goal.spent / goal.limit) * 100
          const category = categories.find((cat) => cat.name === goal.category)

          return (
            <Card key={goal.id} className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-2xl">{category?.icon || "📦"}</span>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base md:text-lg truncate">{goal.category}</CardTitle>
                      <CardDescription className="text-sm">{goal.period} budget</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBudgetGoal(goal.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Spent: {settings.currency}
                      {goal.spent.toFixed(2)}
                    </span>
                    <span>
                      Limit: {settings.currency}
                      {goal.limit.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}% used</span>
                    {getStatusBadge(goal.spent, goal.limit)}
                  </div>
                </div>

                {percentage >= 100 && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Over budget by {settings.currency}
                    {(goal.spent - goal.limit).toFixed(2)}
                  </div>
                )}

                {percentage >= 80 && percentage < 100 && (
                  <div className="flex items-center gap-2 text-yellow-600 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    Approaching limit
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {budgetGoals.length === 0 && (
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Budget Goals Yet</h3>
            <p className="text-muted-foreground mb-4">Create budget goals to track your spending and stay on target.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
