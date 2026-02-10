import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { TagDropdown } from "./TagDropdown"
import type { Tag } from "@/types/anomaly"

const tags: Tag[] = [
  { id: "reviewed", label: "Reviewed", color: "blue" },
  { id: "false-positive", label: "False positive", color: "emerald" },
]

describe("TagDropdown", () => {
  it("renders the trigger button", () => {
    render(
      <TagDropdown
        availableTags={tags}
        selectedTagIds={[]}
        onToggleTag={vi.fn()}
        onCreateTag={vi.fn()}
      />,
    )

    expect(screen.getByRole("button", { name: /tag/i })).toBeInTheDocument()
  })

  it("shows tag list when opened", async () => {
    const user = userEvent.setup()
    render(
      <TagDropdown
        availableTags={tags}
        selectedTagIds={[]}
        onToggleTag={vi.fn()}
        onCreateTag={vi.fn()}
      />,
    )

    await user.click(screen.getByRole("button", { name: /tag/i }))
    expect(screen.getByText("Reviewed")).toBeInTheDocument()
    expect(screen.getByText("False positive")).toBeInTheDocument()
  })

  it("calls onToggleTag when a tag checkbox is clicked", async () => {
    const user = userEvent.setup()
    const onToggleTag = vi.fn()
    render(
      <TagDropdown
        availableTags={tags}
        selectedTagIds={[]}
        onToggleTag={onToggleTag}
        onCreateTag={vi.fn()}
      />,
    )

    await user.click(screen.getByRole("button", { name: /tag/i }))
    await user.click(screen.getByLabelText("Reviewed"))
    expect(onToggleTag).toHaveBeenCalledWith("reviewed")
  })

  it("shows pre-selected tags as checked", async () => {
    const user = userEvent.setup()
    render(
      <TagDropdown
        availableTags={tags}
        selectedTagIds={["reviewed"]}
        onToggleTag={vi.fn()}
        onCreateTag={vi.fn()}
      />,
    )

    await user.click(screen.getByRole("button", { name: /tag/i }))
    const checkbox = screen.getByRole("checkbox", { name: "Reviewed" })
    expect(checkbox).toHaveAttribute("data-state", "checked")
  })

  it("calls onCreateTag when Enter is pressed in the input", async () => {
    const user = userEvent.setup()
    const onCreateTag = vi.fn()
    render(
      <TagDropdown
        availableTags={tags}
        selectedTagIds={[]}
        onToggleTag={vi.fn()}
        onCreateTag={onCreateTag}
      />,
    )

    await user.click(screen.getByRole("button", { name: /tag/i }))
    const input = screen.getByPlaceholderText(/create new tag/i)
    await user.type(input, "Urgent{Enter}")
    expect(onCreateTag).toHaveBeenCalledWith("Urgent")
  })

  it("clears input after creating a tag", async () => {
    const user = userEvent.setup()
    render(
      <TagDropdown
        availableTags={tags}
        selectedTagIds={[]}
        onToggleTag={vi.fn()}
        onCreateTag={vi.fn()}
      />,
    )

    await user.click(screen.getByRole("button", { name: /tag/i }))
    const input = screen.getByPlaceholderText(/create new tag/i)
    await user.type(input, "Urgent{Enter}")
    expect(input).toHaveValue("")
  })
})
