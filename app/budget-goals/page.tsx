"use client"

import { ThreeBackground } from "@/components/three-background"
import { BudgetGoals } from "@/components/budget-goals"

export default function BudgetGoalsPage() {
  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      <div className="relative z-10 container mx-auto p-6">
        <BudgetGoals />
      </div>
    </div>
  )
}
