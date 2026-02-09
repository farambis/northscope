import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { KpiDetailChart } from "./KpiDetailChart"

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts")
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  }
})

describe("KpiDetailChart", () => {
  it("renders the chart container", () => {
    const { container } = render(
      <KpiDetailChart kpiId="mrr" color="var(--chart-1)" />,
    )

    expect(container.querySelector(".recharts-wrapper")).toBeInTheDocument()
  })

  it("renders time range tabs", () => {
    render(<KpiDetailChart kpiId="mrr" color="var(--chart-1)" />)

    expect(screen.getByText("7D")).toBeInTheDocument()
    expect(screen.getByText("30D")).toBeInTheDocument()
    expect(screen.getByText("90D")).toBeInTheDocument()
    expect(screen.getByText("1Y")).toBeInTheDocument()
  })

  it("renders the Trend title", () => {
    render(<KpiDetailChart kpiId="mrr" color="var(--chart-1)" />)

    expect(screen.getByText("Trend")).toBeInTheDocument()
  })

  it("renders the forecast switch on by default", () => {
    render(<KpiDetailChart kpiId="mrr" color="var(--chart-1)" />)

    const toggle = screen.getByRole("switch")
    expect(toggle).toHaveAttribute("data-state", "checked")
  })

  it("renders the dynamic forecast label with day count", () => {
    render(<KpiDetailChart kpiId="mrr" color="var(--chart-1)" />)

    expect(screen.getByText("Show 10-day forecast")).toBeInTheDocument()
  })
})
