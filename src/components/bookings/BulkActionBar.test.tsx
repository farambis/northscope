import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { BulkActionBar } from "./BulkActionBar"
import type { Tag } from "@/types/anomaly"

const tags: Tag[] = [
  { id: "reviewed", label: "Reviewed", color: "blue" },
]

const defaultProps = {
  selectedCount: 3,
  availableTags: tags,
  selectedTagIds: [] as string[],
  onDismiss: vi.fn(),
  onMarkIntended: vi.fn(),
  onToggleTag: vi.fn(),
  onCreateTag: vi.fn(),
  onClear: vi.fn(),
}

describe("BulkActionBar", () => {
  it("renders selection count", () => {
    render(<BulkActionBar {...defaultProps} />)

    expect(screen.getByText("3 selected")).toBeInTheDocument()
  })

  it("returns null when selectedCount is 0", () => {
    const { container } = render(<BulkActionBar {...defaultProps} selectedCount={0} />)

    expect(container.innerHTML).toBe("")
  })

  it("calls onDismiss when Dismiss is clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<BulkActionBar {...defaultProps} onDismiss={onDismiss} />)

    await user.click(screen.getByRole("button", { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalled()
  })

  it("calls onMarkIntended when Mark as Intended is clicked", async () => {
    const user = userEvent.setup()
    const onMarkIntended = vi.fn()
    render(<BulkActionBar {...defaultProps} onMarkIntended={onMarkIntended} />)

    await user.click(screen.getByRole("button", { name: /mark as intended/i }))
    expect(onMarkIntended).toHaveBeenCalled()
  })

  it("calls onClear when Clear is clicked", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<BulkActionBar {...defaultProps} onClear={onClear} />)

    await user.click(screen.getByRole("button", { name: /clear/i }))
    expect(onClear).toHaveBeenCalled()
  })

  it("renders the Tag dropdown", () => {
    render(<BulkActionBar {...defaultProps} />)

    expect(screen.getByRole("button", { name: /tag/i })).toBeInTheDocument()
  })
})
