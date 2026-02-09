import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { KpiDetailTable } from "./KpiDetailTable"
import type { KpiId } from "@/types/trends"

const mockData = [
  { date: "2025-01-05", value: 40000 },
  { date: "2025-01-15", value: 42000 },
  { date: "2025-02-05", value: 44000 },
  { date: "2025-02-15", value: 46000 },
  { date: "2025-03-05", value: 48000 },
]

describe("KpiDetailTable", () => {
  const kpiId: KpiId = "mrr"

  it("renders table headers", () => {
    render(<KpiDetailTable kpiId={kpiId} data={mockData} />)

    expect(screen.getByText("Month")).toBeInTheDocument()
    expect(screen.getByText("Value")).toBeInTheDocument()
    expect(screen.getByText("Change")).toBeInTheDocument()
  })

  it("renders monthly rows", () => {
    render(<KpiDetailTable kpiId={kpiId} data={mockData} />)

    const rows = screen.getAllByRole("row")
    // header + 3 data rows (Jan, Feb, Mar)
    expect(rows).toHaveLength(4)
  })

  it("renders the title", () => {
    render(<KpiDetailTable kpiId={kpiId} data={mockData} />)

    expect(screen.getByText("Monthly Breakdown")).toBeInTheDocument()
  })

  it("shows dash for the oldest month with no prior data", () => {
    render(<KpiDetailTable kpiId={kpiId} data={mockData} />)

    expect(screen.getByText("—")).toBeInTheDocument()
  })
})
