"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Search } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defaultTags, tagColors } from "@/data/default-tags"
import type { AnomalyGroup, AnomalyType, Tag } from "@/types/anomaly"
import { AnomalyCard } from "./AnomalyCard"
import { AnomalySummaryBar } from "./AnomalySummaryBar"
import { AnomalyTable } from "./AnomalyTable"
import { BulkActionBar } from "./BulkActionBar"
import { ViewToggle, type ViewMode } from "./ViewToggle"

interface AnomalyListProps {
  anomalies: AnomalyGroup[]
}

type TabValue = "all" | AnomalyType

const tabs: { value: TabValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "similar", label: "Similar strings" },
  { value: "typo", label: "Likely typos" },
  { value: "unusual", label: "Unusual patterns" },
]

const sortOptions = [
  { value: "confidence", label: "Confidence" },
  { value: "date", label: "Date" },
  { value: "amount", label: "Amount" },
] as const

type SortOption = (typeof sortOptions)[number]["value"]

function getEntryDate(group: AnomalyGroup): string {
  return group.entries[0]?.date ?? ""
}

function getEntryAmount(group: AnomalyGroup): number {
  return group.entries[0]?.amount ?? 0
}

function matchesSearch(group: AnomalyGroup, query: string): boolean {
  const lower = query.toLowerCase()
  return (
    group.entries.some((e) => e.text.toLowerCase().includes(lower)) ||
    (group.suggestion?.toLowerCase().includes(lower) ?? false) ||
    (group.matchedPattern?.toLowerCase().includes(lower) ?? false) ||
    (group.diffDetails?.toLowerCase().includes(lower) ?? false)
  )
}

function computeCommonTags(
  selectedIds: Set<string>,
  anomalyTags: Record<string, string[]>,
): string[] {
  const ids = [...selectedIds]
  if (ids.length === 0) return []
  const first = new Set(anomalyTags[ids[0]] ?? [])
  for (let i = 1; i < ids.length; i++) {
    const tags = new Set(anomalyTags[ids[i]] ?? [])
    for (const tag of first) {
      if (!tags.has(tag)) first.delete(tag)
    }
  }
  return [...first]
}

