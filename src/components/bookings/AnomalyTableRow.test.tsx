import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { AnomalyTableRow } from "./AnomalyTableRow"
import type { AnomalyGroup, Tag } from "@/types/anomaly"

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
  entries: [
    { id: "e-601", text: "Monthly rent paymnet", amount: 3200.0, date: "2025-02-01" },
  ],
}

const mockTags: Tag[] = [
  { id: "reviewed", label: "Reviewed", color: "blue" },
]

function renderRow(props: Partial<React.ComponentProps<typeof AnomalyTableRow>> = {}) {
  return render(
    <table>
      <tbody>
        <AnomalyTableRow
          group={similarGroup}
          selected={false}
          onSelectChange={vi.fn()}
          onDismiss={vi.fn()}
          onAction={vi.fn()}
          onMarkIntended={vi.fn()}
          tags={[]}
          {...props}
        />
      </tbody>
    </table>,
  )
}

describe("AnomalyTableRow", () => {
  it("renders type badge, text, amount, date, and confidence", () => {
    renderRow()

    expect(screen.getByText("SIMILAR")).toBeInTheDocument()
    expect(screen.getByText(/Bürobedarf Amazon \(\+1\)/)).toBeInTheDocument()
    expect(screen.getByText("149.99")).toBeInTheDocument()
    expect(screen.getByText("HIGH")).toBeInTheDocument()
  })

  it("calls onSelectChange when checkbox is clicked", async () => {
    const user = userEvent.setup()
    const onSelectChange = vi.fn()
    renderRow({ onSelectChange })

    await user.click(screen.getByRole("checkbox"))
    expect(onSelectChange).toHaveBeenCalledWith("sim-1", true)
  })

  it("expands detail panel when row is clicked", async () => {
    const user = userEvent.setup()
    renderRow()

    expect(screen.queryByText(/Review & Fix/)).not.toBeInTheDocument()
    await user.click(screen.getByText("SIMILAR"))
    expect(screen.getByText(/Review & Fix/)).toBeInTheDocument()
  })

  it("collapses detail panel when row is clicked again", async () => {
    const user = userEvent.setup()
    renderRow()

    await user.click(screen.getByText("SIMILAR"))
    expect(screen.getByText(/Review & Fix/)).toBeInTheDocument()

    await user.click(screen.getByText("SIMILAR"))
    expect(screen.queryByText(/Review & Fix/)).not.toBeInTheDocument()
  })

  it("calls onDismiss from expanded panel", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    renderRow({ onDismiss })

    await user.click(screen.getByText("SIMILAR"))
    await user.click(screen.getByRole("button", { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledWith("sim-1")
  })

  it("calls onAction from expanded panel", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    renderRow({ onAction })

    await user.click(screen.getByText("SIMILAR"))
    await user.click(screen.getByRole("button", { name: /review & fix/i }))
    expect(onAction).toHaveBeenCalledWith("sim-1")
  })

  it("calls onMarkIntended from expanded panel", async () => {
    const user = userEvent.setup()
    const onMarkIntended = vi.fn()
    renderRow({ onMarkIntended })

    await user.click(screen.getByText("SIMILAR"))
    await user.click(screen.getByRole("button", { name: /mark as intended/i }))
    expect(onMarkIntended).toHaveBeenCalledWith("sim-1")
  })

  it("shows tag badges when tags are assigned", () => {
    renderRow({ tags: mockTags })

    expect(screen.getByText("Reviewed")).toBeInTheDocument()
  })

  it("renders typo group with correct action label", async () => {
    const user = userEvent.setup()
    renderRow({ group: typoGroup })

    await user.click(screen.getByText("TYPO"))
    expect(screen.getByRole("button", { name: /apply correction/i })).toBeInTheDocument()
  })

  it("does not toggle expand when checkbox is clicked", async () => {
    const user = userEvent.setup()
    renderRow()

    await user.click(screen.getByRole("checkbox"))
    expect(screen.queryByText(/Review & Fix/)).not.toBeInTheDocument()
  })
})
