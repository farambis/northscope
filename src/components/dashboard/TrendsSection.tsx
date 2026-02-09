"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendsChart } from "./TrendsChart"
import { generateMockData, kpiMetadata, timeRangeOptions } from "@/data/trends"
import type { TimeRange } from "@/types/trends"

export function TrendsSection() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const data = useMemo(() => generateMockData(timeRange), [timeRange])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trends</CardTitle>
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
        <TrendsChart data={data} kpiMetadata={kpiMetadata} />
      </CardContent>
    </Card>
  )
}
