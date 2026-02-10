import { Badge } from "@/components/ui/badge"
import { badgeStyles } from "@/lib/badge-styles"
import { formatAmount, formatDate } from "@/lib/anomaly-format"
import type { AnomalyGroup } from "@/types/anomaly"
import { InlineDiff } from "./InlineDiff"

export const typeBadgeConfig = {
  similar: { label: "SIMILAR", style: badgeStyles.warning },
  typo: { label: "TYPO", style: badgeStyles.negative },
  unusual: { label: "UNUSUAL", style: badgeStyles.negative },
} as const

export const actionLabels = {
  similar: "Review & Fix",
  typo: "Apply Correction",
  unusual: "Edit Booking",
} as const

export function SimilarContent({ group }: { group: AnomalyGroup }) {
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

export function TypoContent({ group }: { group: AnomalyGroup }) {
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

export function UnusualContent({ group }: { group: AnomalyGroup }) {
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
