import type { BadgeVariant } from "@/types/kpi"

export const badgeStyles: Record<BadgeVariant, string> = {
  positive: "bg-positive/10 text-positive border-transparent",
  warning: "bg-warning/10 text-warning border-transparent",
  negative: "bg-negative/10 text-negative border-transparent",
}
