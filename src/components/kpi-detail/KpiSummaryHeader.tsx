import { TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { badgeStyles } from "@/lib/badge-styles"
import { cn } from "@/lib/utils"
import type { KpiBadge, KpiChange } from "@/types/kpi"

interface KpiSummaryHeaderProps {
  label: string
  value: string
  change: KpiChange
  context: string
  badge?: KpiBadge
}

export function KpiSummaryHeader({
  label,
  value,
  change,
  context,
  badge,
}: KpiSummaryHeaderProps) {
  const isPositive = change.isPositive
  const absValue = Math.abs(change.value)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {badge && (
          <Badge role="status" className={badgeStyles[badge.variant]}>
            {badge.text}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div className="space-y-2">
          <p className="text-4xl font-bold tracking-tight">{value}</p>
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-semibold",
              isPositive ? "text-positive" : "text-negative",
            )}
          >
            {isPositive ? (
              <>
                <TrendingUp className="h-4 w-4" />
                <span>↑</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4" />
                <span>↓</span>
              </>
            )}
            <span>{absValue}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{context}</p>
      </CardContent>
    </Card>
  )
}
