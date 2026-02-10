"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import type { AnomalyGroup, Tag } from "@/types/anomaly"
import { AnomalyTableRow } from "./AnomalyTableRow"

interface AnomalyTableProps {
  anomalies: AnomalyGroup[]
  selectedIds: Set<string>
  onSelectChange: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onDismiss: (id: string) => void
  onAction: (id: string) => void
  onMarkIntended: (id: string) => void
  allTags: Tag[]
  anomalyTags: Record<string, string[]>
}

function resolveGroupTags(
  groupId: string,
  anomalyTags: Record<string, string[]>,
  allTags: Tag[],
): Tag[] {
  const tagIds = anomalyTags[groupId] ?? []
  return tagIds
    .map((id) => allTags.find((t) => t.id === id))
    .filter((t): t is Tag => t !== undefined)
}

export function AnomalyTable({
  anomalies,
  selectedIds,
  onSelectChange,
  onSelectAll,
  onDismiss,
  onAction,
  onMarkIntended,
  allTags,
  anomalyTags,
}: AnomalyTableProps) {
  const allSelected =
    anomalies.length > 0 && anomalies.every((a) => selectedIds.has(a.id))
  const someSelected =
    !allSelected && anomalies.some((a) => selectedIds.has(a.id))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={(checked) => onSelectAll(checked === true)}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Text</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {anomalies.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={8}
              className="h-24 text-center text-muted-foreground"
            >
              No anomalies match your current filters.
            </TableCell>
          </TableRow>
        ) : (
          anomalies.map((group) => (
            <AnomalyTableRow
              key={group.id}
              group={group}
              selected={selectedIds.has(group.id)}
              onSelectChange={onSelectChange}
              onDismiss={onDismiss}
              onAction={onAction}
              onMarkIntended={onMarkIntended}
              tags={resolveGroupTags(group.id, anomalyTags, allTags)}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
