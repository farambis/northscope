import { TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BadgeVariant, Kpi } from "@/types/kpi"

const badgeStyles: Record<BadgeVariant, string> = {
  positive: "bg-positive/10 text-positive border-transparent",
  warning: "bg-warning/10 text-warning border-transparent",
  negative: "bg-negative/10 text-negative border-transparent",
}

type KpiCardProps = Kpi & { className?: string }

export function KpiCard({
  label,
  value,
  change,
  context,
  badge,
  className,
}: KpiCardProps) {
  const isPositive = change.isPositive
  const absValue = Math.abs(change.value)

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
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
      <CardContent className="space-y-2">
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
        <p className="text-sm text-muted-foreground">{context}</p>
      </CardContent>
    </Card>
  )
}
