import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ViewToggle } from "./ViewToggle"

describe("ViewToggle", () => {
  it("renders both toggle items with aria-labels", () => {
    render(<ViewToggle value="cards" onChange={vi.fn()} />)

    expect(screen.getByRole("radio", { name: /cards view/i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /table view/i })).toBeInTheDocument()
  })

  it("has cards pressed when value is cards", () => {
    render(<ViewToggle value="cards" onChange={vi.fn()} />)

    expect(screen.getByRole("radio", { name: /cards view/i })).toHaveAttribute("data-state", "on")
    expect(screen.getByRole("radio", { name: /table view/i })).toHaveAttribute("data-state", "off")
  })

  it("has table pressed when value is table", () => {
    render(<ViewToggle value="table" onChange={vi.fn()} />)

    expect(screen.getByRole("radio", { name: /cards view/i })).toHaveAttribute("data-state", "off")
    expect(screen.getByRole("radio", { name: /table view/i })).toHaveAttribute("data-state", "on")
  })

  it("calls onChange with 'table' when table toggle is clicked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ViewToggle value="cards" onChange={onChange} />)

    await user.click(screen.getByRole("radio", { name: /table view/i }))
    expect(onChange).toHaveBeenCalledWith("table")
  })

  it("calls onChange with 'cards' when cards toggle is clicked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ViewToggle value="table" onChange={onChange} />)

    await user.click(screen.getByRole("radio", { name: /cards view/i }))
    expect(onChange).toHaveBeenCalledWith("cards")
  })
})
