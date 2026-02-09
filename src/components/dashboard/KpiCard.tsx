import Link from "next/link"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { badgeStyles } from "@/lib/badge-styles"
import { cn } from "@/lib/utils"
import type { Kpi } from "@/types/kpi"

type KpiCardProps = Kpi & { className?: string }

export function KpiCard({
  id,
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
    <Link href={`/kpi/${id}`} className="group">
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
          <div className="flex items-center justify-between">
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
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="text-sm text-muted-foreground">{context}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
