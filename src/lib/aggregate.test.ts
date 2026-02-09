import { describe, expect, it } from "vitest"
import { aggregateMonthly } from "./aggregate"

describe("aggregateMonthly", () => {
  it("aggregates daily data into monthly averages sorted descending", () => {
    const data = [
      { date: "2025-01-15", value: 100 },
      { date: "2025-01-20", value: 200 },
      { date: "2025-02-10", value: 300 },
    ]

    const result = aggregateMonthly(data)

    expect(result).toHaveLength(2)
    expect(result[0].month).toBe("Feb 2025")
    expect(result[0].value).toBe(300)
    expect(result[1].month).toBe("Jan 2025")
    expect(result[1].value).toBe(150)
  })

  it("returns empty array for empty input", () => {
    expect(aggregateMonthly([])).toEqual([])
  })

  it("does not mutate the input array", () => {
    const data = [
      { date: "2025-01-15", value: 100 },
      { date: "2025-02-10", value: 200 },
    ]
    const copy = [...data]

    aggregateMonthly(data)

    expect(data).toEqual(copy)
  })
})
