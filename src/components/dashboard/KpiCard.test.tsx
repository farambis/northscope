import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { KpiCard } from "./KpiCard"

describe("KpiCard", () => {
  const defaultProps = {
    id: "mrr" as const,
    label: "Monthly Recurring Revenue",
    value: "$47.2k",
    change: { value: 12.3, isPositive: true },
    context: "vs. $42.1k last month",
  }

  it("renders the label, value, change, and context", () => {
    render(<KpiCard {...defaultProps} />)

    expect(screen.getByText("Monthly Recurring Revenue")).toBeInTheDocument()
    expect(screen.getByText("$47.2k")).toBeInTheDocument()
    expect(screen.getByText("12.3%")).toBeInTheDocument()
    expect(screen.getByText("vs. $42.1k last month")).toBeInTheDocument()
  })

  it("shows an up arrow for positive change", () => {
    render(<KpiCard {...defaultProps} />)

    expect(screen.getByText("12.3%").closest("div")).toHaveTextContent("↑")
  })

  it("shows a down arrow for negative change", () => {
    render(
      <KpiCard {...defaultProps} change={{ value: -5.2, isPositive: false }} />,
    )

    expect(screen.getByText("5.2%").closest("div")).toHaveTextContent("↓")
  })

  it("applies positive color class for positive change", () => {
    render(<KpiCard {...defaultProps} />)

    const changeEl = screen.getByText("12.3%").closest("div")
    expect(changeEl).toHaveClass("text-positive")
  })

  it("applies negative color class for negative change", () => {
    render(
      <KpiCard {...defaultProps} change={{ value: -5.2, isPositive: false }} />,
    )

    const changeEl = screen.getByText("5.2%").closest("div")
    expect(changeEl).toHaveClass("text-negative")
  })

  it("renders a badge when provided", () => {
    render(
      <KpiCard
        {...defaultProps}
        badge={{ text: "GROWING", variant: "positive" }}
      />,
    )

    expect(screen.getByText("GROWING")).toBeInTheDocument()
  })

  it("does not render a badge when not provided", () => {
    render(<KpiCard {...defaultProps} />)

    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("renders as a link to the KPI detail page", () => {
    render(<KpiCard {...defaultProps} />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/kpi/mrr")
  })
})
