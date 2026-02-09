import { describe, expect, it } from "vitest"
import { computeForecast, getForecastDays } from "./forecast"

describe("getForecastDays", () => {
  it("returns 2 for 7d range", () => {
    expect(getForecastDays("7d")).toBe(2)
  })

  it("returns 10 for 30d range", () => {
    expect(getForecastDays("30d")).toBe(10)
  })

  it("returns 30 for 90d range", () => {
    expect(getForecastDays("90d")).toBe(30)
  })

  it("returns 90 for 1y range", () => {
    expect(getForecastDays("1y")).toBe(90)
  })
})

describe("computeForecast", () => {
  const stableData = Array.from({ length: 30 }, (_, i) => ({
    date: `2025-01-${String(i + 1).padStart(2, "0")}`,
    value: 1000 + i * 10,
  }))

  it("returns the correct number of forecast days", () => {
    const result = computeForecast(stableData, 10)
    expect(result).toHaveLength(10)
  })

  it("returns empty array for empty input", () => {
    expect(computeForecast([], 10)).toEqual([])
  })

  it("returns empty array for 0 forecast days", () => {
    expect(computeForecast(stableData, 0)).toEqual([])
  })

  it("produces forecast dates continuing from the last historical date", () => {
    const result = computeForecast(stableData, 3)
    expect(result[0].date).toBe("2025-01-31")
    expect(result[1].date).toBe("2025-02-01")
    expect(result[2].date).toBe("2025-02-02")
  })

  it("produces upper > forecast > lower for each point", () => {
    const result = computeForecast(stableData, 5)
    for (const point of result) {
      expect(point.upper).toBeGreaterThanOrEqual(point.forecast)
      expect(point.forecast).toBeGreaterThanOrEqual(point.lower)
    }
  })

  it("produces forecast values near the SMA for stable trending data", () => {
    const result = computeForecast(stableData, 1)
    const lastValues = stableData.slice(-7).map((d) => d.value)
    const sma = lastValues.reduce((a, b) => a + b, 0) / lastValues.length
    // Forecast should be in the ballpark of the SMA (within 20%)
    expect(result[0].forecast).toBeGreaterThan(sma * 0.8)
    expect(result[0].forecast).toBeLessThan(sma * 1.2)
  })

  it("handles data shorter than window size gracefully", () => {
    const shortData = stableData.slice(0, 3)
    const result = computeForecast(shortData, 5)
    expect(result).toHaveLength(5)
    for (const point of result) {
      expect(point.forecast).toBeGreaterThan(0)
    }
  })
})
