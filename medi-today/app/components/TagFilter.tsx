import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Tag } from "../types"
import { Clock, Edit, Trash2, Plus } from "lucide-react"

interface TagFilterProps {
  tags: Tag[]
  selectedTag: string
  setSelectedTag: (tag: string) => void
  onAddTag: (tag: string) => void
  onEditTag: (tag: Tag) => void
  onDeleteTag: (tagId: number) => void
}

export function TagFilter({ tags, selectedTag, setSelectedTag, onAddTag, onEditTag, onDeleteTag }: TagFilterProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const handleAddTag = () => {
    if (newTag) {
      onAddTag(newTag)
      setNewTag("")
    }
  }

  const handleEditTag = () => {
    if (editingTag && editingTag.name) {
      onEditTag(editingTag)
      setEditingTag(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button variant={selectedTag === "All" ? "default" : "outline"} onClick={() => setSelectedTag("All")}>
        All
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag.id}
          variant={selectedTag === tag.name ? "default" : "outline"}
          onClick={() => setSelectedTag(tag.name)}
        >
          {tag.name}
        </Button>
      ))}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Clock className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Time Tags</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Input placeholder="New Time Tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
              <Button onClick={handleAddTag} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-2">
                {editingTag && editingTag.id === tag.id ? (
                  <>
                    <Input
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                    />
                    <Button onClick={handleEditTag} variant="outline">
                      Save
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingTag(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">{tag.name}</span>
                    <Button size="icon" variant="ghost" onClick={() => setEditingTag(tag)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDeleteTag(tag.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

