"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ExpenseChartProps {
  expenses: Array<{
    category: string
    amount: number
  }>
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Group expenses by category
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(categoryTotals).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount,
    fill: getCategoryColor(category),
  }))

  const chartConfig = data.reduce((config, item) => {
    config[item.category.toLowerCase()] = {
      label: item.category,
      color: item.fill,
    }
    return config
  }, {} as any)

  function getCategoryColor(category: string) {
    const colors: { [key: string]: string } = {
      food: "#f97316",
      transportation: "#3b82f6",
      housing: "#10b981",
      utilities: "#eab308",
      entertainment: "#8b5cf6",
      healthcare: "#ef4444",
      shopping: "#ec4899",
      education: "#6366f1",
      insurance: "#14b8a6",
      other: "#6b7280",
    }
    return colors[category] || colors.other
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">No expense data available</div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
