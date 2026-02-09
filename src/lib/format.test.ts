import { describe, expect, it } from "vitest"
import { formatDollar, formatKpiValue } from "./format"

describe("formatDollar", () => {
  it("formats values >= 1000 with k suffix", () => {
    expect(formatDollar(42000)).toBe("$42.0k")
    expect(formatDollar(1500)).toBe("$1.5k")
  })

  it("formats values < 1000 without suffix", () => {
    expect(formatDollar(500)).toBe("$500")
    expect(formatDollar(0)).toBe("$0")
  })
})

describe("formatKpiValue", () => {
  it("formats profitMargin as percentage", () => {
    expect(formatKpiValue("profitMargin", 34.2)).toBe("34.2%")
  })

  it("formats other KPIs as dollars", () => {
    expect(formatKpiValue("mrr", 42000)).toBe("$42.0k")
  })
})
