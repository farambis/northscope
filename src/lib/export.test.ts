import { describe, expect, it } from "vitest"
import type { Kpi } from "@/types/kpi"
import type { ExportConfig } from "@/types/export"
import {
  formatReportDate,
  defaultTitle,
  generateMarkdown,
  generateJson,
  generateExport,
} from "./export"

const testKpis: Kpi[] = [
  {
    id: "mrr",
    label: "Monthly Recurring Revenue",
    value: "$47.2k",
    change: { value: 12.3, isPositive: true },
    context: "vs. $42.1k last month",
    badge: { text: "GROWING", variant: "positive" },
  },
  {
    id: "revenue",
    label: "Revenue",
    value: "$124.5k",
    change: { value: 8.7, isPositive: true },
    context: "vs. $114.2k last month",
    badge: { text: "STRONG", variant: "positive" },
  },
  {
    id: "burnRate",
    label: "Burn Rate",
    value: "$18.3k",
    change: { value: -5.2, isPositive: true },
    context: "vs. $19.3k last month",
  },
]

const baseConfig: ExportConfig = {
  title: "Financial Overview",
  subtitle: "Test subtitle",
  format: "markdown",
  selectedKpiIds: new Set(["mrr", "revenue", "burnRate"]),
}

describe("formatReportDate", () => {
  it("returns a human-readable date string", () => {
    const result = formatReportDate()
    expect(result).toMatch(/\w+ \d{1,2}, \d{4}/)
  })
})

describe("defaultTitle", () => {
  it("contains Financial Overview and an em dash", () => {
    const result = defaultTitle()
    expect(result).toContain("Financial Overview")
    expect(result).toContain("\u2014")
  })
})

describe("generateMarkdown", () => {
  it("includes the title as a heading", () => {
    const md = generateMarkdown(baseConfig, testKpis)
    expect(md).toContain("# Financial Overview")
  })

  it("includes the subtitle", () => {
    const md = generateMarkdown(baseConfig, testKpis)
    expect(md).toContain("Test subtitle")
  })

  it("includes KPI label, value, and context", () => {
    const md = generateMarkdown(baseConfig, testKpis)
    expect(md).toContain("### Monthly Recurring Revenue")
    expect(md).toContain("$47.2k")
    expect(md).toContain("vs. $42.1k last month")
  })

  it("shows up arrow for positive change", () => {
    const md = generateMarkdown(baseConfig, testKpis)
    expect(md).toMatch(/↑ 12\.3%/)
  })

  it("shows down arrow for negative change value", () => {
    const md = generateMarkdown(baseConfig, testKpis)
    expect(md).toMatch(/↓ 5\.2%/)
  })

  it("includes badge text when present", () => {
    const md = generateMarkdown(baseConfig, testKpis)
    expect(md).toContain("GROWING")
  })

  it("shows N/A for status when no badge", () => {
    const md = generateMarkdown(baseConfig, testKpis)
    expect(md).toContain("N/A")
  })

  it("includes footer with Northscope", () => {
    const md = generateMarkdown(baseConfig, testKpis)
    expect(md).toContain("Northscope Dashboard")
  })

  it("omits subtitle line when subtitle is empty", () => {
    const config = { ...baseConfig, subtitle: "" }
    const md = generateMarkdown(config, testKpis)
    expect(md).not.toContain("Test subtitle")
    const lines = md.split("\n")
    const dateIndex = lines.findIndex((l) => l.startsWith("**"))
    expect(lines[dateIndex + 1]).toBe("")
    expect(lines[dateIndex + 2]).toBe("---")
  })
})

describe("generateJson", () => {
  it("returns valid JSON", () => {
    const json = generateJson(baseConfig, testKpis)
    expect(() => JSON.parse(json)).not.toThrow()
  })

  it("includes report metadata", () => {
    const parsed = JSON.parse(generateJson(baseConfig, testKpis))
    expect(parsed.report.title).toBe("Financial Overview")
    expect(parsed.report.subtitle).toBe("Test subtitle")
    expect(parsed.report.date).toBeDefined()
    expect(parsed.report.generatedAt).toBeDefined()
  })

  it("includes KPI data", () => {
    const parsed = JSON.parse(generateJson(baseConfig, testKpis))
    expect(parsed.kpis).toHaveLength(3)
    expect(parsed.kpis[0].label).toBe("Monthly Recurring Revenue")
  })

  it("includes source metadata", () => {
    const parsed = JSON.parse(generateJson(baseConfig, testKpis))
    expect(parsed.metadata.source).toBe("Northscope Dashboard")
  })
})

describe("generateExport", () => {
  it("returns .md filename for markdown format", () => {
    const result = generateExport(baseConfig, testKpis)
    expect(result.filename).toMatch(/\.md$/)
    expect(result.mimeType).toBe("text/markdown")
  })

  it("returns .json filename for json format", () => {
    const config = { ...baseConfig, format: "json" as const }
    const result = generateExport(config, testKpis)
    expect(result.filename).toMatch(/\.json$/)
    expect(result.mimeType).toBe("application/json")
  })

  it("returns .md for pdf format (Phase 1 fallback)", () => {
    const config = { ...baseConfig, format: "pdf" as const }
    const result = generateExport(config, testKpis)
    expect(result.filename).toMatch(/\.md$/)
    expect(result.mimeType).toBe("text/markdown")
  })

  it("returns .md for pptx format (Phase 1 fallback)", () => {
    const config = { ...baseConfig, format: "pptx" as const }
    const result = generateExport(config, testKpis)
    expect(result.filename).toMatch(/\.md$/)
    expect(result.mimeType).toBe("text/markdown")
  })

  it("filters KPIs by selectedKpiIds", () => {
    const config = {
      ...baseConfig,
      format: "json" as const,
      selectedKpiIds: new Set(["mrr"]),
    }
    const result = generateExport(config, testKpis)
    const parsed = JSON.parse(result.content)
    expect(parsed.kpis).toHaveLength(1)
    expect(parsed.kpis[0].id).toBe("mrr")
  })
})
