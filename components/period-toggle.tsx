"use client"

import { Button } from "@/components/ui/button"
import { Calendar, CalendarDays, CalendarRange } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"

export function PeriodToggle() {
  const { settings, setSettings } = useFinanceData()

  const periods = [
    { value: "weekly", label: "Weekly", icon: Calendar },
    { value: "monthly", label: "Monthly", icon: CalendarDays },
    { value: "yearly", label: "Yearly", icon: CalendarRange },
  ] as const

  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      {periods.map((period) => {
        const Icon = period.icon
        return (
          <Button
            key={period.value}
            variant={settings.viewPeriod === period.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setSettings({ ...settings, viewPeriod: period.value })}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {period.label}
          </Button>
        )
      })}
    </div>
  )
}
