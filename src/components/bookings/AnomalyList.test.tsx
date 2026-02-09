import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { AnomalyList } from "./AnomalyList"
import type { AnomalyGroup } from "@/types/anomaly"

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}))

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
    matchedPatternCount: 24,
    entries: [
      { id: "e-601", text: "Monthly rent paymnet", amount: 3200.0, date: "2025-02-01" },
    ],
  },
  {
    id: "unusual-1",
    type: "unusual",
    confidence: 97,
    reasons: ["Contains test data pattern"],
    entries: [
      { id: "e-1001", text: "asdf test 123", amount: 1.0, date: "2025-02-05" },
    ],
  },
]

describe("AnomalyList", () => {
  it("renders all anomaly cards by default", () => {
    render(<AnomalyList anomalies={mockAnomalies} />)

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
    expect(screen.getByText("TYPO")).toBeInTheDocument()
    expect(screen.getByText("UNUSUAL")).toBeInTheDocument()
  })

  it("filters to only similar when Similar tab is clicked", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("tab", { name: /similar/i }))

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
    expect(screen.queryByText("TYPO")).not.toBeInTheDocument()
    expect(screen.queryByText("UNUSUAL")).not.toBeInTheDocument()
  })

  it("filters to only typos when Typos tab is clicked", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("tab", { name: /typos/i }))

    expect(screen.queryByText("SIMILAR")).not.toBeInTheDocument()
    expect(screen.getByText("TYPO")).toBeInTheDocument()
    expect(screen.queryByText("UNUSUAL")).not.toBeInTheDocument()
  })

  it("filters to only unusual when Unusual tab is clicked", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("tab", { name: /unusual/i }))

    expect(screen.queryByText("SIMILAR")).not.toBeInTheDocument()
    expect(screen.queryByText("TYPO")).not.toBeInTheDocument()
    expect(screen.getByText("UNUSUAL")).toBeInTheDocument()
  })

  it("filters by search query", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.type(searchInput, "rent")

    expect(screen.queryByText("SIMILAR")).not.toBeInTheDocument()
    expect(screen.getByText("TYPO")).toBeInTheDocument()
    expect(screen.queryByText("UNUSUAL")).not.toBeInTheDocument()
  })

  it("removes a card when dismissed", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    // Cards sorted by confidence desc: unusual(97), typo(95), similar(92)
    const dismissButtons = screen.getAllByRole("button", { name: /dismiss/i })
    await user.click(dismissButtons[0])

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
    expect(screen.getByText("TYPO")).toBeInTheDocument()
    expect(screen.queryByText("UNUSUAL")).not.toBeInTheDocument()
  })

  it("shows empty state when search matches nothing", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.type(searchInput, "zzzznoexist")

    expect(screen.getByText(/no anomalies/i)).toBeInTheDocument()
  })

  it("shows all-reviewed state when all items are dismissed", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    // Dismiss cards one at a time, re-querying after each removal
    for (let i = 0; i < 3; i++) {
      const btn = screen.getAllByRole("button", { name: /dismiss/i })[0]
      await user.click(btn)
    }

    expect(screen.getByText(/all reviewed/i)).toBeInTheDocument()
  })

  it("renders the summary bar", () => {
    render(<AnomalyList anomalies={mockAnomalies} />)

    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()
  })
})
