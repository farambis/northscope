import { Card, CardContent } from "@/components/ui/card"
import type { AnomalyGroup } from "@/types/anomaly"

interface AnomalySummaryBarProps {
  anomalies: AnomalyGroup[]
}

export function AnomalySummaryBar({ anomalies }: AnomalySummaryBarProps) {
  const total = anomalies.length
  const similar = anomalies.filter((a) => a.type === "similar").length
  const typos = anomalies.filter((a) => a.type === "typo").length
  const unusual = anomalies.filter((a) => a.type === "unusual").length

  const items = [
    { label: "Total", count: total, testId: "total-count" },
    { label: "Similar", count: similar, testId: "similar-count" },
    { label: "Typos", count: typos, testId: "typo-count" },
    { label: "Unusual", count: unusual, testId: "unusual-count" },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold" data-testid={item.testId}>
              {item.count}
            </p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
