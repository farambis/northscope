import type {
  KpiMetadata,
  TimeRange,
  TimeSeriesDataPoint,
} from "@/types/trends"

export const kpiMetadata: KpiMetadata[] = [
  { id: "mrr", label: "MRR", color: "var(--chart-1)" },
  { id: "revenue", label: "Revenue", color: "var(--chart-2)" },
  { id: "burnRate", label: "Burn Rate", color: "var(--chart-3)" },
  { id: "cashFlow", label: "Cash Flow", color: "var(--chart-4)" },
  { id: "profitMargin", label: "Profit Margin", color: "var(--chart-5)" },
]

export const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
]

function getDaysForRange(range: TimeRange): number {
  switch (range) {
    case "7d":
      return 7
    case "30d":
      return 30
    case "90d":
      return 90
    case "1y":
      return 365
  }
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function generateMockData(range: TimeRange): TimeSeriesDataPoint[] {
  const days = getDaysForRange(range)
  const data: TimeSeriesDataPoint[] = []
  const today = new Date()

  let mrr = 42000
  let revenue = 110000
  let burnRate = 19500
  let cashFlow = 34000
  let profitMargin = 31

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const seed =
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    let callCount = 0
    const rand = () => seededRandom(seed + (callCount++) * 13)

    mrr += (rand() - 0.45) * 800
    revenue += (rand() - 0.4) * 3000
    burnRate += (rand() - 0.52) * 500
    cashFlow += (rand() - 0.42) * 2000
    profitMargin += (rand() - 0.48) * 0.5

    mrr = Math.max(35000, Math.min(55000, mrr))
    revenue = Math.max(90000, Math.min(140000, revenue))
    burnRate = Math.max(14000, Math.min(24000, burnRate))
    cashFlow = Math.max(25000, Math.min(55000, cashFlow))
    profitMargin = Math.max(25, Math.min(40, profitMargin))

    data.push({
      date: date.toISOString().split("T")[0],
      mrr: Math.round(mrr),
      revenue: Math.round(revenue),
      burnRate: Math.round(burnRate),
      cashFlow: Math.round(cashFlow),
      profitMargin: Math.round(profitMargin * 10) / 10,
    })
  }

  return data
}
