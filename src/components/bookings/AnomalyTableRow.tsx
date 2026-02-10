"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TableRow, TableCell } from "@/components/ui/table"
import { formatAmount, formatDate } from "@/lib/anomaly-format"
import type { AnomalyGroup, Tag } from "@/types/anomaly"
import { ConfidenceBadge } from "./ConfidenceBadge"
import {
  typeBadgeConfig,
  actionLabels,
  SimilarContent,
  TypoContent,
  UnusualContent,
} from "./AnomalyContent"

interface AnomalyTableRowProps {
  group: AnomalyGroup
  selected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  onDismiss: (id: string) => void
  onAction: (id: string) => void
  onMarkIntended: (id: string) => void
  tags: Tag[]
}

function primaryText(group: AnomalyGroup): string {
  const text = group.entries[0]?.text ?? ""
  if (group.type === "similar" && group.entries.length > 1) {
    return `${text} (+${group.entries.length - 1})`
  }
  return text
}

export function AnomalyTableRow({
  group,
  selected,
  onSelectChange,
  onDismiss,
  onAction,
  onMarkIntended,
  tags,
}: AnomalyTableRowProps) {
  const [expanded, setExpanded] = useState(false)
  const { label, style } = typeBadgeConfig[group.type]
  const entry = group.entries[0]

  return (
    <>
      <TableRow
        data-state={selected ? "selected" : undefined}
        className="cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) =>
              onSelectChange(group.id, checked === true)
            }
            aria-label={`Select ${entry.text}`}
          />
        </TableCell>
        <TableCell>
          <Badge className={style}>{label}</Badge>
        </TableCell>
        <TableCell className="max-w-[300px] truncate font-mono text-sm">
          {primaryText(group)}
        </TableCell>
        <TableCell className="text-right tabular-nums">
          {formatAmount(entry.amount)}
        </TableCell>
        <TableCell>{formatDate(entry.date)}</TableCell>
        <TableCell>
          <ConfidenceBadge confidence={group.confidence} />
        </TableCell>
        <TableCell>
          {tags.length > 0 && (
            <div className="flex gap-1">
              {tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
        </TableCell>
        <TableCell>
          <ChevronRight
            className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={8} className="bg-muted/30 p-4">
            <div className="space-y-4">
              {group.type === "similar" && <SimilarContent group={group} />}
              {group.type === "typo" && <TypoContent group={group} />}
              {group.type === "unusual" && <UnusualContent group={group} />}
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => onAction(group.id)}>
                  {actionLabels[group.type]}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkIntended(group.id)}
                >
                  Mark as Intended
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(group.id)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
