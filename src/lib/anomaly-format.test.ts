import { describe, expect, it } from "vitest"
import { formatAmount, formatDate } from "./anomaly-format"

describe("formatAmount", () => {
  it("formats integers with two decimal places", () => {
    expect(formatAmount(100)).toBe("100.00")
  })

  it("formats decimals with two decimal places", () => {
    expect(formatAmount(149.99)).toBe("149.99")
  })

  it("formats large numbers with thousand separators", () => {
    expect(formatAmount(3200)).toBe("3,200.00")
  })

  it("rounds to two decimal places", () => {
    expect(formatAmount(1.005)).toBe("1.01")
  })
})

describe("formatDate", () => {
  it("formats ISO date string", () => {
    expect(formatDate("2025-01-15")).toBe("Jan 15, 2025")
  })

  it("formats another date", () => {
    expect(formatDate("2025-02-01")).toBe("Feb 1, 2025")
  })
})
