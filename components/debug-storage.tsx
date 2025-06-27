"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function DebugStorage() {
  const [storageData, setStorageData] = useState<any>({})

  const loadStorageData = () => {
    const data = {
      income: JSON.parse(localStorage.getItem("budget-planner-income") || "[]"),
      expenses: JSON.parse(localStorage.getItem("budget-planner-expenses") || "[]"),
      budgetGoals: JSON.parse(localStorage.getItem("budget-planner-budget-goals") || "[]"),
      settings: JSON.parse(localStorage.getItem("budget-planner-settings") || "{}"),
    }
    setStorageData(data)
  }

  useEffect(() => {
    loadStorageData()
  }, [])

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Debug: localStorage Data
          <Button variant="outline" size="sm" onClick={loadStorageData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Income items:</strong> {storageData.income?.length || 0}
          </div>
          <div>
            <strong>Expense items:</strong> {storageData.expenses?.length || 0}
          </div>
          <div>
            <strong>Budget goals:</strong> {storageData.budgetGoals?.length || 0}
          </div>
          <div>
            <strong>Budget goals data:</strong>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(storageData.budgetGoals, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
