export interface IncomeItem {
  id: string
  source: string
  amount: number
  category: string
  frequency: string
  date: string
  isRecurring: boolean
  nextDueDate?: string
  tags: string[]
}

export interface ExpenseItem {
  id: string
  description: string
  amount: number
  category: string
  frequency: string
  date: string
  isRecurring: boolean
  nextDueDate?: string
  tags: string[]
}

export interface BudgetGoal {
  id: string
  category: string
  limit: number
  period: "weekly" | "monthly" | "yearly"
  spent: number
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color: string
  icon: string
}

export interface AppSettings {
  currency: string
  theme: "light" | "dark" | "system"
  viewPeriod: "weekly" | "monthly" | "yearly"
}

export interface FilterOptions {
  searchTerm: string
  categories: string[]
  dateRange: {
    start: string
    end: string
  }
  amountRange: {
    min: number
    max: number
  }
  tags: string[]
}
