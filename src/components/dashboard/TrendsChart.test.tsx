import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TrendsChart } from "./TrendsChart"
import { kpiMetadata } from "@/data/trends"
import type { TimeSeriesDataPoint } from "@/types/trends"

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts")
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  }
})

const mockData: TimeSeriesDataPoint[] = [
  {
    date: "2025-01-01",
    mrr: 42000,
    revenue: 110000,
    burnRate: 18000,
    cashFlow: 34000,
    profitMargin: 32.5,
  },
  {
    date: "2025-01-02",
    mrr: 42500,
    revenue: 112000,
    burnRate: 17800,
    cashFlow: 35000,
    profitMargin: 33.0,
  },
]

describe("TrendsChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <TrendsChart data={mockData} kpiMetadata={kpiMetadata} />,
    )
    expect(container).toBeTruthy()
  })

  it("renders the chart container", () => {
    const { container } = render(
      <TrendsChart data={mockData} kpiMetadata={kpiMetadata} />,
    )
    expect(container.querySelector(".recharts-wrapper")).toBeInTheDocument()
  })
})
