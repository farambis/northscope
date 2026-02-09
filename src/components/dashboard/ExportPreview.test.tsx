import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ExportPreview } from "./ExportPreview"

describe("ExportPreview", () => {
  it("shows selected KPI count", () => {
    render(<ExportPreview format="markdown" selectedCount={3} />)
    expect(screen.getByText(/3 of 5 KPIs/)).toBeInTheDocument()
  })

  it('shows "Markdown" for markdown format', () => {
    render(<ExportPreview format="markdown" selectedCount={5} />)
    expect(screen.getByText(/Markdown/)).toBeInTheDocument()
  })

  it('shows "JSON" for json format', () => {
    render(<ExportPreview format="json" selectedCount={5} />)
    expect(screen.getByText(/JSON/)).toBeInTheDocument()
  })

  it("shows Markdown preview note for pdf format", () => {
    render(<ExportPreview format="pdf" selectedCount={5} />)
    expect(screen.getByText(/Markdown preview/)).toBeInTheDocument()
  })

  it("shows Markdown preview note for pptx format", () => {
    render(<ExportPreview format="pptx" selectedCount={5} />)
    expect(screen.getByText(/Markdown preview/)).toBeInTheDocument()
  })
})
