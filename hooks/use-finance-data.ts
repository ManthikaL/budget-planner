"use client"

import { useState, useEffect, useCallback } from "react"
import type { IncomeItem, ExpenseItem, BudgetGoal, Category, AppSettings, FilterOptions } from "@/types/finance"
import { toast } from "sonner"

const defaultSettings: AppSettings = {
  currency: "$",
  theme: "system",
  viewPeriod: "monthly",
}

const defaultCategories: Category[] = [
  { id: "1", name: "Food & Dining", type: "expense", color: "#f97316", icon: "🍽️" },
  { id: "2", name: "Transportation", type: "expense", color: "#3b82f6", icon: "🚗" },
  { id: "3", name: "Housing", type: "expense", color: "#10b981", icon: "🏠" },
  { id: "4", name: "Utilities", type: "expense", color: "#eab308", icon: "⚡" },
  { id: "5", name: "Entertainment", type: "expense", color: "#8b5cf6", icon: "🎬" },
  { id: "6", name: "Healthcare", type: "expense", color: "#ef4444", icon: "🏥" },
  { id: "7", name: "Shopping", type: "expense", color: "#ec4899", icon: "🛍️" },
  { id: "8", name: "Education", type: "expense", color: "#6366f1", icon: "📚" },
  { id: "9", name: "Insurance", type: "expense", color: "#14b8a6", icon: "🛡️" },
  { id: "10", name: "Other", type: "expense", color: "#6b7280", icon: "📦" },
  { id: "11", name: "Salary", type: "income", color: "#10b981", icon: "💼" },
  { id: "12", name: "Freelance", type: "income", color: "#3b82f6", icon: "💻" },
  { id: "13", name: "Business", type: "income", color: "#8b5cf6", icon: "🏢" },
  { id: "14", name: "Investment", type: "income", color: "#f59e0b", icon: "📈" },
  { id: "15", name: "Rental", type: "income", color: "#06b6d4", icon: "🏘️" },
]

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
    toast.error(`Failed to save ${key.replace("budget-planner-", "")} data`)
    return false
  }
}

const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsed = JSON.parse(saved)
      return Array.isArray(defaultValue) ? (Array.isArray(parsed) ? parsed : defaultValue) : parsed
    }
    return defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    toast.error(`Failed to load ${key.replace("budget-planner-", "")} data`)
    return defaultValue
  }
}

