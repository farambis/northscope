import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { RuleList } from "./RuleList"
import type { RuleSuggestion } from "@/types/rule"

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}))

const mockRules: RuleSuggestion[] = [
  {
    id: "acct-1",
    type: "account-mapping",
    confidence: 96,
    statement: "Office Supplies → Account 6815",
    evidence: "Matched 23 of 24 transactions",
  },
  {
    id: "tax-1",
    type: "tax-code",
    confidence: 86,
    statement: "Account 4400 → USt19",
    evidence: "Used in 86% of postings",
  },
  {
    id: "rec-1",
    type: "recurring",
    confidence: 98,
    statement: "Monthly rent → Account 6310",
    evidence: "11 consecutive monthly postings",
  },
]

describe("RuleList", () => {
  it("renders all rule cards by default", () => {
    render(<RuleList rules={mockRules} />)

    expect(screen.getByText("Office Supplies → Account 6815")).toBeInTheDocument()
    expect(screen.getByText("Account 4400 → USt19")).toBeInTheDocument()
    expect(screen.getByText("Monthly rent → Account 6310")).toBeInTheDocument()
  })

  it("filters to only account-mapping when tab clicked", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    await user.click(screen.getByRole("tab", { name: /account mapping/i }))

    expect(screen.getByText("Office Supplies → Account 6815")).toBeInTheDocument()
    expect(screen.queryByText("Account 4400 → USt19")).not.toBeInTheDocument()
    expect(screen.queryByText("Monthly rent → Account 6310")).not.toBeInTheDocument()
  })

  it("filters to only tax-code when tab clicked", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    await user.click(screen.getByRole("tab", { name: /tax code/i }))

    expect(screen.queryByText("Office Supplies → Account 6815")).not.toBeInTheDocument()
    expect(screen.getByText("Account 4400 → USt19")).toBeInTheDocument()
  })

  it("filters to only recurring when tab clicked", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    await user.click(screen.getByRole("tab", { name: /recurring/i }))

    expect(screen.getByText("Monthly rent → Account 6310")).toBeInTheDocument()
    expect(screen.queryByText("Office Supplies → Account 6815")).not.toBeInTheDocument()
  })

  it("filters by search query", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    await user.type(screen.getByPlaceholderText("Search rules..."), "rent")

    expect(screen.getByText("Monthly rent → Account 6310")).toBeInTheDocument()
    expect(screen.queryByText("Office Supplies → Account 6815")).not.toBeInTheDocument()
  })

  it("removes a card when dismissed", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    // Cards are sorted by confidence: rec-1 (98), acct-1 (96), tax-1 (86)
    const dismissButtons = screen.getAllByLabelText("Dismiss")
    await user.click(dismissButtons[0])

    expect(screen.queryByText("Monthly rent → Account 6310")).not.toBeInTheDocument()
  })

  it("collapses a card when accepted", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    const acceptButtons = screen.getAllByText("Accept as Rule")
    await user.click(acceptButtons[0])

    // Statement still visible in collapsed state
    expect(screen.getByText("Office Supplies → Account 6815")).toBeInTheDocument()
    // But Undo is now visible
    expect(screen.getByText("Undo")).toBeInTheDocument()
  })

  it("shows empty state when search matches nothing", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    await user.type(screen.getByPlaceholderText("Search rules..."), "nonexistent")

    expect(screen.getByText("No rules match your current filters.")).toBeInTheDocument()
  })

  it("shows all-resolved state when all items are dismissed", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    const dismissButtons = screen.getAllByLabelText("Dismiss")
    for (const btn of dismissButtons) {
      await user.click(btn)
    }

    expect(screen.getByText("All rules reviewed")).toBeInTheDocument()
  })

  it("renders the summary bar", () => {
    render(<RuleList rules={mockRules} />)

    expect(screen.getByTestId("total-count")).toHaveTextContent("3")
  })

  it("shows counts in all-resolved state", async () => {
    const user = userEvent.setup()
    render(<RuleList rules={mockRules} />)

    // Accept one, dismiss the rest
    const acceptButtons = screen.getAllByText("Accept as Rule")
    await user.click(acceptButtons[0])

    const dismissButtons = screen.getAllByLabelText("Dismiss")
    for (const btn of dismissButtons) {
      await user.click(btn)
    }

    expect(screen.getByText(/1 accepted/)).toBeInTheDocument()
    expect(screen.getByText(/2 dismissed/)).toBeInTheDocument()
  })
})