export function AnomalyList({ anomalies }: AnomalyListProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("confidence")
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [markedIntendedIds, setMarkedIntendedIds] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [tags, setTags] = useState<Tag[]>(defaultTags)
  const [anomalyTags, setAnomalyTags] = useState<Record<string, string[]>>({})
  const [activeTagFilters, setActiveTagFilters] = useState<Set<string>>(new Set())

  const activeAnomalies = useMemo(() => {
    return anomalies.filter((a) => !dismissedIds.has(a.id) && !markedIntendedIds.has(a.id))
  }, [anomalies, dismissedIds, markedIntendedIds])

  const filteredAnomalies = useMemo(() => {
    let result = activeAnomalies

    if (activeTab !== "all") {
      result = result.filter((a) => a.type === activeTab)
    }

    if (searchQuery) {
      result = result.filter((a) => matchesSearch(a, searchQuery))
    }

    if (activeTagFilters.size > 0) {
      result = result.filter((a) => {
        const groupTags = anomalyTags[a.id] ?? []
        return [...activeTagFilters].every((tagId) => groupTags.includes(tagId))
      })
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "confidence":
          return b.confidence - a.confidence
        case "date":
          return getEntryDate(b).localeCompare(getEntryDate(a))
        case "amount":
          return getEntryAmount(b) - getEntryAmount(a)
      }
    })

    return result
  }, [activeAnomalies, activeTab, searchQuery, sortBy, activeTagFilters, anomalyTags])

  // Derive visible selection — prunes selected IDs not in current filtered view
  const visibleSelectedIds = useMemo(() => {
    const visibleIds = new Set(filteredAnomalies.map((a) => a.id))
    return new Set([...selectedIds].filter((id) => visibleIds.has(id)))
  }, [filteredAnomalies, selectedIds])

  // Clear selection when switching to cards view
  function handleViewModeChange(mode: ViewMode) {
    setViewMode(mode)
    if (mode === "cards") {
      setSelectedIds(new Set())
    }
  }

  function handleDismiss(id: string) {
    setDismissedIds((prev) => new Set([...prev, id]))
    toast("Anomaly dismissed", {
      action: {
        label: "Undo",
        onClick: () => {
          setDismissedIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
        },
      },
    })
  }

  function handleAction(id: string) {
    setDismissedIds((prev) => new Set([...prev, id]))
    toast.success("Correction applied", {
      action: {
        label: "Undo",
        onClick: () => {
          setDismissedIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
        },
      },
    })
  }

  function handleMarkIntended(id: string) {
    setMarkedIntendedIds((prev) => new Set([...prev, id]))
    toast("Marked as intended", {
      action: {
        label: "Undo",
        onClick: () => {
          setMarkedIntendedIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
        },
      },
    })
  }

  function handleSelectChange(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(new Set(filteredAnomalies.map((a) => a.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  function handleBulkDismiss() {
    const ids = [...visibleSelectedIds]
    setDismissedIds((prev) => new Set([...prev, ...ids]))
    setSelectedIds(new Set())
    toast(`${ids.length} anomalies dismissed`, {
      action: {
        label: "Undo",
        onClick: () => {
          setDismissedIds((prev) => {
            const next = new Set(prev)
            ids.forEach((id) => next.delete(id))
            return next
          })
        },
      },
    })
  }

  function handleBulkMarkIntended() {
    const ids = [...visibleSelectedIds]
    setMarkedIntendedIds((prev) => new Set([...prev, ...ids]))
    setSelectedIds(new Set())
    toast(`${ids.length} anomalies marked as intended`, {
      action: {
        label: "Undo",
        onClick: () => {
          setMarkedIntendedIds((prev) => {
            const next = new Set(prev)
            ids.forEach((id) => next.delete(id))
            return next
          })
        },
      },
    })
  }

  function handleBulkToggleTag(tagId: string) {
    const ids = [...visibleSelectedIds]
    setAnomalyTags((prev) => {
      const next = { ...prev }
      for (const id of ids) {
        const current = next[id] ?? []
        if (current.includes(tagId)) {
          next[id] = current.filter((t) => t !== tagId)
        } else {
          next[id] = [...current, tagId]
        }
      }
      return next
    })
  }

  function handleCreateTag(label: string) {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      label,
      color: tagColors[tags.length % tagColors.length],
    }
    setTags((prev) => [...prev, newTag])
  }

  function toggleTagFilter(tagId: string) {
    setActiveTagFilters((prev) => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  if (activeAnomalies.length === 0) {
    const dismissedCount = dismissedIds.size
    const markedIntendedCount = markedIntendedIds.size

    return (
      <div className="space-y-6">
        <AnomalySummaryBar anomalies={activeAnomalies} />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-positive mb-4" />
          <h3 className="text-lg font-semibold">All reviewed</h3>
          <p className="text-muted-foreground">
            {dismissedCount > 0 || markedIntendedCount > 0 ? (
              <>
                {dismissedCount} dismissed &middot; {markedIntendedCount} marked as intended
              </>
            ) : (
              "Every anomaly has been reviewed. Nice work!"
            )}
          </p>
        </div>
      </div>
    )
  }

  // Count how many anomalies have each tag for the filter chips
  const tagCounts = tags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag.id] = activeAnomalies.filter((a) =>
      (anomalyTags[a.id] ?? []).includes(tag.id),
    ).length
    return acc
  }, {})

  const hasAnyTags = Object.values(tagCounts).some((count) => count > 0)

  return (
    <div className="space-y-6">
      <AnomalySummaryBar anomalies={activeAnomalies} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anomalies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-md border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-9 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ViewToggle value={viewMode} onChange={handleViewModeChange} />
        </div>
      </div>

      {hasAnyTags && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Tags:</span>
          {tags.map((tag) => {
            const count = tagCounts[tag.id] ?? 0
            if (count === 0) return null
            const isActive = activeTagFilters.has(tag.id)
            return (
              <Badge
                key={tag.id}
                variant={isActive ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => toggleTagFilter(tag.id)}
              >
                {tag.label} &times;{count}
              </Badge>
            )
          })}
        </div>
      )}

      {filteredAnomalies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">No anomalies match your current filters.</p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="space-y-4">
          {filteredAnomalies.map((group) => (
            <AnomalyCard
              key={group.id}
              group={group}
              onDismiss={handleDismiss}
              onAction={handleAction}
              onMarkIntended={handleMarkIntended}
            />
          ))}
        </div>
      ) : (
        <AnomalyTable
          anomalies={filteredAnomalies}
          selectedIds={visibleSelectedIds}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          onDismiss={handleDismiss}
          onAction={handleAction}
          onMarkIntended={handleMarkIntended}
          allTags={tags}
          anomalyTags={anomalyTags}
        />
      )}

      {viewMode === "table" && visibleSelectedIds.size > 0 && (
        <BulkActionBar
          selectedCount={visibleSelectedIds.size}
          availableTags={tags}
          selectedTagIds={computeCommonTags(visibleSelectedIds, anomalyTags)}
          onDismiss={handleBulkDismiss}
          onMarkIntended={handleBulkMarkIntended}
          onToggleTag={handleBulkToggleTag}
          onCreateTag={handleCreateTag}
          onClear={() => setSelectedIds(new Set())}
        />
      )}
    </div>
  )
}
