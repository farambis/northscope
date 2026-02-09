import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { KpiSummaryHeader } from "./KpiSummaryHeader"

describe("KpiSummaryHeader", () => {
  const defaultProps = {
    label: "Monthly Recurring Revenue",
    value: "$47.2k",
    change: { value: 12.3, isPositive: true },
    context: "vs. $42.1k last month",
  }

  it("renders label, value, change, and context", () => {
    render(<KpiSummaryHeader {...defaultProps} />)

    expect(screen.getByText("Monthly Recurring Revenue")).toBeInTheDocument()
    expect(screen.getByText("$47.2k")).toBeInTheDocument()
    expect(screen.getByText("12.3%")).toBeInTheDocument()
    expect(screen.getByText("vs. $42.1k last month")).toBeInTheDocument()
  })

  it("shows positive styling for positive change", () => {
    render(<KpiSummaryHeader {...defaultProps} />)

    const changeEl = screen.getByText("12.3%").closest("div")
    expect(changeEl).toHaveClass("text-positive")
  })

  it("shows negative styling for negative change", () => {
    render(
      <KpiSummaryHeader
        {...defaultProps}
        change={{ value: -5.2, isPositive: false }}
      />,
    )

    const changeEl = screen.getByText("5.2%").closest("div")
    expect(changeEl).toHaveClass("text-negative")
  })

  it("renders a badge when provided", () => {
    render(
      <KpiSummaryHeader
        {...defaultProps}
        badge={{ text: "GROWING", variant: "positive" }}
      />,
    )

    expect(screen.getByText("GROWING")).toBeInTheDocument()
  })
})
