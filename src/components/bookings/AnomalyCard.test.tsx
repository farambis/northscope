import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { AnomalyCard } from "./AnomalyCard"
import type { AnomalyGroup } from "@/types/anomaly"

const similarGroup: AnomalyGroup = {
  id: "sim-1",
  type: "similar",
  confidence: 92,
  suggestion: "Bürobedarf Amazon",
  entries: [
    { id: "e-101", text: "Bürobedarf Amazon", amount: 149.99, date: "2025-01-15" },
    { id: "e-102", text: "bürobedarf Amazon", amount: 89.5, date: "2025-01-22" },
  ],
}

const typoGroup: AnomalyGroup = {
  id: "typo-1",
  type: "typo",
  confidence: 95,
  matchedPattern: "Monthly rent payment",
  matchedPatternCount: 24,
  diffDetails: '"paymnet" \u2192 "payment"',
  entries: [
    { id: "e-601", text: "Monthly rent paymnet", amount: 3200.0, date: "2025-02-01" },
  ],
}

const unusualGroup: AnomalyGroup = {
  id: "unusual-1",
  type: "unusual",
  confidence: 97,
  reasons: ["Contains test data pattern", "Non-descriptive text"],
  entries: [
    { id: "e-1001", text: "asdf test 123", amount: 1.0, date: "2025-02-05" },
  ],
}

describe("AnomalyCard", () => {
  it("renders similar type badge", () => {
    render(<AnomalyCard group={similarGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
  })

  it("renders typo type badge", () => {
    render(<AnomalyCard group={typoGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByText("TYPO")).toBeInTheDocument()
  })

  it("renders unusual type badge", () => {
    render(<AnomalyCard group={unusualGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByText("UNUSUAL")).toBeInTheDocument()
  })

  it("renders confidence badge for similar group", () => {
    render(<AnomalyCard group={similarGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByText("HIGH")).toBeInTheDocument()
  })

  it("renders all entries for similar type", () => {
    render(<AnomalyCard group={similarGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByText(/149\.99/)).toBeInTheDocument()
    expect(screen.getByText(/89\.50/)).toBeInTheDocument()
  })

  it("renders matched pattern info for typo type", () => {
    render(<AnomalyCard group={typoGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByText(/Monthly rent payment/)).toBeInTheDocument()
    expect(screen.getByText(/24 occurrences/)).toBeInTheDocument()
  })

  it("renders reason tags for unusual type", () => {
    render(<AnomalyCard group={unusualGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByText("Contains test data pattern")).toBeInTheDocument()
    expect(screen.getByText("Non-descriptive text")).toBeInTheDocument()
  })

  it("renders the entry text for unusual type", () => {
    render(<AnomalyCard group={unusualGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByText("asdf test 123")).toBeInTheDocument()
  })

  it("calls onDismiss when dismiss button is clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<AnomalyCard group={similarGroup} onDismiss={onDismiss} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledWith("sim-1")
  })

  it("calls onAction when the primary action button is clicked", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<AnomalyCard group={similarGroup} onDismiss={vi.fn()} onAction={onAction} onMarkIntended={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: /review & fix/i }))
    expect(onAction).toHaveBeenCalledWith("sim-1")
  })

  it("shows Mark as Intended button", () => {
    render(<AnomalyCard group={similarGroup} onDismiss={vi.fn()} onAction={vi.fn()} onMarkIntended={vi.fn()} />)

    expect(screen.getByRole("button", { name: /mark as intended/i })).toBeInTheDocument()
  })

  it("calls onMarkIntended when Mark as Intended button is clicked", async () => {
    const user = userEvent.setup()
    const onMarkIntended = vi.fn()
    const onDismiss = vi.fn()
    render(<AnomalyCard group={similarGroup} onDismiss={onDismiss} onAction={vi.fn()} onMarkIntended={onMarkIntended} />)

    await user.click(screen.getByRole("button", { name: /mark as intended/i }))
    expect(onMarkIntended).toHaveBeenCalledWith("sim-1")
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
