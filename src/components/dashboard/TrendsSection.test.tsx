import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TrendsSection } from "./TrendsSection"

describe("TrendsSection", () => {
  it('renders "Trends" heading', () => {
    render(<TrendsSection />)
    expect(screen.getByText("Trends")).toBeInTheDocument()
  })

  it("renders all 4 time range tabs", () => {
    render(<TrendsSection />)
    expect(screen.getByRole("tab", { name: "7D" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "30D" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "90D" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "1Y" })).toBeInTheDocument()
  })

  it('"30D" tab is active by default', () => {
    render(<TrendsSection />)
    const tab30d = screen.getByRole("tab", { name: "30D" })
    expect(tab30d).toHaveAttribute("aria-selected", "true")
  })
})
