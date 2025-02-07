import { useState } from "react"
import type { Medicine, Tag } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditMedicineForm } from "./EditMedicineForm"
import { Clock, Pill, DollarSign, Calendar } from "lucide-react"

interface MedicineGridProps {
  medicines: Medicine[]
  timeTags: Tag[]
  purposeTags: Tag[]
  onEdit: (medicine: Medicine) => void
  onDelete: (id: number) => void
  onAddTimeTag: (tag: string) => void
  onAddPurposeTag: (tag: string) => void
}

export function MedicineGrid({
  medicines,
  timeTags,
  purposeTags,
  onEdit,
  onDelete,
  onAddTimeTag,
  onAddPurposeTag,
}: MedicineGridProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleEdit = (medicine: Medicine) => {
    setEditingId(null)
    onEdit(medicine)
  }

  const handleDelete = (id: number) => {
    onDelete(id)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {medicines.map((medicine) => (
        <Card key={medicine.id} className={`${getLevelColor(medicine.level)} border ${getBorderColor(medicine.level)}`}>
          {editingId === medicine.id ? (
            <EditMedicineForm
              medicine={medicine}
              timeTags={timeTags}
              purposeTags={purposeTags}
              onSave={handleEdit}
              onCancel={() => setEditingId(null)}
              onAddTimeTag={onAddTimeTag}
              onAddPurposeTag={onAddPurposeTag}
            />
          ) : (
            <>
              <CardHeader className="flex flex-col items-start space-y-1 pb-2">
                <div className="flex w-full justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">{medicine.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{medicine.purposeTag}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingId(medicine.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure you want to delete this medicine?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete the medicine from your list.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(medicine.id)}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {medicine.timeTags.map((tag, index) => (
                        <span key={index} className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="flex flex-col items-center">
                    <Pill className="h-4 w-4 mb-1" />
                    <span className="text-sm font-medium">{medicine.amountLeft}</span>
                    <span className="text-xs text-muted-foreground">Left</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <DollarSign className="h-4 w-4 mb-1" />
                    <span className="text-sm font-medium">{medicine.unitPrice.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">Price</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Calendar className="h-4 w-4 mb-1" />
                    <span className="text-sm font-medium">{medicine.dailyNeeded}</span>
                    <span className="text-xs text-muted-foreground">Daily</span>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}

function getLevelColor(level: string) {
  switch (level) {
    case "enough":
      return "bg-green-50"
    case "half":
      return "bg-yellow-50"
    case "empty":
      return "bg-red-50"
    default:
      return "bg-gray-50"
  }
}

function getBorderColor(level: string) {
  switch (level) {
    case "enough":
      return "border-green-500"
    case "half":
      return "border-yellow-500"
    case "empty":
      return "border-red-500"
    default:
      return "border-gray-500"
  }
}

