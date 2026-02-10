import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { RuleCard } from "./RuleCard"
import type { RuleSuggestion } from "@/types/rule"

const accountMappingRule: RuleSuggestion = {
  id: "acct-1",
  type: "account-mapping",
  confidence: 96,
  statement: "Office Supplies Ltd → Account 6815",
  evidence: "Matched 23 of 24 transactions",
  exceptions: [
    { id: "ex-1", description: "Booked to 6820", date: "2025-03-15", amount: 450 },
  ],
}

const taxCodeRule: RuleSuggestion = {
  id: "tax-1",
  type: "tax-code",
  confidence: 86,
  statement: "Account 4400 → Tax Code USt19",
  evidence: "Used in 86% of postings",
}

const recurringRule: RuleSuggestion = {
  id: "rec-1",
  type: "recurring",
  confidence: 98,
  statement: "Monthly rent EUR 2,400.00 → Account 6310",
  evidence: "11 consecutive monthly postings",
}

const defaultProps = {
  status: "pending" as const,
  onAccept: vi.fn(),
  onDismiss: vi.fn(),
  onUndo: vi.fn(),
}

describe("RuleCard", () => {
  it("renders account-mapping type badge", () => {
    render(<RuleCard rule={accountMappingRule} {...defaultProps} />)

    expect(screen.getByText("ACCOUNT MAPPING")).toBeInTheDocument()
  })

  it("renders tax-code type badge", () => {
    render(<RuleCard rule={taxCodeRule} {...defaultProps} />)

    expect(screen.getByText("TAX CODE")).toBeInTheDocument()
  })

  it("renders recurring type badge", () => {
    render(<RuleCard rule={recurringRule} {...defaultProps} />)

    expect(screen.getByText("RECURRING")).toBeInTheDocument()
  })

  it("renders the confidence badge", () => {
    render(<RuleCard rule={accountMappingRule} {...defaultProps} />)

    expect(screen.getByText("HIGH")).toBeInTheDocument()
  })

  it("renders the rule statement", () => {
    render(<RuleCard rule={accountMappingRule} {...defaultProps} />)

    expect(screen.getByText(accountMappingRule.statement)).toBeInTheDocument()
  })

  it("renders the evidence text", () => {
    render(<RuleCard rule={accountMappingRule} {...defaultProps} />)

    expect(screen.getByText(accountMappingRule.evidence)).toBeInTheDocument()
  })

  it("shows Show Exceptions button when exceptions exist", () => {
    render(<RuleCard rule={accountMappingRule} {...defaultProps} />)

    expect(screen.getByText(/Show Exceptions/)).toBeInTheDocument()
  })

  it("does not show Show Exceptions when no exceptions", () => {
    render(<RuleCard rule={taxCodeRule} {...defaultProps} />)

    expect(screen.queryByText(/Show Exceptions/)).not.toBeInTheDocument()
  })

  it("toggles exception list on Show Exceptions click", async () => {
    const user = userEvent.setup()
    render(<RuleCard rule={accountMappingRule} {...defaultProps} />)

    expect(screen.queryByText("Booked to 6820")).not.toBeInTheDocument()

    await user.click(screen.getByText(/Show Exceptions/))
    expect(screen.getByText("Booked to 6820")).toBeInTheDocument()

    await user.click(screen.getByText(/Hide Exceptions/))
    expect(screen.queryByText("Booked to 6820")).not.toBeInTheDocument()
  })

  it("calls onAccept when Accept as Rule is clicked", async () => {
    const onAccept = vi.fn()
    const user = userEvent.setup()
    render(<RuleCard rule={accountMappingRule} {...defaultProps} onAccept={onAccept} />)

    await user.click(screen.getByText("Accept as Rule"))
    expect(onAccept).toHaveBeenCalledWith("acct-1")
  })

  it("calls onDismiss when dismiss button is clicked", async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()
    render(<RuleCard rule={accountMappingRule} {...defaultProps} onDismiss={onDismiss} />)

    await user.click(screen.getByLabelText("Dismiss"))
    expect(onDismiss).toHaveBeenCalledWith("acct-1")
  })

  it("renders collapsed state when accepted", () => {
    render(<RuleCard rule={accountMappingRule} {...defaultProps} status="accepted" />)

    expect(screen.getByText(accountMappingRule.statement)).toBeInTheDocument()
    expect(screen.getByText("Undo")).toBeInTheDocument()
    expect(screen.queryByText("Accept as Rule")).not.toBeInTheDocument()
  })

  it("calls onUndo when Undo is clicked in accepted state", async () => {
    const onUndo = vi.fn()
    const user = userEvent.setup()
    render(<RuleCard rule={accountMappingRule} {...defaultProps} status="accepted" onUndo={onUndo} />)

    await user.click(screen.getByText("Undo"))
    expect(onUndo).toHaveBeenCalledWith("acct-1")
  })
})
