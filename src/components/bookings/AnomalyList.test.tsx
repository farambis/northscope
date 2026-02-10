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

  it("removes a card when marked as intended and shows correct toast", async () => {
    const user = userEvent.setup()
    const { toast } = await import("sonner")
    render(<AnomalyList anomalies={mockAnomalies} />)

    const markIntendedButtons = screen.getAllByRole("button", { name: /mark as intended/i })
    await user.click(markIntendedButtons[0])

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
    expect(screen.getByText("TYPO")).toBeInTheDocument()
    expect(screen.queryByText("UNUSUAL")).not.toBeInTheDocument()
    expect(toast).toHaveBeenCalledWith("Marked as intended", expect.objectContaining({
      action: expect.any(Object)
    }))
  })

  it("shows counts in all-reviewed state when items are dismissed and marked as intended", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    // Dismiss one card
    const dismissButton = screen.getAllByRole("button", { name: /dismiss/i })[0]
    await user.click(dismissButton)

    // Mark two as intended
    const markIntendedButtons = screen.getAllByRole("button", { name: /mark as intended/i })
    await user.click(markIntendedButtons[0])

    const markIntendedButtons2 = screen.getAllByRole("button", { name: /mark as intended/i })
    await user.click(markIntendedButtons2[0])

    expect(screen.getByText(/all reviewed/i)).toBeInTheDocument()
    expect(screen.getByText(/1 dismissed/i)).toBeInTheDocument()
    expect(screen.getByText(/2 marked as intended/i)).toBeInTheDocument()
  })
})

describe("AnomalyList - table view", () => {
  it("renders view toggle", () => {
    render(<AnomalyList anomalies={mockAnomalies} />)

    expect(screen.getByRole("radio", { name: /cards view/i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /table view/i })).toBeInTheDocument()
  })

  it("switches to table view when table toggle is clicked", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))

    expect(screen.getByRole("columnheader", { name: "Type" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Text" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Amount" })).toBeInTheDocument()
  })

  it("renders table rows for each anomaly in table view", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
    expect(screen.getByText("TYPO")).toBeInTheDocument()
    expect(screen.getByText("UNUSUAL")).toBeInTheDocument()
  })

  it("shows bulk action bar when items are selected in table view", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))

    // Select the first row checkbox
    const checkboxes = screen.getAllByRole("checkbox")
    // First checkbox is "select all", rest are row checkboxes
    await user.click(checkboxes[1])

    expect(screen.getByText("1 selected")).toBeInTheDocument()
  })

  it("select all selects all visible rows", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))

    await user.click(screen.getByRole("checkbox", { name: /select all/i }))

    expect(screen.getByText("3 selected")).toBeInTheDocument()
  })

  it("bulk dismiss removes all selected items and shows toast", async () => {
    const user = userEvent.setup()
    const { toast } = await import("sonner")
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))
    await user.click(screen.getByRole("checkbox", { name: /select all/i }))
    await user.click(screen.getByRole("button", { name: /^dismiss$/i }))

    expect(screen.getByText(/all reviewed/i)).toBeInTheDocument()
    expect(toast).toHaveBeenCalledWith("3 anomalies dismissed", expect.objectContaining({
      action: expect.any(Object),
    }))
  })

  it("bulk mark as intended removes all selected and shows toast", async () => {
    const user = userEvent.setup()
    const { toast } = await import("sonner")
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))
    await user.click(screen.getByRole("checkbox", { name: /select all/i }))
    await user.click(screen.getByRole("button", { name: /^mark as intended$/i }))

    expect(screen.getByText(/all reviewed/i)).toBeInTheDocument()
    expect(toast).toHaveBeenCalledWith("3 anomalies marked as intended", expect.objectContaining({
      action: expect.any(Object),
    }))
  })

  it("switching back to cards clears selection", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))
    await user.click(screen.getByRole("checkbox", { name: /select all/i }))
    expect(screen.getByText("3 selected")).toBeInTheDocument()

    await user.click(screen.getByRole("radio", { name: /cards view/i }))
    await user.click(screen.getByRole("radio", { name: /table view/i }))

    expect(screen.queryByText(/selected/)).not.toBeInTheDocument()
  })

  it("filters work in table view", async () => {
    const user = userEvent.setup()
    render(<AnomalyList anomalies={mockAnomalies} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))
    await user.click(screen.getByRole("tab", { name: /similar/i }))

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
    expect(screen.queryByText("TYPO")).not.toBeInTheDocument()
    expect(screen.queryByText("UNUSUAL")).not.toBeInTheDocument()
  })
})
