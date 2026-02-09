export type KpiId = "mrr" | "revenue" | "burnRate" | "cashFlow" | "profitMargin"

export type TimeRange = "7d" | "30d" | "90d" | "1y"

export type KpiMetadata = {
  id: KpiId
  label: string
  color: string
}

export type TimeSeriesDataPoint = {
  date: string
  mrr: number
  revenue: number
  burnRate: number
  cashFlow: number
  profitMargin: number
}
