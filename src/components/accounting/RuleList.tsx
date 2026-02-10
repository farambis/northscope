"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Search } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RuleSuggestion, RuleType } from "@/types/rule"
import { RuleCard } from "./RuleCard"
import { RuleSummaryBar } from "./RuleSummaryBar"

interface RuleListProps {
  rules: RuleSuggestion[]
}

type TabValue = "all" | RuleType

const tabs: { value: TabValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "account-mapping", label: "Account Mapping" },
  { value: "tax-code", label: "Tax Code" },
  { value: "recurring", label: "Recurring" },
]

const sortOptions = [
  { value: "confidence", label: "Confidence" },
  { value: "type", label: "Type" },
] as const

type SortOption = (typeof sortOptions)[number]["value"]

function matchesSearch(rule: RuleSuggestion, query: string): boolean {
  const lower = query.toLowerCase()
  return (
    rule.statement.toLowerCase().includes(lower) ||
    rule.evidence.toLowerCase().includes(lower)
  )
}

export function RuleList({ rules }: RuleListProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("confidence")
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set())

  const activeRules = useMemo(() => {
    return rules.filter((r) => !dismissedIds.has(r.id))
  }, [rules, dismissedIds])

  const filteredRules = useMemo(() => {
    let result = activeRules

    if (activeTab !== "all") {
      result = result.filter((r) => r.type === activeTab)
    }

    if (searchQuery) {
      result = result.filter((r) => matchesSearch(r, searchQuery))
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "confidence":
          return b.confidence - a.confidence
        case "type":
          return a.type.localeCompare(b.type)
      }
    })

    return result
  }, [activeRules, activeTab, searchQuery, sortBy])

  function handleAccept(id: string) {
    setAcceptedIds((prev) => new Set([...prev, id]))
    toast.success("Rule accepted", {
      action: {
        label: "Undo",
        onClick: () => {
          setAcceptedIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
        },
      },
    })
  }

  function handleDismiss(id: string) {
    setDismissedIds((prev) => new Set([...prev, id]))
    toast("Rule dismissed", {
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

  function handleUndo(id: string) {
    setAcceptedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  // All resolved: everything is either dismissed or accepted
  const allResolved = activeRules.length === 0 ||
    activeRules.every((r) => acceptedIds.has(r.id))

  if (rules.length > 0 && dismissedIds.size === rules.length) {
    return (
      <div className="space-y-6">
        <RuleSummaryBar rules={[]} />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-positive mb-4" />
          <h3 className="text-lg font-semibold">All rules reviewed</h3>
          <p className="text-muted-foreground">
            {acceptedIds.size} accepted &middot; {dismissedIds.size} dismissed
          </p>
        </div>
      </div>
    )
  }

  if (allResolved && activeRules.length > 0) {
    return (
      <div className="space-y-6">
        <RuleSummaryBar rules={activeRules.filter((r) => !acceptedIds.has(r.id))} />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-positive mb-4" />
          <h3 className="text-lg font-semibold">All rules reviewed</h3>
          <p className="text-muted-foreground">
            {acceptedIds.size} accepted &middot; {dismissedIds.size} dismissed
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RuleSummaryBar rules={activeRules.filter((r) => !acceptedIds.has(r.id))} />

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
              placeholder="Search rules..."
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
        </div>
      </div>

      {filteredRules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">No rules match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              status={acceptedIds.has(rule.id) ? "accepted" : "pending"}
              onAccept={handleAccept}
              onDismiss={handleDismiss}
              onUndo={handleUndo}
            />
          ))}
        </div>
      )}
    </div>
  )
}
