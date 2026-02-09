import type { TimeRange } from "@/types/trends"

export interface ForecastPoint {
  date: string
  forecast: number
  upper: number
  lower: number
}

export function getForecastDays(range: TimeRange): number {
  switch (range) {
    case "7d":
      return 2
    case "30d":
      return 10
    case "90d":
      return 30
    case "1y":
      return 90
  }
}

export function computeForecast(
  data: { date: string; value: number }[],
  forecastDays: number,
  windowSize = 7,
): ForecastPoint[] {
  if (data.length === 0 || forecastDays <= 0) return []

  const effectiveWindow = Math.min(windowSize, data.length)
  const window = data.slice(-effectiveWindow).map((d) => d.value)

  const sma = window.reduce((a, b) => a + b, 0) / window.length

  // Daily trend: average difference between consecutive points in window
  let trendSum = 0
  for (let i = 1; i < window.length; i++) {
    trendSum += window[i] - window[i - 1]
  }
  const dailyTrend = window.length > 1 ? trendSum / (window.length - 1) : 0

  // Standard deviation for confidence band
  const variance =
    window.reduce((sum, v) => sum + (v - sma) ** 2, 0) / window.length
  const stddev = Math.sqrt(variance)

  const lastDate = new Date(data[data.length - 1].date)
  const result: ForecastPoint[] = []

  for (let i = 1; i <= forecastDays; i++) {
    const date = new Date(lastDate)
    date.setDate(date.getDate() + i)

    const forecast = sma + dailyTrend * i

    result.push({
      date: date.toISOString().split("T")[0],
      forecast: Math.round(forecast * 10) / 10,
      upper: Math.round((forecast + stddev) * 10) / 10,
      lower: Math.round((forecast - stddev) * 10) / 10,
    })
  }

  return result
}
