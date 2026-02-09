export function formatDollar(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`
  }
  return `$${value}`
}

export function formatKpiValue(kpiId: string, value: number): string {
  if (kpiId === "profitMargin") return `${value}%`
  return formatDollar(value)
}
