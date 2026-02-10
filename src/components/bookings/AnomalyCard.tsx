"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { AnomalyGroup } from "@/types/anomaly"
import { ConfidenceBadge } from "./ConfidenceBadge"
import {
  typeBadgeConfig,
  actionLabels,
  SimilarContent,
  TypoContent,
  UnusualContent,
} from "./AnomalyContent"

interface AnomalyCardProps {
  group: AnomalyGroup
  onDismiss: (id: string) => void
  onAction: (id: string) => void
  onMarkIntended: (id: string) => void
}

export function AnomalyCard({ group, onDismiss, onAction, onMarkIntended }: AnomalyCardProps) {
  const { label, style } = typeBadgeConfig[group.type]

  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 text-muted-foreground/50 hover:text-foreground transition-colors"
        onClick={() => onDismiss(group.id)}
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
      <CardHeader className="flex-row items-center space-y-0 pr-10">
        <div className="flex items-center gap-2">
          <Badge className={style}>{label}</Badge>
          <ConfidenceBadge confidence={group.confidence} />
        </div>
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
            variant="outline"
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
