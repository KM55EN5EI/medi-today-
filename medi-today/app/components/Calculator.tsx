import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Medicine } from "../types"
import { Search, ArrowLeft } from "lucide-react"

interface CalculatorProps {
  medicines: Medicine[]
}

export function Calculator({ medicines }: CalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [calculation, setCalculation] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)

  useEffect(() => {
    if (selectedMedicine) {
      setDisplay(selectedMedicine.unitPrice.toString())
      setCalculation(`${selectedMedicine.name}: ${selectedMedicine.unitPrice}`)
    }
  }, [selectedMedicine])

  const handleNumberClick = (num: string) => {
    setDisplay((prev) => (prev === "0" ? num : prev + num))
    setCalculation((prev) => prev + num)
  }

  const handleOperationClick = (operation: string) => {
    setDisplay("0")
    setCalculation((prev) => prev + " " + operation + " ")
  }

  const handleEqualsClick = () => {
    try {
      const result = eval(calculation.replace(/×/g, "*").replace(/÷/g, "/"))
      setDisplay(result.toString())
      setCalculation((prev) => `${prev} = ${result}`)
    } catch (error) {
      setDisplay("Error")
      setCalculation("Error")
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setCalculation("")
    setSelectedMedicine(null)
  }

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
    setCalculation((prev) => prev.slice(0, -1))
  }

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicine Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="p-2 hover:bg-secondary cursor-pointer"
                  onClick={() => setSelectedMedicine(medicine)}
                >
                  {medicine.name} - ${medicine.unitPrice.toFixed(2)}
                </div>
              ))}
            </div>
          )}
        </div>
        <Input value={calculation} readOnly className="text-right text-sm mb-2" />
        <Input value={display} readOnly className="text-right text-2xl mb-4" />
        <div className="grid grid-cols-4 gap-2">
          {["7", "8", "9", "÷"].map((btn) => (
            <Button
              key={btn}
              onClick={() => (isNaN(Number.parseInt(btn)) ? handleOperationClick(btn) : handleNumberClick(btn))}
              variant="outline"
            >
              {btn}
            </Button>
          ))}
          {["4", "5", "6", "×"].map((btn) => (
            <Button
              key={btn}
              onClick={() => (isNaN(Number.parseInt(btn)) ? handleOperationClick(btn) : handleNumberClick(btn))}
              variant="outline"
            >
              {btn}
            </Button>
          ))}
          {["1", "2", "3", "-"].map((btn) => (
            <Button
              key={btn}
              onClick={() => (isNaN(Number.parseInt(btn)) ? handleOperationClick(btn) : handleNumberClick(btn))}
              variant="outline"
            >
              {btn}
            </Button>
          ))}
          {["0", ".", "=", "+"].map((btn) => (
            <Button
              key={btn}
              onClick={() => {
                if (btn === "=") handleEqualsClick()
                else if (isNaN(Number.parseInt(btn)) && btn !== ".") handleOperationClick(btn)
                else handleNumberClick(btn)
              }}
              variant="outline"
            >
              {btn}
            </Button>
          ))}
          <Button onClick={handleClear} variant="outline" className="col-span-2">
            Clear
          </Button>
          <Button onClick={handleBackspace} variant="outline" className="col-span-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Backspace
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

