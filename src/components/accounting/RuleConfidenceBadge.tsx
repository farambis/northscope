import { Badge } from "@/components/ui/badge"
import { badgeStyles } from "@/lib/badge-styles"
import type { BadgeVariant } from "@/types/kpi"

interface RuleConfidenceBadgeProps {
  confidence: number
}

// Inverted from anomaly badge: high confidence = positive (green)
function getConfidenceLevel(confidence: number): {
  label: string
  variant: BadgeVariant
} {
  if (confidence >= 90) return { label: "HIGH", variant: "positive" }
  if (confidence >= 70) return { label: "MEDIUM", variant: "warning" }
  return { label: "LOW", variant: "negative" }
}

export function RuleConfidenceBadge({
  confidence,
}: RuleConfidenceBadgeProps) {
  const { label, variant } = getConfidenceLevel(confidence)

  return <Badge className={badgeStyles[variant]}>{label}</Badge>
}
