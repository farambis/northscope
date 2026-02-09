import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { DashboardHeader } from "./DashboardHeader"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}))

import { usePathname } from "next/navigation"

const mockUsePathname = vi.mocked(usePathname)

describe("DashboardHeader", () => {
  it("marks Dashboard as active on the home page", () => {
    mockUsePathname.mockReturnValue("/")
    render(<DashboardHeader />)

    const dashboardLink = screen.getByText("Dashboard")
    expect(dashboardLink).toHaveClass("text-foreground")
  })

  it("marks Dashboard as active on KPI detail pages", () => {
    mockUsePathname.mockReturnValue("/kpi/mrr")
    render(<DashboardHeader />)

    const dashboardLink = screen.getByText("Dashboard")
    expect(dashboardLink).toHaveClass("text-foreground")
  })

  it("does not mark Reports as active on the home page", () => {
    mockUsePathname.mockReturnValue("/")
    render(<DashboardHeader />)

    const reportsLink = screen.getByText("Reports")
    expect(reportsLink).toHaveClass("text-muted-foreground")
  })

  it("marks Reports as active on the reports page", () => {
    mockUsePathname.mockReturnValue("/reports")
    render(<DashboardHeader />)

    const reportsLink = screen.getByText("Reports")
    expect(reportsLink).toHaveClass("text-foreground")
  })

  it("does not mark Dashboard as active on /reports", () => {
    mockUsePathname.mockReturnValue("/reports")
    render(<DashboardHeader />)

    const dashboardLink = screen.getByText("Dashboard")
    expect(dashboardLink).toHaveClass("text-muted-foreground")
  })
})
