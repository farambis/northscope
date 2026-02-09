const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export interface MonthlyRow {
  month: string
  value: number
}

export function aggregateMonthly(
  data: { date: string; value: number }[],
): MonthlyRow[] {
  const grouped = new Map<string, number[]>()

  for (const point of data) {
    const date = new Date(point.date)
    const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
    const values = grouped.get(key) ?? []
    values.push(point.value)
    grouped.set(key, values)
  }

  const rows: MonthlyRow[] = []
  for (const [month, values] of grouped) {
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    rows.push({ month, value: avg })
  }

  // Data arrives chronologically, reverse to show newest month first
  return rows.toReversed()
}
