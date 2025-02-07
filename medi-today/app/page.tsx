"use client"

import { useState } from "react"
import { MedicineGrid } from "./components/MedicineGrid"
import { TagFilter } from "./components/TagFilter"
import { AddMedicineButton } from "./components/AddMedicineButton"
import { SearchBar } from "./components/SearchBar"
import type { Medicine, Tag } from "./types"
import { PlusCircle } from "lucide-react"
import { MedicineTodoList } from "./components/MedicineTodoList"
import { Settings, type SettingsType } from "./components/Settings"
import { CostCalculator } from "./components/CostCalculator"
import { Calculator } from "./components/Calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const initialMedicines: Medicine[] = [
  {
    id: 1,
    name: "Aspirin",
    timeTags: ["Before breakfast", "After dinner"],
    purposeTag: "Pain relief",
    level: "enough",
    amountLeft: 30,
    unitPrice: 0.5,
    dailyNeeded: 1,
  },
  {
    id: 2,
    name: "Ibuprofen",
    timeTags: ["After lunch"],
    purposeTag: "Pain relief",
    level: "half",
    amountLeft: 15,
    unitPrice: 0.75,
    dailyNeeded: 2,
  },
  {
    id: 3,
    name: "Amoxicillin",
    timeTags: ["With dinner"],
    purposeTag: "Antibiotic",
    level: "empty",
    amountLeft: 0,
    unitPrice: 1.2,
    dailyNeeded: 3,
  },
  {
    id: 4,
    name: "Loratadine",
    timeTags: ["Before bed"],
    purposeTag: "Allergy",
    level: "enough",
    amountLeft: 25,
    unitPrice: 0.8,
    dailyNeeded: 1,
  },
]

const initialTimeTags: Tag[] = [
  { id: 1, name: "Before breakfast" },
  { id: 2, name: "After lunch" },
  { id: 3, name: "With dinner" },
  { id: 4, name: "Before bed" },
  { id: 5, name: "After dinner" },
]

const initialPurposeTags: Tag[] = [
  { id: 1, name: "Pain relief" },
  { id: 2, name: "Antibiotic" },
  { id: 3, name: "Allergy" },
  { id: 4, name: "Vitamin" },
]

const initialTimeRanges = {
  morning: { start: 6, end: 10 },
  afternoon: { start: 11, end: 14 },
  evening: { start: 17, end: 21 },
  night: { start: 21, end: 2 },
}

const initialSettings: SettingsType = {
  timeRanges: initialTimeRanges,
  language: "en",
  lowStockThreshold: 5,
}

