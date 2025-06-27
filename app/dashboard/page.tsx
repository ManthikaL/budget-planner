"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"
import { BudgetChart } from "@/components/budget-chart"
import { ExpenseChart } from "@/components/expense-chart"
import { ThreeBackground } from "@/components/three-background"
import { SearchFilter } from "@/components/search-filter"
import { PeriodToggle } from "@/components/period-toggle"
import { BudgetGoals } from "@/components/budget-goals"
import { useFinanceData } from "@/hooks/use-finance-data"
import Link from "next/link"

export default function DashboardPage() {
  const { income, expenses, totalIncome, totalExpenses, balance, settings, budgetGoals } = useFinanceData()

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

  const overBudgetGoals = budgetGoals.filter((goal) => goal.spent > goal.limit)
  const warningGoals = budgetGoals.filter((goal) => goal.spent / goal.limit >= 0.8 && goal.spent <= goal.limit)

  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      <div className="relative z-10 container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Budget Planner Dashboard
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">Track your finances with style and precision</p>
          <div className="flex justify-center">
            <PeriodToggle />
          </div>
        </div>

        {/* Storage Info Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm">💾</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-blue-900 dark:text-blue-100">
                  No Backend Needed - Data Stays in Your Browser
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  All your financial data is automatically saved to localStorage and persists between sessions
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs"
              >
                Auto-Save Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <SearchFilter />

        {/* Budget Alerts */}
        {(overBudgetGoals.length > 0 || warningGoals.length > 0) && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-lg">
                <Target className="h-5 w-5" />
                Budget Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {overBudgetGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-red-100 dark:bg-red-900 rounded gap-2"
                >
                  <span className="text-red-800 dark:text-red-200 text-sm">
                    {goal.category}: Over budget by {settings.currency}
                    {(goal.spent - goal.limit).toFixed(2)}
                  </span>
                  <Badge variant="destructive" className="self-start sm:self-center">
                    Over Budget
                  </Badge>
                </div>
              ))}
              {warningGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-yellow-100 dark:bg-yellow-900 rounded gap-2"
                >
                  <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                    {goal.category}: {((goal.spent / goal.limit) * 100).toFixed(1)}% of budget used
                  </span>
                  <Badge variant="secondary" className="self-start sm:self-center">
                    Warning
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Total Income ({getPeriodLabel()})
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-200">
                {settings.currency}
                {totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">{income.length} income sources</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                Total Expenses ({getPeriodLabel()})
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-red-800 dark:text-red-200">
                {settings.currency}
                {totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">{expenses.length} expenses</p>
            </CardContent>
          </Card>

          <Card
            className={`bg-gradient-to-br ${
              balance >= 0
                ? "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800"
                : "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800"
            } sm:col-span-2 lg:col-span-1`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-medium ${
                  balance >= 0 ? "text-blue-700 dark:text-blue-300" : "text-orange-700 dark:text-orange-300"
                }`}
              >
                Balance ({getPeriodLabel()})
              </CardTitle>
              <DollarSign className={`h-4 w-4 ${balance >= 0 ? "text-blue-600" : "text-orange-600"}`} />
            </CardHeader>
            <CardContent>
              <div
                className={`text-xl md:text-2xl font-bold ${
                  balance >= 0 ? "text-blue-800 dark:text-blue-200" : "text-orange-800 dark:text-orange-200"
                }`}
              >
                {settings.currency}
                {balance.toFixed(2)}
              </div>
              <Badge variant={balance >= 0 ? "default" : "destructive"} className="text-xs">
                {balance >= 0 ? "Surplus" : "Deficit"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5" />
                Budget Overview
              </CardTitle>
              <CardDescription>Income vs Expenses comparison for {getPeriodLabel().toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetChart income={totalIncome} expenses={totalExpenses} />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle className="text-lg">Expense Breakdown</CardTitle>
              <CardDescription>Expenses by category for {getPeriodLabel().toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={expenses} />
            </CardContent>
          </Card>
        </div>

        {/* Budget Goals Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Budget Goals
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">Track your spending against your budget limits</p>
          </div>
          <BudgetGoals />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center">
          <Link href="/income" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </Link>
          <Link href="/expenses" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 hover:from-red-600 hover:to-red-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </Link>
          <Link href="/budget-goals" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 hover:from-blue-600 hover:to-purple-700"
            >
              <Target className="mr-2 h-4 w-4" />
              Manage Goals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
