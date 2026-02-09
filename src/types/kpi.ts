export type BadgeVariant = "positive" | "warning" | "negative"

export interface KpiChange {
  value: number
  isPositive: boolean
}

export interface KpiBadge {
  text: string
  variant: BadgeVariant
}

export interface Kpi {
  label: string
  value: string
  change: KpiChange
  context: string
  badge?: KpiBadge
}
