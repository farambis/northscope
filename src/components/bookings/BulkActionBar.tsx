"use client"

import { Button } from "@/components/ui/button"
import type { Tag } from "@/types/anomaly"
import { TagDropdown } from "./TagDropdown"

interface BulkActionBarProps {
  selectedCount: number
  availableTags: Tag[]
  selectedTagIds: string[]
  onDismiss: () => void
  onMarkIntended: () => void
  onToggleTag: (tagId: string) => void
  onCreateTag: (label: string) => void
  onClear: () => void
}

export function BulkActionBar({
  selectedCount,
  availableTags,
  selectedTagIds,
  onDismiss,
  onMarkIntended,
  onToggleTag,
  onCreateTag,
  onClear,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3 shadow-lg">
      <span className="text-sm font-medium">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
        <Button variant="outline" size="sm" onClick={onMarkIntended}>
          Mark as Intended
        </Button>
        <TagDropdown
          availableTags={availableTags}
          selectedTagIds={selectedTagIds}
          onToggleTag={onToggleTag}
          onCreateTag={onCreateTag}
        />
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}
