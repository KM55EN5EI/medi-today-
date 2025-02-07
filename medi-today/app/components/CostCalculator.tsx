import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Medicine } from "../types"

interface CostCalculatorProps {
  medicines: Medicine[]
}

export function CostCalculator({ medicines }: CostCalculatorProps) {
  const [totalCost, setTotalCost] = useState(0)
  const [dailyCost, setDailyCost] = useState(0)
  const [monthlyCost, setMonthlyCost] = useState(0)

  useEffect(() => {
    const total = medicines.reduce((acc, medicine) => acc + medicine.unitPrice * medicine.amountLeft, 0)
    const daily = medicines.reduce((acc, medicine) => acc + medicine.unitPrice * medicine.dailyNeeded, 0)

    const currentDate = new Date()
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const monthly = daily * daysInMonth

    setTotalCost(total)
    setDailyCost(daily)
    setMonthlyCost(monthly)
  }, [medicines])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium">Total Cost:</p>
            <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Daily Cost:</p>
            <p className="text-2xl font-bold">${dailyCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Monthly Cost:</p>
            <p className="text-2xl font-bold">${monthlyCost.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              (Based on {new Date().toLocaleString("default", { month: "long" })})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

