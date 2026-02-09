import { Badge } from "@/components/ui/badge"
import { badgeStyles } from "@/lib/badge-styles"
import type { BadgeVariant } from "@/types/kpi"

interface ConfidenceBadgeProps {
  confidence: number
}

function getConfidenceLevel(confidence: number): {
  label: string
  variant: BadgeVariant
} {
  if (confidence >= 90) return { label: "HIGH", variant: "negative" }
  if (confidence >= 70) return { label: "MEDIUM", variant: "warning" }
  return { label: "LOW", variant: "positive" }
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const { label, variant } = getConfidenceLevel(confidence)

  return (
    <Badge className={badgeStyles[variant]}>
      {label}
    </Badge>
  )
}
