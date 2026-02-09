import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ExportDialog } from "./ExportDialog"

vi.mock("@/lib/export", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/export")>("@/lib/export")
  return {
    ...actual,
    triggerDownload: vi.fn(),
  }
})

vi.mock("sonner", () => ({
  toast: { success: vi.fn() },
}))

describe("ExportDialog", () => {
  it("renders the trigger button", () => {
    render(<ExportDialog />)
    expect(
      screen.getByRole("button", { name: /export report/i }),
    ).toBeInTheDocument()
  })

  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(<ExportDialog />)
    await user.click(screen.getByRole("button", { name: /export report/i }))
    expect(
      screen.getByRole("heading", { name: /export report/i }),
    ).toBeInTheDocument()
  })

  it("shows all KPI checkboxes checked by default", async () => {
    const user = userEvent.setup()
    render(<ExportDialog />)
    await user.click(screen.getByRole("button", { name: /export report/i }))

    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes).toHaveLength(5)
    checkboxes.forEach((cb) => {
      expect(cb).toBeChecked()
    })
  })

  it("shows PDF format selected by default", async () => {
    const user = userEvent.setup()
    render(<ExportDialog />)
    await user.click(screen.getByRole("button", { name: /export report/i }))

    const pdfRadio = screen.getByRole("radio", { name: /pdf/i })
    expect(pdfRadio).toBeChecked()
  })

  it("unchecking a KPI updates preview count", async () => {
    const user = userEvent.setup()
    render(<ExportDialog />)
    await user.click(screen.getByRole("button", { name: /export report/i }))

    expect(screen.getByText(/5 of 5 KPIs/)).toBeInTheDocument()

    const firstCheckbox = screen.getAllByRole("checkbox")[0]
    await user.click(firstCheckbox)

    expect(screen.getByText(/4 of 5 KPIs/)).toBeInTheDocument()
  })

  it("Deselect All unchecks all KPIs", async () => {
    const user = userEvent.setup()
    render(<ExportDialog />)
    await user.click(screen.getByRole("button", { name: /export report/i }))
    await user.click(screen.getByRole("button", { name: /deselect all/i }))

    const checkboxes = screen.getAllByRole("checkbox")
    checkboxes.forEach((cb) => {
      expect(cb).not.toBeChecked()
    })
  })

  it("Select All checks all KPIs after deselecting", async () => {
    const user = userEvent.setup()
    render(<ExportDialog />)
    await user.click(screen.getByRole("button", { name: /export report/i }))
    await user.click(screen.getByRole("button", { name: /deselect all/i }))
    await user.click(screen.getByRole("button", { name: /select all/i }))

    const checkboxes = screen.getAllByRole("checkbox")
    checkboxes.forEach((cb) => {
      expect(cb).toBeChecked()
    })
  })

  it("disables Generate Report when no KPIs are selected", async () => {
    const user = userEvent.setup()
    render(<ExportDialog />)
    await user.click(screen.getByRole("button", { name: /export report/i }))
    await user.click(screen.getByRole("button", { name: /deselect all/i }))

    expect(
      screen.getByRole("button", { name: /generate report/i }),
    ).toBeDisabled()
  })

  it("calls triggerDownload when Generate Report is clicked", async () => {
    const { triggerDownload } = await import("@/lib/export")
    const user = userEvent.setup()
    render(<ExportDialog />)
    await user.click(screen.getByRole("button", { name: /export report/i }))
    await user.click(screen.getByRole("button", { name: /generate report/i }))

    expect(triggerDownload).toHaveBeenCalled()
  })
})
