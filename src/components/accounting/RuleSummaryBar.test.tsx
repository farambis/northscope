import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { RuleSummaryBar } from "./RuleSummaryBar"
import type { RuleSuggestion } from "@/types/rule"

const mockRules: RuleSuggestion[] = [
  { id: "a1", type: "account-mapping", confidence: 95, statement: "s", evidence: "e" },
  { id: "a2", type: "account-mapping", confidence: 90, statement: "s", evidence: "e" },
  { id: "t1", type: "tax-code", confidence: 80, statement: "s", evidence: "e" },
  { id: "r1", type: "recurring", confidence: 98, statement: "s", evidence: "e" },
]

describe("RuleSummaryBar", () => {
  it("shows the total count", () => {
    render(<RuleSummaryBar rules={mockRules} />)

    expect(screen.getByTestId("total-count")).toHaveTextContent("4")
  })

  it("shows the correct account-mapping count", () => {
    render(<RuleSummaryBar rules={mockRules} />)

    expect(screen.getByTestId("account-mapping-count")).toHaveTextContent("2")
  })

  it("shows the correct tax-code count", () => {
    render(<RuleSummaryBar rules={mockRules} />)

    expect(screen.getByTestId("tax-code-count")).toHaveTextContent("1")
  })

  it("shows the correct recurring count", () => {
    render(<RuleSummaryBar rules={mockRules} />)

    expect(screen.getByTestId("recurring-count")).toHaveTextContent("1")
  })

  it("shows zero counts when no rules provided", () => {
    render(<RuleSummaryBar rules={[]} />)

    expect(screen.getByTestId("total-count")).toHaveTextContent("0")
    expect(screen.getByTestId("account-mapping-count")).toHaveTextContent("0")
    expect(screen.getByTestId("tax-code-count")).toHaveTextContent("0")
    expect(screen.getByTestId("recurring-count")).toHaveTextContent("0")
  })
})