export default function MediToday() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines)
  const [timeTags, setTimeTags] = useState<Tag[]>(initialTimeTags)
  const [purposeTags, setPurposeTags] = useState<Tag[]>(initialPurposeTags)
  const [selectedTag, setSelectedTag] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [settings, setSettings] = useState<SettingsType>(initialSettings)

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesTag = selectedTag === "All" || medicine.timeTags.includes(selectedTag)
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.timeTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      medicine.purposeTag.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesSearch
  })

  const handleAddMedicine = (newMedicine: Omit<Medicine, "id">) => {
    setMedicines([...medicines, { ...newMedicine, id: medicines.length + 1 }])
  }

  const handleEditMedicine = (editedMedicine: Medicine) => {
    setMedicines(medicines.map((medicine) => (medicine.id === editedMedicine.id ? editedMedicine : medicine)))
  }

  const handleDeleteMedicine = (id: number) => {
    setMedicines(medicines.filter((medicine) => medicine.id !== id))
  }

  const handleAddTimeTag = (newTag: string) => {
    if (!timeTags.some((tag) => tag.name === newTag)) {
      setTimeTags([...timeTags, { id: timeTags.length + 1, name: newTag }])
    }
  }

  const handleEditTimeTag = (editedTag: Tag) => {
    setTimeTags(timeTags.map((tag) => (tag.id === editedTag.id ? editedTag : tag)))
    setMedicines(
      medicines.map((medicine) => ({
        ...medicine,
        timeTags: medicine.timeTags.map((tag) => (tag === editedTag.name ? editedTag.name : tag)),
      })),
    )
  }

  const handleDeleteTimeTag = (tagId: number) => {
    const tagToDelete = timeTags.find((tag) => tag.id === tagId)
    if (tagToDelete) {
      setTimeTags(timeTags.filter((tag) => tag.id !== tagId))
      setMedicines(
        medicines.map((medicine) => ({
          ...medicine,
          timeTags: medicine.timeTags.filter((tag) => tag !== tagToDelete.name),
        })),
      )
      if (selectedTag === tagToDelete.name) {
        setSelectedTag("All")
      }
    }
  }

  const handleAddPurposeTag = (newTag: string) => {
    if (!purposeTags.some((tag) => tag.name === newTag)) {
      setPurposeTags([...purposeTags, { id: purposeTags.length + 1, name: newTag }])
    }
  }

  const handleEditPurposeTag = (editedTag: Tag) => {
    setPurposeTags(purposeTags.map((tag) => (tag.id === editedTag.id ? editedTag : tag)))
    setMedicines(
      medicines.map((medicine) => ({
        ...medicine,
        purposeTag: medicine.purposeTag === editedTag.name ? editedTag.name : medicine.purposeTag,
      })),
    )
  }

  const handleDeletePurposeTag = (tagId: number) => {
    const tagToDelete = purposeTags.find((tag) => tag.id === tagId)
    if (tagToDelete) {
      setPurposeTags(purposeTags.filter((tag) => tag.id !== tagId))
      setMedicines(
        medicines.map((medicine) => ({
          ...medicine,
          purposeTag: medicine.purposeTag === tagToDelete.name ? "" : medicine.purposeTag,
        })),
      )
    }
  }

  const handleMedicineTaken = (medicineId: number, isChecked: boolean) => {
    setMedicines(
      medicines.map((medicine) => {
        if (medicine.id === medicineId) {
          const newAmountLeft = isChecked ? Math.max(0, medicine.amountLeft - 1) : medicine.amountLeft + 1
          return {
            ...medicine,
            amountLeft: newAmountLeft,
            level: newAmountLeft === 0 ? "empty" : newAmountLeft <= medicine.dailyNeeded * 3 ? "half" : "enough",
          }
        }
        return medicine
      }),
    )
  }

  const handleSaveSettings = (newSettings: SettingsType) => {
    setSettings(newSettings)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">MediToday</h1>
          <div className="flex space-x-2">
            <AddMedicineButton
              onAdd={handleAddMedicine}
              timeTags={timeTags}
              purposeTags={purposeTags}
              onAddTimeTag={handleAddTimeTag}
              onAddPurposeTag={handleAddPurposeTag}
            >
              <PlusCircle className="w-8 h-8" />
            </AddMedicineButton>
            <Settings timeRanges={settings.timeRanges} onSave={handleSaveSettings} currentSettings={settings} />
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <TagFilter
            tags={timeTags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            onAddTag={handleAddTimeTag}
            onEditTag={handleEditTimeTag}
            onDeleteTag={handleDeleteTimeTag}
          />
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <div className="mb-8">
          <MedicineGrid
            medicines={filteredMedicines}
            timeTags={timeTags}
            purposeTags={purposeTags}
            onEdit={handleEditMedicine}
            onDelete={handleDeleteMedicine}
            onAddTimeTag={handleAddTimeTag}
            onAddPurposeTag={handleAddPurposeTag}
          />
        </div>
        <MedicineTodoList
          medicines={medicines}
          onMedicineTaken={handleMedicineTaken}
          timeRanges={settings.timeRanges}
        />
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Medicine Cost Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <CostCalculator medicines={medicines} />
              <Calculator medicines={medicines} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

