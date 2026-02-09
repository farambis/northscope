import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ConfidenceBadge } from "./ConfidenceBadge"

describe("ConfidenceBadge", () => {
  it("renders HIGH with negative variant for confidence >= 90", () => {
    render(<ConfidenceBadge confidence={95} />)

    const badge = screen.getByText("HIGH")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("bg-negative/10")
  })

  it("renders HIGH at exactly 90", () => {
    render(<ConfidenceBadge confidence={90} />)

    expect(screen.getByText("HIGH")).toBeInTheDocument()
    expect(screen.getByText("HIGH")).toHaveClass("bg-negative/10")
  })

  it("renders MEDIUM with warning variant for confidence 70-89", () => {
    render(<ConfidenceBadge confidence={75} />)

    const badge = screen.getByText("MEDIUM")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("bg-warning/10")
  })

  it("renders MEDIUM at exactly 70", () => {
    render(<ConfidenceBadge confidence={70} />)

    expect(screen.getByText("MEDIUM")).toBeInTheDocument()
    expect(screen.getByText("MEDIUM")).toHaveClass("bg-warning/10")
  })

  it("renders LOW with positive variant for confidence < 70", () => {
    render(<ConfidenceBadge confidence={50} />)

    const badge = screen.getByText("LOW")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("bg-positive/10")
  })
})
