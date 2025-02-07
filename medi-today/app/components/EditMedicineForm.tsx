import { useState, useEffect, useRef } from "react"
import type { Medicine, Tag } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"
import { Pill, DollarSign, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditMedicineFormProps {
  medicine: Medicine
  timeTags: Tag[]
  purposeTags: Tag[]
  onSave: (medicine: Medicine) => void
  onCancel: () => void
  onAddTimeTag: (tag: string) => void
  onAddPurposeTag: (tag: string) => void
}

export function EditMedicineForm({
  medicine,
  timeTags,
  purposeTags,
  onSave,
  onCancel,
  onAddTimeTag,
  onAddPurposeTag,
}: EditMedicineFormProps) {
  const [editedMedicine, setEditedMedicine] = useState(medicine)
  const [openTimeTag, setOpenTimeTag] = useState(false)
  const [openPurposeTag, setOpenPurposeTag] = useState(false)
  const [newTimeTag, setNewTimeTag] = useState("")
  const [newPurposeTag, setNewPurposeTag] = useState("")
  const timeTagRef = useRef<HTMLDivElement>(null)
  const purposeTagRef = useRef<HTMLDivElement>(null)

  const handleTimeTagChange = (value: string) => {
    if (!editedMedicine.timeTags.includes(value)) {
      setEditedMedicine({ ...editedMedicine, timeTags: [...editedMedicine.timeTags, value] })
    }
    setNewTimeTag("")
    setOpenTimeTag(false)
  }

  const handleRemoveTimeTag = (tag: string) => {
    setEditedMedicine({ ...editedMedicine, timeTags: editedMedicine.timeTags.filter((t) => t !== tag) })
  }

  const handlePurposeTagChange = (value: string) => {
    setEditedMedicine({ ...editedMedicine, purposeTag: value })
    setNewPurposeTag("")
    setOpenPurposeTag(false)
  }

  const filteredTimeTags = timeTags.filter((tag) => tag.name.toLowerCase().includes(newTimeTag.toLowerCase()))

  const filteredPurposeTags = purposeTags.filter((tag) => tag.name.toLowerCase().includes(newPurposeTag.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeTagRef.current && !timeTagRef.current.contains(event.target as Node)) {
        setOpenTimeTag(false)
      }
      if (purposeTagRef.current && !purposeTagRef.current.contains(event.target as Node)) {
        setOpenPurposeTag(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <CardContent>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(editedMedicine)
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <Pill className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              value={editedMedicine.name}
              onChange={(e) => setEditedMedicine({ ...editedMedicine, name: e.target.value })}
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-2" ref={timeTagRef}>
          <Label>Time Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {editedMedicine.timeTags.map((tag, index) => (
              <span
                key={index}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTimeTag(tag)}
                  className="ml-2 text-secondary-foreground hover:text-primary"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <Input
              placeholder="Add time tag..."
              value={newTimeTag}
              onChange={(e) => {
                setNewTimeTag(e.target.value)
                setOpenTimeTag(true)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTimeTag) {
                  e.preventDefault()
                  handleTimeTagChange(newTimeTag)
                }
              }}
            />
            {openTimeTag && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                {filteredTimeTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="px-3 py-2 cursor-pointer hover:bg-secondary"
                    onClick={() => handleTimeTagChange(tag.name)}
                  >
                    {tag.name}
                  </div>
                ))}
                {newTimeTag && !filteredTimeTags.some((tag) => tag.name.toLowerCase() === newTimeTag.toLowerCase()) && (
                  <div
                    className="px-3 py-2 cursor-pointer hover:bg-secondary text-primary"
                    onClick={() => {
                      onAddTimeTag(newTimeTag)
                      handleTimeTagChange(newTimeTag)
                    }}
                  >
                    Create "{newTimeTag}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2" ref={purposeTagRef}>
          <Label>Purpose Tag</Label>
          <div className="relative">
            <Input
              placeholder="Select or create purpose tag..."
              value={newPurposeTag || editedMedicine.purposeTag}
              onChange={(e) => {
                setNewPurposeTag(e.target.value)
                setOpenPurposeTag(true)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newPurposeTag) {
                  e.preventDefault()
                  handlePurposeTagChange(newPurposeTag)
                }
              }}
            />
            {openPurposeTag && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                {filteredPurposeTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="px-3 py-2 cursor-pointer hover:bg-secondary"
                    onClick={() => handlePurposeTagChange(tag.name)}
                  >
                    {tag.name}
                  </div>
                ))}
                {newPurposeTag &&
                  !filteredPurposeTags.some((tag) => tag.name.toLowerCase() === newPurposeTag.toLowerCase()) && (
                    <div
                      className="px-3 py-2 cursor-pointer hover:bg-secondary text-primary"
                      onClick={() => {
                        onAddPurposeTag(newPurposeTag)
                        handlePurposeTagChange(newPurposeTag)
                      }}
                    >
                      Create "{newPurposeTag}"
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amountLeft">Amount Left</Label>
          <div className="relative">
            <Pill className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="amountLeft"
              type="number"
              value={editedMedicine.amountLeft}
              onChange={(e) => setEditedMedicine({ ...editedMedicine, amountLeft: Number.parseInt(e.target.value) })}
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitPrice">Unit Price</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              value={editedMedicine.unitPrice}
              onChange={(e) => setEditedMedicine({ ...editedMedicine, unitPrice: Number.parseFloat(e.target.value) })}
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dailyNeeded">Daily Needed</Label>
          <div className="relative">
            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="dailyNeeded"
              type="number"
              value={editedMedicine.dailyNeeded}
              onChange={(e) => setEditedMedicine({ ...editedMedicine, dailyNeeded: Number.parseInt(e.target.value) })}
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={editedMedicine.level}
            onValueChange={(value) => setEditedMedicine({ ...editedMedicine, level: value as Medicine["level"] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enough">Enough</SelectItem>
              <SelectItem value="half">Half</SelectItem>
              <SelectItem value="empty">Empty</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="submit" variant="default">
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </CardContent>
  )
}

