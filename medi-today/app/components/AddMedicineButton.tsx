import { useState, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Medicine, Tag } from "../types"
import { Pill, DollarSign, Calendar, Gauge } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddMedicineButtonProps {
  onAdd: (medicine: Medicine) => void
  timeTags: Tag[]
  purposeTags: Tag[]
  onAddTimeTag: (tag: string) => void
  onAddPurposeTag: (tag: string) => void
  children: ReactNode
}

export function AddMedicineButton({
  onAdd,
  timeTags,
  purposeTags,
  onAddTimeTag,
  onAddPurposeTag,
  children,
}: AddMedicineButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, "id">>({
    name: "",
    timeTags: [],
    purposeTag: "",
    level: "enough",
    amountLeft: 0,
    unitPrice: 0,
    dailyNeeded: 0,
  })
  const [openTimeTag, setOpenTimeTag] = useState(false)
  const [openPurposeTag, setOpenPurposeTag] = useState(false)
  const [newTimeTag, setNewTimeTag] = useState("")
  const [newPurposeTag, setNewPurposeTag] = useState("")

  const handleAdd = () => {
    if (newMedicine.name && newMedicine.timeTags.length > 0 && newMedicine.purposeTag) {
      onAdd(newMedicine as Medicine)
      setIsOpen(false)
      setNewMedicine({
        name: "",
        timeTags: [],
        purposeTag: "",
        level: "enough",
        amountLeft: 0,
        unitPrice: 0,
        dailyNeeded: 0,
      })
    }
  }

  const handleTimeTagChange = (value: string) => {
    if (!newMedicine.timeTags.includes(value)) {
      setNewMedicine({ ...newMedicine, timeTags: [...newMedicine.timeTags, value] })
    }
    setNewTimeTag("")
    setOpenTimeTag(false)
  }

  const handleRemoveTimeTag = (tag: string) => {
    setNewMedicine({ ...newMedicine, timeTags: newMedicine.timeTags.filter((t) => t !== tag) })
  }

  const handlePurposeTagChange = (value: string) => {
    setNewMedicine({ ...newMedicine, purposeTag: value })
    setNewPurposeTag("")
    setOpenPurposeTag(false)
  }

  const filteredTimeTags = timeTags.filter((tag) => tag.name.toLowerCase().includes(newTimeTag.toLowerCase()))

  const filteredPurposeTags = purposeTags.filter((tag) => tag.name.toLowerCase().includes(newPurposeTag.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openTimeTag && !event.composedPath().some((el) => el === document.getElementById("time-tag-input"))) {
        setOpenTimeTag(false)
      }
      if (openPurposeTag && !event.composedPath().some((el) => el === document.getElementById("purpose-tag-input"))) {
        setOpenPurposeTag(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openTimeTag, openPurposeTag])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAdd()
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Pill className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Medicine name"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Time Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newMedicine.timeTags.map((tag, index) => (
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
                id="time-tag-input"
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
                  {newTimeTag &&
                    !filteredTimeTags.some((tag) => tag.name.toLowerCase() === newTimeTag.toLowerCase()) && (
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
          <div className="space-y-2">
            <Label>Purpose Tag</Label>
            <div className="relative">
              <Input
                id="purpose-tag-input"
                placeholder="Select or create purpose tag..."
                value={newPurposeTag || newMedicine.purposeTag}
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
              <Gauge className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amountLeft"
                type="number"
                placeholder="Amount left"
                value={newMedicine.amountLeft}
                onChange={(e) => setNewMedicine({ ...newMedicine, amountLeft: Number.parseInt(e.target.value) })}
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
                placeholder="Unit price"
                value={newMedicine.unitPrice}
                onChange={(e) => setNewMedicine({ ...newMedicine, unitPrice: Number.parseFloat(e.target.value) })}
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
                placeholder="Daily needed"
                value={newMedicine.dailyNeeded}
                onChange={(e) => setNewMedicine({ ...newMedicine, dailyNeeded: Number.parseInt(e.target.value) })}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={newMedicine.level}
              onValueChange={(value) => setNewMedicine({ ...newMedicine, level: value as Medicine["level"] })}
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
          <Button type="submit" className="w-full">
            Add Medicine
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

