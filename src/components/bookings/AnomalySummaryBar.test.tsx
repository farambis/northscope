import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AnomalySummaryBar } from "./AnomalySummaryBar"
import type { AnomalyGroup } from "@/types/anomaly"

const mockAnomalies: AnomalyGroup[] = [
  {
    id: "sim-1",
    type: "similar",
    confidence: 90,
    entries: [{ id: "e-1", text: "a", amount: 100, date: "2025-01-01" }],
  },
  {
    id: "sim-2",
    type: "similar",
    confidence: 80,
    entries: [{ id: "e-2", text: "b", amount: 200, date: "2025-01-02" }],
  },
  {
    id: "typo-1",
    type: "typo",
    confidence: 95,
    entries: [{ id: "e-3", text: "c", amount: 300, date: "2025-01-03" }],
  },
  {
    id: "unusual-1",
    type: "unusual",
    confidence: 85,
    entries: [{ id: "e-4", text: "d", amount: 400, date: "2025-01-04" }],
  },
]

describe("AnomalySummaryBar", () => {
  it("shows the total count", () => {
    render(<AnomalySummaryBar anomalies={mockAnomalies} />)

    expect(screen.getByText("4")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()
  })

  it("shows the correct similar count", () => {
    render(<AnomalySummaryBar anomalies={mockAnomalies} />)

    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("Similar")).toBeInTheDocument()
  })

  it("shows the correct typo count", () => {
    render(<AnomalySummaryBar anomalies={mockAnomalies} />)

    expect(screen.getByText("1", { selector: "[data-testid='typo-count']" })).toBeInTheDocument()
    expect(screen.getByText("Typos")).toBeInTheDocument()
  })

  it("shows the correct unusual count", () => {
    render(<AnomalySummaryBar anomalies={mockAnomalies} />)

    expect(screen.getByText("1", { selector: "[data-testid='unusual-count']" })).toBeInTheDocument()
    expect(screen.getByText("Unusual")).toBeInTheDocument()
  })

  it("shows zero counts when no anomalies provided", () => {
    render(<AnomalySummaryBar anomalies={[]} />)

    expect(screen.getByText("0", { selector: "[data-testid='total-count']" })).toBeInTheDocument()
  })
})
