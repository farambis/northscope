import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatKpiValue } from "@/lib/format"
import { aggregateMonthly } from "@/lib/aggregate"
import type { KpiId } from "@/types/trends"

export function KpiDetailTable({
  kpiId,
  data,
}: {
  kpiId: KpiId
  data: { date: string; value: number }[]
}) {
  const rows = aggregateMonthly(data)

  const rowsWithChange = rows.map((row, i) => {
    // rows are newest-first, so i+1 is the previous month
    const prev = rows[i + 1]
    const change = prev ? ((row.value - prev.value) / prev.value) * 100 : null
    return { ...row, change }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowsWithChange.map((row) => (
              <TableRow key={row.month}>
                <TableCell className="font-medium">{row.month}</TableCell>
                <TableCell>{formatKpiValue(kpiId, row.value)}</TableCell>
                <TableCell>
                  {row.change !== null ? (
                    <span
                      className={cn(
                        "font-semibold",
                        row.change >= 0 ? "text-positive" : "text-negative",
                      )}
                    >
                      {row.change >= 0 ? "+" : ""}
                      {row.change.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
