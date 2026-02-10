import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { AnomalyTable } from "./AnomalyTable"
import type { AnomalyGroup, Tag } from "@/types/anomaly"

const mockAnomalies: AnomalyGroup[] = [
  {
    id: "sim-1",
    type: "similar",
    confidence: 92,
    suggestion: "Bürobedarf Amazon",
    entries: [
      { id: "e-101", text: "Bürobedarf Amazon", amount: 149.99, date: "2025-01-15" },
      { id: "e-102", text: "bürobedarf Amazon", amount: 89.5, date: "2025-01-22" },
    ],
  },
  {
    id: "typo-1",
    type: "typo",
    confidence: 95,
    matchedPattern: "Monthly rent payment",
    entries: [
      { id: "e-601", text: "Monthly rent paymnet", amount: 3200.0, date: "2025-02-01" },
    ],
  },
]

const allTags: Tag[] = [
  { id: "reviewed", label: "Reviewed", color: "blue" },
]

const defaultProps = {
  anomalies: mockAnomalies,
  selectedIds: new Set<string>(),
  onSelectChange: vi.fn(),
  onSelectAll: vi.fn(),
  onDismiss: vi.fn(),
  onAction: vi.fn(),
  onMarkIntended: vi.fn(),
  allTags,
  anomalyTags: {} as Record<string, string[]>,
}

describe("AnomalyTable", () => {
  it("renders table headers", () => {
    render(<AnomalyTable {...defaultProps} />)

    expect(screen.getByText("Type")).toBeInTheDocument()
    expect(screen.getByText("Text")).toBeInTheDocument()
    expect(screen.getByText("Amount")).toBeInTheDocument()
    expect(screen.getByText("Date")).toBeInTheDocument()
    expect(screen.getByText("Confidence")).toBeInTheDocument()
  })

  it("renders one row per anomaly", () => {
    render(<AnomalyTable {...defaultProps} />)

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
    expect(screen.getByText("TYPO")).toBeInTheDocument()
  })

  it("calls onSelectAll with true when header checkbox is clicked and none selected", async () => {
    const user = userEvent.setup()
    const onSelectAll = vi.fn()
    render(<AnomalyTable {...defaultProps} onSelectAll={onSelectAll} />)

    await user.click(screen.getByRole("checkbox", { name: /select all/i }))
    expect(onSelectAll).toHaveBeenCalledWith(true)
  })

  it("calls onSelectAll with false when header checkbox is clicked and all selected", async () => {
    const user = userEvent.setup()
    const onSelectAll = vi.fn()
    render(
      <AnomalyTable
        {...defaultProps}
        selectedIds={new Set(["sim-1", "typo-1"])}
        onSelectAll={onSelectAll}
      />,
    )

    await user.click(screen.getByRole("checkbox", { name: /select all/i }))
    expect(onSelectAll).toHaveBeenCalledWith(false)
  })

  it("shows empty state when no anomalies", () => {
    render(<AnomalyTable {...defaultProps} anomalies={[]} />)

    expect(screen.getByText(/no anomalies/i)).toBeInTheDocument()
  })

  it("resolves tags from anomalyTags record", () => {
    render(
      <AnomalyTable
        {...defaultProps}
        anomalyTags={{ "sim-1": ["reviewed"] }}
      />,
    )

    expect(screen.getByText("Reviewed")).toBeInTheDocument()
  })
})
