import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Medicine } from "../types"

interface MedicineTodoListProps {
  medicines: Medicine[]
  onMedicineTaken: (medicineId: number, isChecked: boolean) => void
  timeRanges: {
    morning: { start: number; end: number }
    afternoon: { start: number; end: number }
    evening: { start: number; end: number }
    night: { start: number; end: number }
  }
}

export function MedicineTodoList({ medicines, onMedicineTaken, timeRanges }: MedicineTodoListProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [medicinesDue, setMedicinesDue] = useState<Medicine[]>([])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const currentHour = currentTime.getHours()
    const dueMedicines = medicines.filter((medicine) => {
      return medicine.timeTags.some((tag) => {
        if (tag.toLowerCase().includes("morning") || tag.toLowerCase().includes("breakfast")) {
          return currentHour >= timeRanges.morning.start && currentHour < timeRanges.morning.end
        } else if (tag.toLowerCase().includes("afternoon") || tag.toLowerCase().includes("lunch")) {
          return currentHour >= timeRanges.afternoon.start && currentHour < timeRanges.afternoon.end
        } else if (tag.toLowerCase().includes("evening") || tag.toLowerCase().includes("dinner")) {
          return currentHour >= timeRanges.evening.start && currentHour < timeRanges.evening.end
        } else if (tag.toLowerCase().includes("night") || tag.toLowerCase().includes("bed")) {
          return currentHour >= timeRanges.night.start || currentHour < timeRanges.night.end
        }
        return false
      })
    })
    setMedicinesDue(dueMedicines)
  }, [medicines, currentTime, timeRanges])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "enough":
        return "bg-green-50 border-green-500"
      case "half":
        return "bg-yellow-50 border-yellow-500"
      case "empty":
        return "bg-red-50 border-red-500"
      default:
        return "bg-gray-50 border-gray-500"
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Medicines to Take Now</CardTitle>
      </CardHeader>
      <CardContent>
        {medicinesDue.length === 0 ? (
          <p>No medicines due at this time.</p>
        ) : (
          <ul className="space-y-2">
            {medicinesDue.map((medicine) => (
              <li
                key={medicine.id}
                className={`flex items-center space-x-4 p-2 rounded-md border ${getLevelColor(medicine.level)}`}
              >
                <Checkbox
                  id={`medicine-${medicine.id}`}
                  onCheckedChange={(checked) => onMedicineTaken(medicine.id, checked as boolean)}
                />
                <label
                  htmlFor={`medicine-${medicine.id}`}
                  className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {medicine.name}
                </label>
                <span className="text-sm text-muted-foreground">{medicine.amountLeft} left</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

