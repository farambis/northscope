"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatKpiValue } from "@/lib/format"
import { generateMockData, timeRangeOptions } from "@/data/trends"
import type { KpiId, TimeRange } from "@/types/trends"

function CustomTooltip({
  active,
  payload,
  label,
  kpiId,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  kpiId: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="mb-1 text-sm font-medium">{label}</p>
      <p className="text-sm font-semibold">
        {formatKpiValue(kpiId, payload[0].value)}
      </p>
    </div>
  )
}

export function KpiDetailChart({
  kpiId,
  color,
}: {
  kpiId: KpiId
  color: string
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const rawData = generateMockData(timeRange)

  const data = rawData.map((point) => ({
    date: point.date,
    value: point[kpiId],
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trend</CardTitle>
          <Tabs
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as TimeRange)}
          >
            <TabsList>
              {timeRangeOptions.map((opt) => (
                <TabsTrigger key={opt.value} value={opt.value}>
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                formatKpiValue(kpiId, value)
              }
            />
            <Tooltip content={<CustomTooltip kpiId={kpiId} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