export function useFinanceData() {
  const [income, setIncome] = useState<IncomeItem[]>([])
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [settings, setSettingsState] = useState<AppSettings>(defaultSettings)
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    categories: [],
    dateRange: { start: "", end: "" },
    amountRange: { min: 0, max: 0 },
    tags: [],
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedIncome = loadFromLocalStorage("budget-planner-income", [])
    const savedExpenses = loadFromLocalStorage("budget-planner-expenses", [])
    const savedBudgetGoals = loadFromLocalStorage("budget-planner-budget-goals", [])
    const savedCategories = loadFromLocalStorage("budget-planner-categories", defaultCategories)
    const savedSettings = loadFromLocalStorage("budget-planner-settings", defaultSettings)

    setIncome(savedIncome)
    setExpenses(savedExpenses)
    setBudgetGoals(savedBudgetGoals)
    setCategories(savedCategories)
    setSettingsState({ ...defaultSettings, ...savedSettings })

    // Show success message if data was loaded
    if (savedIncome.length > 0 || savedExpenses.length > 0) {
      toast.success("Data loaded from browser storage!")
    }

    // Recalculate budget goals after loading data
    if (savedBudgetGoals.length > 0 && savedExpenses.length > 0) {
      setTimeout(() => {
        setBudgetGoals((prevGoals) =>
          prevGoals.map((goal) => {
            const categoryExpenses = savedExpenses.filter((expense: ExpenseItem) => expense.category === goal.category)
            const totalSpent = categoryExpenses.reduce((sum: number, expense: ExpenseItem) => sum + expense.amount, 0)
            return { ...goal, spent: totalSpent }
          }),
        )
      }, 100)
    }

    // Generate recurring transactions after loading data
    setTimeout(() => generateRecurringTransactions(), 200)
  }, [])

  // Save data to localStorage with better feedback
  useEffect(() => {
    if (income.length > 0) {
      saveToLocalStorage("budget-planner-income", income)
    }
  }, [income])

  useEffect(() => {
    if (expenses.length > 0) {
      saveToLocalStorage("budget-planner-expenses", expenses)
    }
  }, [expenses])

  useEffect(() => {
    // Always save budget goals, even if empty array
    saveToLocalStorage("budget-planner-budget-goals", budgetGoals)
  }, [budgetGoals])

  useEffect(() => {
    saveToLocalStorage("budget-planner-categories", categories)
  }, [categories])

  useEffect(() => {
    saveToLocalStorage("budget-planner-settings", settings)
  }, [settings])

  // Settings update function with immediate localStorage save
  const setSettings = useCallback((newSettings: AppSettings) => {
    setSettingsState(newSettings)
    try {
      localStorage.setItem("budget-planner-settings", JSON.stringify(newSettings))
    } catch (error) {
      console.error("Error saving settings to localStorage:", error)
    }
  }, [])

  // Generate recurring transactions
  const generateRecurringTransactions = useCallback(() => {
    const today = new Date()

    // Check income
    setIncome((prev) => {
      const updated = [...prev]
      let hasNewTransactions = false

      prev.forEach((item, index) => {
        if (item.isRecurring && item.nextDueDate) {
          const dueDate = new Date(item.nextDueDate)
          if (dueDate <= today) {
            // Generate new transaction
            const newTransaction: IncomeItem = {
              ...item,
              id: Date.now().toString() + Math.random(),
              date: today.toISOString(),
              nextDueDate: getNextDueDate(item.frequency, today).toISOString(),
            }
            updated.push(newTransaction)

            // Update original item's next due date
            updated[index] = {
              ...item,
              nextDueDate: getNextDueDate(item.frequency, today).toISOString(),
            }
            hasNewTransactions = true
          }
        }
      })

      if (hasNewTransactions) {
        toast.success("Recurring income transactions generated!")
      }
      return updated
    })

    // Check expenses
    setExpenses((prev) => {
      const updated = [...prev]
      let hasNewTransactions = false

      prev.forEach((item, index) => {
        if (item.isRecurring && item.nextDueDate) {
          const dueDate = new Date(item.nextDueDate)
          if (dueDate <= today) {
            // Generate new transaction
            const newTransaction: ExpenseItem = {
              ...item,
              id: Date.now().toString() + Math.random(),
              date: today.toISOString(),
              nextDueDate: getNextDueDate(item.frequency, today).toISOString(),
            }
            updated.push(newTransaction)

            // Update original item's next due date
            updated[index] = {
              ...item,
              nextDueDate: getNextDueDate(item.frequency, today).toISOString(),
            }
            hasNewTransactions = true
          }
        }
      })

      if (hasNewTransactions) {
        toast.success("Recurring expense transactions generated!")
      }
      return updated
    })
  }, [])

  const getNextDueDate = (frequency: string, currentDate: Date): Date => {
    const nextDate = new Date(currentDate)

    switch (frequency) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + 1)
        break
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      case "quarterly":
        nextDate.setMonth(nextDate.getMonth() + 3)
        break
      case "yearly":
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        break
      default:
        nextDate.setMonth(nextDate.getMonth() + 1)
    }

    return nextDate
  }

  // Filter functions
  const getFilteredData = useCallback(() => {
    const filterItems = <T extends IncomeItem | ExpenseItem>(items: T[]): T[] => {
      return items.filter((item) => {
        // Search term filter
        if (
          filters.searchTerm &&
          !item.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !item.source?.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) {
          return false
        }

        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
          return false
        }

        // Date range filter
        if (filters.dateRange.start && new Date(item.date) < new Date(filters.dateRange.start)) {
          return false
        }
        if (filters.dateRange.end && new Date(item.date) > new Date(filters.dateRange.end)) {
          return false
        }

        // Amount range filter
        if (filters.amountRange.min > 0 && item.amount < filters.amountRange.min) {
          return false
        }
        if (filters.amountRange.max > 0 && item.amount > filters.amountRange.max) {
          return false
        }

        // Tags filter
        if (filters.tags.length > 0 && !filters.tags.some((tag) => item.tags?.includes(tag))) {
          return false
        }

        return true
      })
    }

    return {
      filteredIncome: filterItems(income),
      filteredExpenses: filterItems(expenses),
    }
  }, [income, expenses, filters])

  // Period-based calculations
  const getPeriodData = useCallback(() => {
    const now = new Date()
    const { filteredIncome, filteredExpenses } = getFilteredData()

    const filterByPeriod = <T extends IncomeItem | ExpenseItem>(items: T[]): T[] => {
      return items.filter((item) => {
        const itemDate = new Date(item.date)

        switch (settings.viewPeriod) {
          case "weekly":
            const weekStart = new Date(now)
            weekStart.setDate(now.getDate() - now.getDay())
            weekStart.setHours(0, 0, 0, 0)
            return itemDate >= weekStart

          case "monthly":
            return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()

          case "yearly":
            return itemDate.getFullYear() === now.getFullYear()

          default:
            return true
        }
      })
    }

    const periodIncome = filterByPeriod(filteredIncome)
    const periodExpenses = filterByPeriod(filteredExpenses)

    return {
      periodIncome,
      periodExpenses,
      totalIncome: periodIncome.reduce((sum, item) => sum + item.amount, 0),
      totalExpenses: periodExpenses.reduce((sum, item) => sum + item.amount, 0),
    }
  }, [getFilteredData, settings.viewPeriod])

  // Income functions
  const addIncome = useCallback((incomeData: Omit<IncomeItem, "id">) => {
    const newIncome: IncomeItem = {
      ...incomeData,
      id: Date.now().toString(),
      tags: incomeData.tags || [],
      nextDueDate: incomeData.isRecurring ? getNextDueDate(incomeData.frequency, new Date()).toISOString() : undefined,
    }
    setIncome((prev) => [...prev, newIncome])
    toast.success("Income added and saved to browser storage!")
  }, [])

  const updateIncome = useCallback((id: string, incomeData: Omit<IncomeItem, "id">) => {
    setIncome((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...incomeData,
              id,
              nextDueDate: incomeData.isRecurring
                ? getNextDueDate(incomeData.frequency, new Date()).toISOString()
                : undefined,
            }
          : item,
      ),
    )
    toast.success("Income updated successfully!")
  }, [])

  const deleteIncome = useCallback((id: string) => {
    setIncome((prev) => prev.filter((item) => item.id !== id))
    toast.success("Income deleted successfully!")
  }, [])

  // Expense functions
  const addExpense = useCallback((expenseData: Omit<ExpenseItem, "id">) => {
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: Date.now().toString(),
      tags: expenseData.tags || [],
      nextDueDate: expenseData.isRecurring
        ? getNextDueDate(expenseData.frequency, new Date()).toISOString()
        : undefined,
    }
    setExpenses((prev) => [...prev, newExpense])

    // Update budget goals with the new expense
    setBudgetGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.category === expenseData.category ? { ...goal, spent: goal.spent + expenseData.amount } : goal,
      ),
    )

    toast.success("Expense added and saved to browser storage!")
  }, [])

  const updateExpense = useCallback(
    (id: string, expenseData: Omit<ExpenseItem, "id">) => {
      const oldExpense = expenses.find((e) => e.id === id)
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...expenseData,
                id,
                nextDueDate: expenseData.isRecurring
                  ? getNextDueDate(expenseData.frequency, new Date()).toISOString()
                  : undefined,
              }
            : item,
        ),
      )

      // Update budget goals properly
      if (oldExpense) {
        setBudgetGoals((prevGoals) =>
          prevGoals
            .map((goal) => {
              if (goal.category === oldExpense.category) {
                // Remove old expense amount
                const newSpent = Math.max(0, goal.spent - oldExpense.amount)
                return { ...goal, spent: newSpent }
              }
              return goal
            })
            .map((goal) => {
              if (goal.category === expenseData.category) {
                // Add new expense amount
                return { ...goal, spent: goal.spent + expenseData.amount }
              }
              return goal
            }),
        )
      }
      toast.success("Expense updated successfully!")
    },
    [expenses],
  )

  const deleteExpense = useCallback(
    (id: string) => {
      const expense = expenses.find((e) => e.id === id)
      setExpenses((prev) => prev.filter((item) => item.id !== id))

      // Update budget goals by removing the deleted expense amount
      if (expense) {
        setBudgetGoals((prevGoals) =>
          prevGoals.map((goal) =>
            goal.category === expense.category ? { ...goal, spent: Math.max(0, goal.spent - expense.amount) } : goal,
          ),
        )
      }
      toast.success("Expense deleted successfully!")
    },
    [expenses],
  )

  // Budget goal functions
  const addBudgetGoal = useCallback(
    (goalData: Omit<BudgetGoal, "id" | "spent" | "createdAt">) => {
      // Calculate current spent amount for this category from existing expenses
      const categoryExpenses = expenses.filter((expense) => expense.category === goalData.category)
      const currentSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      const newGoal: BudgetGoal = {
        ...goalData,
        id: Date.now().toString(),
        spent: currentSpent, // Set actual spent amount from existing expenses
        createdAt: new Date().toISOString(),
      }
      setBudgetGoals((prev) => [...prev, newGoal])
      toast.success("Budget goal created and saved to browser storage!")
    },
    [expenses],
  )

  const updateBudgetGoal = useCallback((id: string, goalData: Partial<BudgetGoal>) => {
    setBudgetGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...goalData } : goal)))
    toast.success("Budget goal updated successfully!")
  }, [])

  const deleteBudgetGoal = useCallback((id: string) => {
    setBudgetGoals((prev) => prev.filter((goal) => goal.id !== id))
    toast.success("Budget goal deleted successfully!")
  }, [])

  // Category functions
  const addCategory = useCallback((categoryData: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    }
    setCategories((prev) => [...prev, newCategory])
    toast.success("Category added successfully!")
  }, [])

  const updateCategory = useCallback((id: string, categoryData: Partial<Category>) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...categoryData } : cat)))
    toast.success("Category updated successfully!")
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    toast.success("Category deleted successfully!")
  }, [])

  // Export/Import functions
  const exportData = useCallback(
    (format: "json" | "csv" = "json") => {
      const data = {
        income,
        expenses,
        budgetGoals,
        categories,
        settings,
        exportDate: new Date().toISOString(),
        version: "2.0",
      }

      if (format === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `budget-planner-export-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        // CSV export
        const csvData = [
          ["Type", "Description/Source", "Amount", "Category", "Date", "Tags"],
          ...income.map((item) => [
            "Income",
            item.source,
            item.amount,
            item.category,
            item.date,
            item.tags?.join(";") || "",
          ]),
          ...expenses.map((item) => [
            "Expense",
            item.description,
            item.amount,
            item.category,
            item.date,
            item.tags?.join(";") || "",
          ]),
        ]

        const csvContent = csvData.map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `budget-planner-export-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      toast.success(`Data exported successfully as ${format.toUpperCase()}!`)
    },
    [income, expenses, budgetGoals, categories, settings],
  )

  const importData = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.income && data.expenses) {
            setIncome(data.income)
            setExpenses(data.expenses)
            if (data.budgetGoals) setBudgetGoals(data.budgetGoals)
            if (data.categories) setCategories(data.categories)
            if (data.settings) setSettings({ ...defaultSettings, ...data.settings })
            toast.success("Data imported successfully!")
          } else {
            toast.error("Invalid file format")
          }
        } catch (error) {
          toast.error("Error importing data")
        }
      }
      reader.readAsText(file)
    },
    [setSettings],
  )

  const clearAllData = useCallback(() => {
    setIncome([])
    setExpenses([])
    setBudgetGoals([])
    setCategories(defaultCategories)
    setSettings(defaultSettings)
    localStorage.removeItem("budget-planner-income")
    localStorage.removeItem("budget-planner-expenses")
    localStorage.removeItem("budget-planner-budget-goals")
    localStorage.removeItem("budget-planner-categories")
    localStorage.removeItem("budget-planner-settings")
    toast.success("All data cleared successfully!")
  }, [setSettings])

  // Add a function to recalculate budget goals based on current expenses
  const recalculateBudgetGoals = useCallback(() => {
    setBudgetGoals((prevGoals) =>
      prevGoals.map((goal) => {
        const categoryExpenses = expenses.filter((expense) => expense.category === goal.category)
        const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        return { ...goal, spent: totalSpent }
      }),
    )
  }, [expenses])

  // Remove this useEffect:
  // useEffect(() => {
  //   if (budgetGoals.length > 0 && expenses.length > 0) {
  //     recalculateBudgetGoals()
  //   }
  // }, [expenses.length])

  const { periodIncome, periodExpenses, totalIncome, totalExpenses } = getPeriodData()
  const balance = totalIncome - totalExpenses

  return {
    // Data
    income: periodIncome,
    expenses: periodExpenses,
    allExpenses: expenses, // Add this to provide access to all expenses
    budgetGoals,
    categories,
    settings,
    filters,

    // Calculations
    totalIncome,
    totalExpenses,
    balance,

    // Income functions
    addIncome,
    updateIncome,
    deleteIncome,

    // Expense functions
    addExpense,
    updateExpense,
    deleteExpense,

    // Budget goal functions
    addBudgetGoal,
    updateBudgetGoal,
    deleteBudgetGoal,

    // Category functions
    addCategory,
    updateCategory,
    deleteCategory,

    // Settings
    setSettings,
    setFilters,

    // Utility functions
    exportData,
    importData,
    clearAllData,
    generateRecurringTransactions,
    getFilteredData,
  }
}
