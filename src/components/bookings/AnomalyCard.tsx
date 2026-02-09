"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { badgeStyles } from "@/lib/badge-styles"
import type { AnomalyGroup } from "@/types/anomaly"
import { ConfidenceBadge } from "./ConfidenceBadge"
import { InlineDiff } from "./InlineDiff"

interface AnomalyCardProps {
  group: AnomalyGroup
  onDismiss: (id: string) => void
  onAction: (id: string) => void
  onMarkIntended: (id: string) => void
}

const typeBadgeConfig = {
  similar: { label: "SIMILAR", style: badgeStyles.warning },
  typo: { label: "TYPO", style: badgeStyles.negative },
  unusual: { label: "UNUSUAL", style: badgeStyles.negative },
} as const

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function SimilarContent({ group }: { group: AnomalyGroup }) {
  return (
    <div className="space-y-2">
      {group.suggestion && (
        <p className="text-sm text-muted-foreground">
          Suggested: <span className="font-medium text-foreground">{group.suggestion}</span>
          {" "}&middot; {group.entries.length} occurrences
        </p>
      )}
      <div className="space-y-1.5">
        {group.entries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between text-sm">
            <span className="font-mono">
              {group.suggestion ? (
                <InlineDiff source={entry.text} target={group.suggestion} />
              ) : (
                entry.text
              )}
            </span>
            <span className="text-muted-foreground shrink-0 ml-4">
              {formatAmount(entry.amount)} &middot; {formatDate(entry.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TypoContent({ group }: { group: AnomalyGroup }) {
  const entry = group.entries[0]

  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-negative">&times;</span>
          <span className="font-mono">
            {group.matchedPattern ? (
              <InlineDiff source={entry.text} target={group.matchedPattern} />
            ) : (
              entry.text
            )}
          </span>
        </div>
        {group.matchedPattern && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-positive">&check;</span>
            <span className="font-mono">{group.matchedPattern}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {formatAmount(entry.amount)} &middot; {formatDate(entry.date)}
        </span>
        {group.matchedPattern && group.matchedPatternCount && (
          <span>{group.matchedPatternCount} occurrences of correct version</span>
        )}
      </div>
      {group.diffDetails && (
        <p className="text-xs text-muted-foreground">{group.diffDetails}</p>
      )}
    </div>
  )
}

function UnusualContent({ group }: { group: AnomalyGroup }) {
  const entry = group.entries[0]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono font-medium">{entry.text}</span>
        <span className="text-muted-foreground shrink-0 ml-4">
          {formatAmount(entry.amount)} &middot; {formatDate(entry.date)}
        </span>
      </div>
      {group.reasons && group.reasons.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {group.reasons.map((reason) => (
            <Badge key={reason} variant="outline" className="text-xs">
              {reason}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

const actionLabels = {
  similar: "Review & Fix",
  typo: "Apply Correction",
  unusual: "Edit Booking",
} as const

export function AnomalyCard({ group, onDismiss, onAction, onMarkIntended }: AnomalyCardProps) {
  const { label, style } = typeBadgeConfig[group.type]

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Badge className={style}>{label}</Badge>
          <ConfidenceBadge confidence={group.confidence} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground/50 hover:text-foreground transition-colors"
          onClick={() => onDismiss(group.id)}
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {group.type === "similar" && <SimilarContent group={group} />}
        {group.type === "typo" && <TypoContent group={group} />}
        {group.type === "unusual" && <UnusualContent group={group} />}
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => onAction(group.id)}>
            {actionLabels[group.type]}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkIntended(group.id)}
          >
            Mark as Intended
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
