"use client"

import { useState } from "react"
import { Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import type { Tag } from "@/types/anomaly"

interface TagDropdownProps {
  availableTags: Tag[]
  selectedTagIds: string[]
  onToggleTag: (tagId: string) => void
  onCreateTag: (label: string) => void
}

export function TagDropdown({
  availableTags,
  selectedTagIds,
  onToggleTag,
  onCreateTag,
}: TagDropdownProps) {
  const [newTagLabel, setNewTagLabel] = useState("")

  function handleCreateTag() {
    const trimmed = newTagLabel.trim()
    if (!trimmed) return
    onCreateTag(trimmed)
    setNewTagLabel("")
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Tags className="mr-1.5 h-4 w-4" />
          Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-3">
        <p className="mb-2 text-sm font-medium">Assign tag</p>
        <div className="space-y-2">
          {availableTags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={selectedTagIds.includes(tag.id)}
                onCheckedChange={() => onToggleTag(tag.id)}
              />
              <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal cursor-pointer">
                {tag.label}
              </Label>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t pt-3">
          <input
            type="text"
            placeholder="Create new tag..."
            value={newTagLabel}
            onChange={(e) => setNewTagLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleCreateTag()
              }
            }}
            className="h-8 w-full rounded-md border bg-background px-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
