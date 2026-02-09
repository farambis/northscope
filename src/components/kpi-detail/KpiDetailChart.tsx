"use client"

import { useMemo, useState } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatKpiValue } from "@/lib/format"
import { computeForecast, getForecastDays } from "@/lib/forecast"
import { generateMockData, timeRangeOptions } from "@/data/trends"
import type { KpiId, TimeRange } from "@/types/trends"

interface ChartDataPoint {
  date: string
  value: number | null
  forecast: number | null
  upper: number | null
  lower: number | null
}

function CustomTooltip({
  active,
  payload,
  label,
  kpiId,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number | null }>
  label?: string
  kpiId: string
}) {
  if (!active || !payload?.length) return null

  const valueEntry = payload.find((p) => p.dataKey === "value" && p.value != null)
  const forecastEntry = payload.find((p) => p.dataKey === "forecast" && p.value != null)
  const upperEntry = payload.find((p) => p.dataKey === "upper" && p.value != null)
  const lowerEntry = payload.find((p) => p.dataKey === "lower" && p.value != null)

  const isForecast = !valueEntry && forecastEntry

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="mb-1 text-sm font-medium">{label}</p>
      {valueEntry && (
        <p className="text-sm font-semibold">
          {formatKpiValue(kpiId, valueEntry.value!)}
        </p>
      )}
      {isForecast && forecastEntry && (
        <>
          <p className="text-sm font-semibold">
            {formatKpiValue(kpiId, forecastEntry.value!)}
            <span className="ml-1 font-normal text-muted-foreground">
              (forecast)
            </span>
          </p>
          {upperEntry && lowerEntry && (
            <p className="text-xs text-muted-foreground">
              Range: {formatKpiValue(kpiId, lowerEntry.value!)} –{" "}
              {formatKpiValue(kpiId, upperEntry.value!)}
            </p>
          )}
        </>
      )}
    </div>
  )
}

function buildChartData(
  historicalData: { date: string; value: number }[],
  showForecast: boolean,
  timeRange: TimeRange,
): ChartDataPoint[] {
  const chartData: ChartDataPoint[] = historicalData.map((point) => ({
    date: point.date,
    value: point.value,
    forecast: null,
    upper: null,
    lower: null,
  }))

  if (!showForecast || historicalData.length === 0) return chartData

  const forecastDays = getForecastDays(timeRange)
  const forecastPoints = computeForecast(historicalData, forecastDays)

  // Bridge: set forecast values on last historical point to connect the lines
  const last = chartData[chartData.length - 1]
  last.forecast = last.value
  last.upper = last.value
  last.lower = last.value

  for (const fp of forecastPoints) {
    chartData.push({
      date: fp.date,
      value: null,
      forecast: fp.forecast,
      upper: fp.upper,
      lower: fp.lower,
    })
  }

  return chartData
}

export function KpiDetailChart({
  kpiId,
  color,
}: {
  kpiId: KpiId
  color: string
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [showForecast, setShowForecast] = useState(true)

  const rawData = generateMockData(timeRange)
  const historicalData = rawData.map((point) => ({
    date: point.date,
    value: point[kpiId],
  }))

  const chartData = useMemo(
    () => buildChartData(historicalData, showForecast, timeRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeRange, showForecast, kpiId],
  )

  const todayStr = new Date().toISOString().split("T")[0]

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
          <ComposedChart
            data={chartData}
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
            {showForecast && (
              <ReferenceLine
                x={todayStr}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            {showForecast && (
              <>
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="none"
                  fill={color}
                  fillOpacity={0}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="none"
                  fill={color}
                  fillOpacity={0.1}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  strokeOpacity={0.7}
                  dot={false}
                  connectNulls={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showForecast}
            onChange={(e) => setShowForecast(e.target.checked)}
            className="accent-primary"
          />
          Show Forecast
        </label>
      </CardContent>
    </Card>
  )
}
