"use client"

import { useState } from "react"
import { CheckCircle2, ChevronDown, ChevronUp, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { badgeStyles } from "@/lib/badge-styles"
import type { RuleSuggestion, RuleType } from "@/types/rule"

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
import { RuleConfidenceBadge } from "./RuleConfidenceBadge"

const typeBadgeConfig: Record<RuleType, { label: string; style: string }> = {
  "account-mapping": { label: "ACCOUNT MAPPING", style: badgeStyles.positive },
  "tax-code": { label: "TAX CODE", style: badgeStyles.warning },
  recurring: { label: "RECURRING", style: badgeStyles.negative },
}

interface RuleCardProps {
  rule: RuleSuggestion
  status: "pending" | "accepted"
  onAccept: (id: string) => void
  onDismiss: (id: string) => void
  onUndo: (id: string) => void
}

export function RuleCard({ rule, status, onAccept, onDismiss, onUndo }: RuleCardProps) {
  const [showExceptions, setShowExceptions] = useState(false)

  if (status === "accepted") {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 pt-0">
          <CheckCircle2 className="h-5 w-5 text-positive shrink-0" />
          <span className="flex-1 text-sm">{rule.statement}</span>
          <Button variant="ghost" size="sm" onClick={() => onUndo(rule.id)}>
            Undo
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { label, style } = typeBadgeConfig[rule.type]
  const hasExceptions = rule.exceptions && rule.exceptions.length > 0

  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 text-muted-foreground/50 hover:text-foreground transition-colors"
        onClick={() => onDismiss(rule.id)}
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
      <CardHeader className="flex-row items-center space-y-0 pr-10">
        <div className="flex items-center gap-2">
          <Badge className={style}>{label}</Badge>
          <RuleConfidenceBadge confidence={rule.confidence} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-medium">{rule.statement}</p>
        <p className="text-sm text-muted-foreground">{rule.evidence}</p>
        {hasExceptions && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-0 text-muted-foreground"
              onClick={() => setShowExceptions(!showExceptions)}
            >
              {showExceptions ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Exceptions ({rule.exceptions!.length})
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Exceptions ({rule.exceptions!.length})
                </>
              )}
            </Button>
            {showExceptions && (
              <ul className="mt-2 space-y-1">
                {rule.exceptions!.map((ex) => (
                  <li
                    key={ex.id}
                    className="text-sm text-muted-foreground rounded bg-muted px-3 py-2"
                  >
                    {ex.description}
                    <span className="ml-2 text-xs">
                      {formatAmount(ex.amount)} · {formatDate(ex.date)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => onAccept(rule.id)}>
            Accept as Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
